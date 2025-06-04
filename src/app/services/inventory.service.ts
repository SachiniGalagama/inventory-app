import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  getDoc,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { InventoryItem } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private getUserId(): Promise<string> {
  return new Promise((resolve, reject) => {
    const unsubscribe = this.auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        console.log('[getUserId] Logged-in UID:', user.uid); // ✅ Debug log
        resolve(user.uid);
      } else {
        console.warn('[getUserId] No user logged in'); // ✅ Debug log
        reject(new Error('User not logged in'));
      }
    });
  });
}

  async addItem(item: InventoryItem, userId?: string) {
    userId = userId || (await this.getUserId());
    const itemsRef = collection(this.firestore, 'inventory');
    const q = query(
      itemsRef,
      where('name', '==', item.name),
      where('userId', '==', userId),
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      const existingItem = existing.docs[0];
      const currentStock = existingItem.data()['stock'] || 0;
      await updateDoc(existingItem.ref, { stock: currentStock + item.stock });
    } else {
      await addDoc(itemsRef, {
        ...item,
        userId,
        createdAt: Timestamp.now(),
      });
    }
  }

  async getItems(userId?: string): Promise<InventoryItem[]> {
    userId = userId || (await this.getUserId());
    
    const itemsRef = collection(this.firestore, 'inventory');
    const q = query(itemsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as InventoryItem,
    );
  }

  async updateItem(itemId: string, data: Partial<InventoryItem>) {
  const itemRef = doc(this.firestore, 'inventory', itemId);
  await updateDoc(itemRef, data);
}

  async deleteItem(itemId: string) {
    const itemRef = doc(this.firestore, 'inventory', itemId);
    await deleteDoc(itemRef);
  }

  async getItemById(itemId: string): Promise<InventoryItem | null> {
    const itemRef = doc(this.firestore, 'inventory', itemId);
    const snapshot = await getDoc(itemRef);
    const data = snapshot.data();
    return data ? ({ id: itemId, ...data } as InventoryItem) : null;
  }

  async getItemByName(name: string, userId?: string): Promise<InventoryItem | undefined> {
    userId = userId || (await this.getUserId());
    const itemsRef = collection(this.firestore, 'inventory');
    const q = query(
      itemsRef,
      where('name', '==', name),
      where('userId', '==', userId),
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as InventoryItem;
    }

    return undefined;
  }

  async getOrderHistory(
    productName: string,
    userId?: string,
  ): Promise<{ date: string; quantity: number }[]> {
    userId = userId || (await this.getUserId());
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const history: { date: string; quantity: number }[] = [];

    snapshot.docs.forEach((docSnap) => {
      const order = docSnap.data();
      const date = order['orderDate']?.toDate().toISOString().split('T')[0];

      order['items']?.forEach((item: any) => {
        if (item.productName === productName) {
          history.push({ date, quantity: item.quantity });
        }
      });
    });

    return history;
  }

  async calculateStockoutRisk(userId?: string): Promise<any[]> {
    const forecasts = await this.forecastNextWeekRequirements(userId);
    const items = await this.getItems(userId);

    return forecasts.map((forecast) => {
      const item = items.find((i) => i.id === forecast.productId);
      const daysLeft = item && forecast.nextWeekQty > 0
        ? Math.floor(item.stock / (forecast.nextWeekQty / 7))
        : null;
      return {
        ...forecast,
        stock: item?.stock || 0,
        estimatedDaysLeft: daysLeft,
        risk:
          daysLeft === null ? 'Unknown'
            : daysLeft <= 7 ? 'High'
            : daysLeft <= 14 ? 'Medium'
            : 'Low',
      };
    }).sort((a, b) => (a.estimatedDaysLeft ?? 9999) - (b.estimatedDaysLeft ?? 9999));
  }

  async calculateReorderSuggestions(leadTime = 7, userId?: string): Promise<any[]> {
    const forecasts = await this.forecastNextWeekRequirements(userId);
    const items = await this.getItems(userId);

    return forecasts.map((forecast) => {
      const item = items.find((i) => i.id === forecast.productId);
      const reorderQty = forecast.nextWeekQty - (item?.stock || 0);
      return {
        ...forecast,
        stock: item?.stock || 0,
        leadTime,
        expectedUsage: forecast.nextWeekQty,
        reorderQuantity: reorderQty > 0 ? Math.ceil(reorderQty) : 0,
        needsReorder: reorderQty > 0,
      };
    }).filter(item => item.needsReorder);
  }

  async forecastNextWeekRequirements(userId?: string): Promise<
    {
      name: string;
      productId: string;
      nextWeekQty: number;
      category?: string;
    }[]
  > {
    userId = userId || (await this.getUserId());

    const ordersSnap = await getDocs(
      query(collection(this.firestore, 'orders'), where('userId', '==', userId)),
    );

    const consumptionMap: Record<
      string,
      { name: string; category?: string; totalQty: number; days: Set<string> }
    > = {};

    for (const docSnap of ordersSnap.docs) {
      const order = docSnap.data();
      const dateStr = order['orderDate']?.toDate().toISOString().split('T')[0];

      if (!order['items'] || !order['orderDate']) continue;

      for (const item of order['items']) {
        const id = item.productId;
        if (!consumptionMap[id]) {
          consumptionMap[id] = {
            name: item.productName,
            category: item.category,
            totalQty: 0,
            days: new Set(),
          };
        }
        consumptionMap[id].totalQty += item.quantity;
        consumptionMap[id].days.add(dateStr);
      }
    }

    const result = Object.entries(consumptionMap).map(([id, c]) => {
      const avgDaily = c.totalQty / c.days.size;
      return {
        productId: id,
        name: c.name,
        category: c.category,
        nextWeekQty: Math.ceil(avgDaily * 7),
      };
    });

    return result;
  }

  async getDemandLevels(userId?: string): Promise<any[]> {
    userId = userId || (await this.getUserId());

    const ordersSnap = await getDocs(
      query(collection(this.firestore, 'orders'), where('userId', '==', userId)),
    );
    const orderItems: Record<string, number> = {};

    for (const docSnap of ordersSnap.docs) {
      const order = docSnap.data();
      if (!order['items']) continue;

      for (const item of order['items']) {
        if (!item.productId) continue;
        orderItems[item.productId] = (orderItems[item.productId] || 0) + item.quantity;
      }
    }

    const itemsSnap = await getDocs(
      query(collection(this.firestore, 'inventory'), where('userId', '==', userId)),
    );
    const items = itemsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const allQuantities = Object.values(orderItems);
    const max = Math.max(...allQuantities, 0);
    const min = Math.min(...allQuantities, 0);
    const range = max - min;
    const highThreshold = min + range * 0.66;
    const mediumThreshold = min + range * 0.33;

    const demandData = items.map((item) => {
      const soldQty = orderItems[item.id] || 0;
      let demand: 'High' | 'Medium' | 'Low' = 'Low';

      if (soldQty >= highThreshold) demand = 'High';
      else if (soldQty >= mediumThreshold) demand = 'Medium';

      return {
        ...item,
        soldQty,
        demand,
      };
    });

    return demandData.sort((a, b) => b.soldQty - a.soldQty);
  }
}

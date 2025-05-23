import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { InventoryItem } from '../models/inventory.models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  [x: string]: any;
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  private getUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
      const unsubscribe = this.auth.onAuthStateChanged(user => {
        unsubscribe();
        if (user) resolve(user.uid);
        else reject(new Error('User not logged in'));
      });
    });
  }

  async addItem(item: InventoryItem) {
    const userId = await this.getUserId();
    const itemsRef = collection(this.firestore, 'inventory');
    const q = query(itemsRef, where('name', '==', item.name), where('userId', '==', userId));
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

  async getItems(): Promise<InventoryItem[]> {
    const userId = await this.getUserId();
    const itemsRef = collection(this.firestore, 'inventory');
    const q = query(itemsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
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
    return data ? { id: itemId, ...data } as InventoryItem : null;
  }
}

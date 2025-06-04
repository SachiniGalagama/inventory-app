import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Order } from '../models/order.model';
import { InventoryService } from './inventory.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private inventoryService: InventoryService
  ) {}

  private getUserId(): string {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      console.error('[getUserId] User not logged in');
      throw new Error('User not logged in');
    }
    console.log('[getUserId] Logged-in UID:', uid);
    return uid;
  }

  async addOrder(order: Order) {
  const userId = this.getUserId();
const ordersRef = collection(this.firestore, 'orders');


  const inventoryItems = await this.inventoryService.getItems(userId);
  console.log('[addOrder] Inventory Items:', inventoryItems);

  for (const item of order.items) {
    
    const invItem = inventoryItems.find(i => i.id === item.productId);
    console.log(`[addOrder] Checking productId=${item.productId}`);

    if (!invItem) {
      console.error(`[addOrder] Product not found: ${item.productId}`);
      throw new Error(`Product ${item.productName} not found in inventory`);
    }

    const currentStock = Number(invItem.stock);
    const quantityNeeded = Number(item.quantity);
    console.log(`[addOrder] ${item.productName} stock=${currentStock}, quantity=${quantityNeeded}`);

    const newStock = currentStock - quantityNeeded;

    if (newStock < 0) {
      console.warn(`[addOrder] Insufficient stock for ${item.productName}`);
      throw new Error(`Insufficient stock for ${item.productName}`);
    }

    await this.inventoryService.updateItem(invItem.id!, { stock: newStock });

  }

  console.log('[addOrder] Saving order:', {
  ...order,
  userId,
  orderDate: Timestamp.now(),
  status: 'Pending',
});




  console.log('[addOrder] Order added for user:', userId);
}


  async getOrders(): Promise<Order[]> {
    const userId = this.getUserId();
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    console.log('[getOrders] Found', querySnapshot.docs.length, 'orders for user:', userId);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order);
  }

  async updateOrder(orderId: string, data: Partial<Order>) {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await updateDoc(orderRef, data);
    console.log('[updateOrder] Order updated:', orderId);
  }

  async deleteOrder(orderId: string) {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await deleteDoc(orderRef);
    console.log('[deleteOrder] Order deleted:', orderId);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(this.firestore, 'orders', orderId);
    const snapshot = await getDoc(orderRef);
    return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Order) : null;
  }
}

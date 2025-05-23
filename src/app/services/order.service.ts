import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Order } from '../models/order.model';
import { InventoryService } from './inventory.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private firestore: Firestore, private auth: Auth, private inventoryService: InventoryService) {}

  private getUserId(): string {
    return this.auth.currentUser?.uid!;
  }

  async addOrder(order: Order) {
    const userId = this.getUserId();
    const ordersRef = collection(this.firestore, 'orders');

    // Update inventory stock for each order item
    for (const item of order.items) {
      // get current stock, reduce by item.quantity
      const inventoryItems = await this.inventoryService.getItems();
      const invItem = inventoryItems.find(i => i.id === item.productId);
      if (invItem) {
        const newStock = invItem.stock - item.quantity;
        if (newStock < 0) {
          throw new Error(`Insufficient stock for ${item.productName}`);
        }
        await this.inventoryService.updateItem(invItem.id!, { stock: newStock });
      }
    }

    await addDoc(ordersRef, {
      ...order,
      userId,
      orderDate: Timestamp.now(),
      status: 'Pending'
    });
  }

  async getOrders(): Promise<Order[]> {
    const userId = this.getUserId();
    const ordersRef = collection(this.firestore, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }

  async updateOrder(orderId: string, data: Partial<Order>) {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await updateDoc(orderRef, data);
  }

  async deleteOrder(orderId: string) {
    const orderRef = doc(this.firestore, 'orders', orderId);
    await deleteDoc(orderRef);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(this.firestore, 'orders', orderId);
    const snapshot = await getDocs(query(collection(this.firestore, 'orders')));
    const docData = snapshot.docs.find(doc => doc.id === orderId)?.data();
    return docData ? { id: orderId, ...docData } as Order : null;
  }
}

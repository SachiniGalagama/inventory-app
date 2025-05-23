import { Timestamp } from '@angular/fire/firestore';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  orderDate: Timestamp;   // <-- Required for your template
  createdAt: Timestamp;
}

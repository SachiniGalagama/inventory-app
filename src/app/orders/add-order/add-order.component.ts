import { Component } from '@angular/core';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory.models';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Make sure this exists
import { timestamp } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-order',
  standalone:false,
  templateUrl: './add-order.component.html',
})
export class AddOrderComponent {
  items: OrderItem[] = [{ productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }];
  inventoryItems: InventoryItem[] = [];
  totalPrice = 0;

  constructor(
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loadInventory();
  }

  async loadInventory() {
    this.inventoryItems = await this.inventoryService.getItems();
  }

  addItemRow() {
    this.items.push({ productId: '', productName: '', quantity: 1, unitPrice: 0, totalPrice: 0 });
  }

  removeItemRow(index: number) {
    this.items.splice(index, 1);
    this.calculateTotal();
  }

  onProductChange(index: number) {
    const selected = this.inventoryItems.find(i => i.id === this.items[index].productId);
    if (selected) {
      this.items[index].productName = selected.name;
      this.items[index].unitPrice = selected.unitPrice || 0;
      this.items[index].totalPrice = this.items[index].unitPrice * this.items[index].quantity;
      this.calculateTotal();
    }
  }

  onQuantityChange() {
    this.items.forEach(item => {
      item.totalPrice = item.unitPrice * item.quantity;
    });
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  async addOrder() {
    const user = await this.authService.getCurrentUser();
    const order: Order = {
      userId: user?.uid || '',
      items: this.items,
      totalPrice: this.totalPrice,
      status: 'Pending',
      createdAt: Timestamp.now(),
      orderDate: Timestamp.now(),
    };
    try {
  await this.orderService.addOrder(order);
  this.router.navigate(['/orders']);
} catch (error: unknown) {
  if (error instanceof Error) {
    alert(error.message);
  } else {
    alert('An unexpected error occurred.');
  }
}

  }
}

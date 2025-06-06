import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { InventoryItem } from '../../models/inventory.models';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-order',
  standalone: false,
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.scss',
})
export class EditOrderComponent implements OnInit {
  orderId!: string;
  items: OrderItem[] = [];
  totalPrice = 0;
  inventoryItems: InventoryItem[] = [];
  status: string = '';
  userId: string = ''; // keep userId if needed

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.inventoryItems = await this.inventoryService.getItems();

    const order = await this.orderService.getOrderById(this.orderId);
    if (order) {
      this.userId = order.userId || '';
      this.items = order.items.map((item) => {
        const inv = this.inventoryItems.find((i) => i.id === item.productId);
        return {
          ...item,
          unitPrice: inv?.unitPrice || item.unitPrice,
          totalPrice: item.quantity * (inv?.unitPrice || item.unitPrice),
        };
      });
      this.totalPrice = this.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      this.status = order.status;
    }
  }

  addItemRow() {
    this.items.push({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
  }

  removeItemRow(index: number) {
    this.items.splice(index, 1);
    if (this.items.length === 0) {
      this.totalPrice = 0;
    } else {
      this.calculateTotal();
    }
  }

  onProductChange(index: number) {
    const selected = this.inventoryItems.find(
      (i) => i.id === this.items[index].productId,
    );
    if (selected) {
      this.items[index].productName = selected.name;
      this.items[index].unitPrice = selected.unitPrice || 0;
      this.items[index].totalPrice =
        this.items[index].unitPrice * this.items[index].quantity;
      this.calculateTotal();
    }
  }

  onQuantityChange() {
    this.items.forEach((item) => {
      item.totalPrice = item.quantity * item.unitPrice;
    });
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }

  validateOrder(): boolean {
    if (this.items.length === 0) {
      alert('Order must contain at least one item.');
      return false;
    }
    for (const item of this.items) {
      if (!item.productId || item.quantity <= 0) {
        alert('Please select a valid product and quantity for all items.');
        return false;
      }
    }
    return true;
  }

  async updateOrder() {
    if (!this.validateOrder()) return;

    try {
      const updatedOrder: Partial<Order> = {
        items: this.items,
        totalPrice: this.totalPrice,
        status: this.status,
        userId: this.userId, // keep userId for Firestore rules
      };
      await this.orderService.updateOrder(this.orderId, updatedOrder);
      this.router.navigate(['/orders']);
    } catch (error) {
      alert(
        'Failed to update the order: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }
}

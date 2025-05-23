import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { InventoryItem } from '../../models/inventory.models';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-order',
  standalone:false,
  templateUrl: './edit-order.component.html',
})
export class EditOrderComponent implements OnInit {
  orderId!: string;
  items: OrderItem[] = [];
  totalPrice = 0;
  inventoryItems: InventoryItem[] = [];
  status: string = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    const order = await this.orderService.getOrderById(this.orderId);
    if (order) {
      this.items = order.items.map(item => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice
      }));
      this.totalPrice = order.totalPrice;
      this.status = order.status;
    }
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
      item.totalPrice = item.quantity * item.unitPrice;
    });
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  }

  async updateOrder() {
    const updatedOrder: Partial<Order> = {
      items: this.items,
      totalPrice: this.totalPrice,
      status: this.status
    };

    await this.orderService.updateOrder(this.orderId, updatedOrder);
    this.router.navigate(['/orders']);
  }
}

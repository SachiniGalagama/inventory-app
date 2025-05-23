import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: false,
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private router: Router) {}

  async ngOnInit() {
    this.orders = await this.orderService.getOrders();
  }

  viewOrder(id: string) {
    this.router.navigate(['/orders/edit', id]);
  }

  async deleteOrder(id: string) {
    if (confirm('Are you sure to delete this order?')) {
      await this.orderService.deleteOrder(id);
      this.orders = this.orders.filter(o => o.id !== id);
    }
  }
}

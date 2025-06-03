import { Component, OnInit } from '@angular/core';
import { Order, OrderItem } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory.models';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Timestamp } from '@angular/fire/firestore';
import { Injector } from '@angular/core';


@Component({
  selector: 'app-add-order',
  standalone: false,
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss',
})
export class AddOrderComponent implements OnInit {
  items: OrderItem[] = [
    {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    },
  ];
  inventoryItems: InventoryItem[] = [];
  suggestions: string[][] = [];
  totalPrice = 0;
  orderStatus: string = 'pending';

  constructor(
  private orderService: OrderService,
  private inventoryService: InventoryService,
  private router: Router,
  private injector: Injector // replace AuthService with Injector
) {}


  
  ngOnInit() {
  console.log('AddOrderComponent loaded');
  this.loadInventory();
  this.initializeSuggestions();
}


  async loadInventory() {
    this.inventoryItems = await this.inventoryService.getItems();
  }

  initializeSuggestions() {
    this.suggestions = this.items.map(() => []);
  }

  addItemRow() {
    this.items.push({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
    this.suggestions.push([]);
  }

  removeItemRow(index: number) {
    this.items.splice(index, 1);
    this.suggestions.splice(index, 1);
    this.calculateTotal();
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
      item.totalPrice = item.unitPrice * item.quantity;
    });
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );
  }

  normalizeProductName(i: number) {
    this.items[i].productName = this.items[i].productName.trim().toLowerCase();
  }

  suggestProductNames(i: number) {
    const input = this.items[i].productName.toLowerCase().trim();
    if (!input) {
      this.suggestions[i] = [];
      return;
    }

    const matches = this.inventoryItems
      .map((item) => item.name)
      .filter(
        (name) =>
          name.toLowerCase().startsWith(input) && name.toLowerCase() !== input,
      );

    this.suggestions[i] = matches.slice(0, 5); // limit to 5 suggestions
  }

  selectSuggestion(i: number, suggestion: string) {
    this.items[i].productName = suggestion;
    this.suggestions[i] = [];
  }

  async addOrder() {
    const authService = this.injector.get(AuthService);
const user = await authService.getCurrentUser();
    const order: Order = {
      userId: user?.uid || '',
      items: this.items,
      totalPrice: this.totalPrice,
      status: this.orderStatus.trim().toLowerCase(),
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

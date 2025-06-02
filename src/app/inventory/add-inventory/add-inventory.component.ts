import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory.models';

@Component({
  selector: 'app-add-inventory',
  standalone: false,
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent {
  item: Partial<InventoryItem> = {
    name: '',
    category: '',
    stock: 0,
    reorderLevel: 0,
    unitPrice: 0,
  };

  errorMessage: string = '';

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
  ) {}

  toLowerCaseName() {
    if (this.item.name) {
      this.item.name = this.item.name.toLowerCase();
    }
  }

  async addItem() {
    if (!this.isValidItem()) {
      return;
    }

    const existing = await this.inventoryService.getItemByName(this.item.name!);
    if (existing) {
      this.errorMessage = 'Item already exists. Updating stock instead.';
      // Optional: You could add logic here to update the existing item instead
      return;
    }

    await this.inventoryService.addItem(this.item as InventoryItem);
    this.router.navigate(['/inventory']);
  }

  isValidItem(): boolean {
    this.errorMessage = '';
    if (!this.item.name || !/^[a-z ]+$/.test(this.item.name)) {
      this.errorMessage = 'Name must contain only lowercase letters.';
      return false;
    }
    if (!this.item.category || !this.item.category.trim()) {
      this.errorMessage = 'Category is required.';
      return false;
    }
    if (
      this.item.stock == null ||
      this.item.stock < 0 ||
      this.item.unitPrice == null ||
      this.item.unitPrice < 0 ||
      this.item.reorderLevel == null ||
      this.item.reorderLevel < 0
    ) {
      this.errorMessage =
        'Stock, price, and reorder level must be non-negative numbers.';
      return false;
    }
    return true;
  }

  cancel() {
    this.router.navigate(['/inventory']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory.models';

@Component({
  selector: 'app-add-inventory',
  standalone: false,
  templateUrl: './add-inventory.component.html',
  styleUrl: './add-inventory.component.scss',
})
export class AddInventoryComponent implements OnInit {
  item: Partial<InventoryItem> = {
    name: '',
    category: '',
    stock: 0,
    reorderLevel: 0,
    unitPrice: 0,
  };

  errorMessage: string = '';

  inventoryItems: InventoryItem[] = [];

  nameSuggestions: string[] = [];
  categorySuggestions: string[] = [];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.inventoryItems = await this.inventoryService.getItems();
  }

  toLowerCaseName() {
    if (this.item.name) {
      this.item.name = this.item.name.toLowerCase();
    }
    this.updateNameSuggestions();
  }

  onCategoryChange() {
    this.updateCategorySuggestions();
  }

  updateNameSuggestions() {
    const input = (this.item.name || '').toLowerCase().trim();
    if (!input) {
      this.nameSuggestions = [];
      return;
    }
    this.nameSuggestions = this.inventoryItems
      .map(i => i.name)
      .filter(
        name =>
          name.toLowerCase().startsWith(input) &&
          name.toLowerCase() !== input
      )
      .slice(0, 5);
  }

  updateCategorySuggestions() {
    const input = (this.item.category || '').toLowerCase().trim();
    if (!input) {
      this.categorySuggestions = [];
      return;
    }
    // Get unique categories matching input
    const categories = Array.from(new Set(this.inventoryItems.map(i => i.category)));
    this.categorySuggestions = categories
      .filter(
        cat =>
          cat.toLowerCase().startsWith(input) &&
          cat.toLowerCase() !== input
      )
      .slice(0, 5);
  }

  selectNameSuggestion(name: string) {
    const selected = this.inventoryItems.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (selected) {
      this.item.name = selected.name;
      this.item.category = selected.category;
      this.item.unitPrice = selected.unitPrice;
      this.item.stock = selected.stock;
      this.item.reorderLevel = selected.reorderLevel;
    }
    this.nameSuggestions = [];
  }

  selectCategorySuggestion(category: string) {
    this.item.category = category;
    this.categorySuggestions = [];
  }

  async addItem() {
    if (!this.isValidItem()) {
      return;
    }

    const existing = await this.inventoryService.getItemByName(this.item.name!);

    if (existing) {
      // Add the quantity of the new item to the existing stock
      const newStock = (existing.stock || 0) + (this.item.stock || 0);
//       const newStock = this.item.stock || 0;  // Just take user's input as new stock
// await this.inventoryService.updateItem(existing.id!, { stock: newStock });

      // Update the existing item's stock
      await this.inventoryService.updateItem(existing.id!, { stock: newStock });

      // Optionally show a success message
      this.errorMessage = ''; // clear any error
      alert('Existing item stock updated successfully.');

      // Navigate back or refresh as needed
      this.router.navigate(['/inventory']);
      return;
    }

    // If no existing item, just add a new one
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

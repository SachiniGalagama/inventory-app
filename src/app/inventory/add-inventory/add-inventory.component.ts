import { Component } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';
import { InventoryItem } from '../../models/inventory.models';

@Component({
  selector: 'app-add-inventory',
  standalone:false,
  templateUrl: './add-inventory.component.html',
})
export class AddInventoryComponent {
  item: Partial<InventoryItem> = {
    name: '',
    category: '',
    stock: 0,
    reorderLevel: 0,
    unitPrice: 0  // ✅ Added
  };

  constructor(private inventoryService: InventoryService, private router: Router) {}

  async addItem() {
    await this.inventoryService.addItem(this.item as InventoryItem);
    this.router.navigate(['/inventory']);
  }
}

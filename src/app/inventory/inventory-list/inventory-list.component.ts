import { Component, OnInit } from '@angular/core';
import { InventoryItem } from '../../models/inventory.models';
import { InventoryService } from '../../services/inventory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-list',
  standalone: false,
  templateUrl: './inventory-list.component.html',
  styleUrl: './inventory-list.component.scss',
})
export class InventoryListComponent implements OnInit {
  items: InventoryItem[] = [];

  constructor(
    private inventoryService: InventoryService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.items = await this.inventoryService.getItems();
  }

  editItem(item: InventoryItem) {
    this.router.navigate(['/inventory/edit', item.id]);
  }

  async deleteItem(id: string) {
    if (confirm('Are you sure?')) {
      await this.inventoryService.deleteItem(id);
      this.items = this.items.filter((i) => i.id !== id);
    }
  }
}

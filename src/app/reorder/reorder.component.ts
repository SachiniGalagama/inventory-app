import { Component } from '@angular/core';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-reorder',
  standalone: false,
  templateUrl: './reorder.component.html',
  styleUrl: './reorder.component.scss',
})
export class ReorderComponent {
  reorderSuggestions: any[] = [];
  leadTime: number = 7;

  constructor(private inventoryService: InventoryService) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.reorderSuggestions =
      await this.inventoryService.calculateReorderSuggestions(this.leadTime);
  }
}

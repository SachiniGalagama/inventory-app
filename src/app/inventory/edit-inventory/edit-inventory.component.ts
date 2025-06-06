import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryItem } from '../../models/inventory.models';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-inventory',
  standalone: false,
  templateUrl: './edit-inventory.component.html',
  styleUrl: './edit-inventory.component.scss',
})
export class EditInventoryComponent implements OnInit {
  itemId!: string;
  item: Partial<InventoryItem> = {};
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private inventoryService: InventoryService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.itemId = this.route.snapshot.paramMap.get('id')!;
    const itemData = await this.inventoryService.getItemById(this.itemId);
    if (itemData) this.item = itemData;
  }

  async updateItem() {
    await this.inventoryService.updateItem(this.itemId, this.item);
    this.router.navigate(['/inventory']);
  }

  cancel() {
    this.router.navigate(['/inventory']);
  }

  toLowerCaseName() {
    if (this.item.name) {
      this.item.name = this.item.name.toLowerCase();
    }
  }
}

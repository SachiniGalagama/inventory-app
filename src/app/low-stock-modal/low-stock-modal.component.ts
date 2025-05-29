import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InventoryItem } from '../models/inventory.models';

@Component({
  selector: 'app-low-stock-modal',
  standalone: false,
  templateUrl: './low-stock-modal.component.html',
  styleUrl: './low-stock-modal.component.scss'
})
export class LowStockModalComponent {
  @Input() lowStockItems: InventoryItem[] = [];
   @Input() lowStockCount: number = 0;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
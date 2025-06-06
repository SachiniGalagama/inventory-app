import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-forecast',
  standalone: false,
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss',
})
export class ForecastComponent implements OnInit {
  stockRisks: any[] = [];
  filtered: any[] = [];
  categoryFilter: string = '';
  sortBy: string = 'daysLeft';
  uniqueCategories: string[] = [];

  constructor(private inventoryService: InventoryService) {}

  async ngOnInit() {
    this.stockRisks = await this.inventoryService.calculateStockoutRisk();
    this.extractUniqueCategories();
    this.applyFilter();
  }

  extractUniqueCategories() {
    const categories = this.stockRisks.map((i) => i.category).filter(Boolean);
    this.uniqueCategories = [...new Set(categories)];
  }

  applyFilter() {
    this.filtered = this.stockRisks
      .filter(
        (item) => !this.categoryFilter || item.category === this.categoryFilter,
      )
      .sort((a, b) => {
        if (this.sortBy === 'daysLeft')
          return (a.estimatedDaysLeft ?? 9999) - (b.estimatedDaysLeft ?? 9999);
        return a.name.localeCompare(b.name);
      });
  }
}

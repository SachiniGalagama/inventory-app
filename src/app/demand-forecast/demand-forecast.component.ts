import { Component } from '@angular/core';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-demand-forecast',
  standalone: false,
  templateUrl: './demand-forecast.component.html',
  styleUrl: './demand-forecast.component.scss',
})
export class DemandForecastComponent {
  demandData: any[] = [];

  constructor(private inventoryService: InventoryService) {}

  async loadDemandData() {
    this.demandData = await this.inventoryService.getDemandLevels();
  }

  ngOnInit() {
    this.loadDemandData();
  }
}

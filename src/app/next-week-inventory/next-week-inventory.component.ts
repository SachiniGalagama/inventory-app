import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-next-week-inventory',
  standalone: false,
  templateUrl: './next-week-inventory.component.html',
  styleUrl: './next-week-inventory.component.scss'
})
export class NextWeekInventoryComponent implements OnInit {
  nextWeekForecast: any[] = [];

  constructor(private inventoryService: InventoryService) {}

  async ngOnInit() {
    this.nextWeekForecast = await this.inventoryService.forecastNextWeekRequirements();
  }
}

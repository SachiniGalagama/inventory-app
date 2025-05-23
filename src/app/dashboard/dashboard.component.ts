import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardAiService } from '../services/dashboard-ai.service';
import { UsageService } from '../services/usage.service';

@Component({
  selector: 'app-dashboard',
  standalone:false,
  templateUrl: './dashboard.component.html',
})


export class DashboardComponent implements OnInit {
  inventory: any[] = [];
  orders: any[] = [];
  lowStockCount = 0;
  pendingOrders = 0;
  lowStockItems: any[] = [];
  inventoryChartData: any[] = [];
  orderStatusData: any[] = [];
  aiInventoryInsights: any[] = [];
  colorScheme: string = 'vivid';
  dailyUsageChartData: any[] = [];


constructor(
  private dashboardService: DashboardService,
  private aiService: DashboardAiService,
  private usageService: UsageService
) {}
  

  ngOnInit(): void {
  this.dashboardService.getInventory().subscribe(data => {
    this.inventory = data;
    this.lowStockItems = data.filter(item => item.stock <= item.reorderLevel);
    this.lowStockCount = this.lowStockItems.length;
    this.inventoryChartData = this.inventory.map(item => ({
      name: item.name,
      value: item.stock
    }));
    this.aiService.getAiInsights().subscribe(data => {
      this.aiInventoryInsights = data.filter(item => +item.predictedDaysLeft <= 7);
    });
    const today = new Date().toISOString().split('T')[0];
this.usageService.getDailyUsage(today).subscribe(data => {
  // You can use this to populate a chart or display stats
  const usageMap: any = {};
  data.forEach(log => {
    usageMap[log.itemId] = (usageMap[log.itemId] || 0) + log.quantity;
  });

  // Optionally map item names for the chart
  this.dailyUsageChartData = Object.keys(usageMap).map(id => {
    const item = this.inventory.find(inv => inv.id === id);
    return {
      name: item?.name || id,
      value: usageMap[id]
    };
  });
});
  });

  this.dashboardService.getOrders().subscribe(data => {
    this.orders = data;
    this.pendingOrders = data.filter(order => order.status === 'pending').length;

    const statusMap: any = {};
    data.forEach(order => {
      statusMap[order.status] = (statusMap[order.status] || 0) + 1;
    });
    this.orderStatusData = Object.keys(statusMap).map(status => ({
      name: status,
      value: statusMap[status]
    }));
  });
}
}

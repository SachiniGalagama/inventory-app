import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { DashboardAiService } from '../services/dashboard-ai.service';
import { UsageService } from '../services/usage.service';
import { InventoryItem } from '../models/inventory.models';
import { InventoryService } from '../services/inventory.service';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  inventory: any[] = [];
  orders: any[] = [];
  pendingOrders = 0;
  inventoryChartData: any[] = [];
  orderStatusData: any[] = [];
  aiInventoryInsights: any[] = [];
  colorScheme: string = 'vivid';
  dailyUsageChartData: any[] = [];
  forecast: number[] = [];
  showWelcomeMessage = true;
  showLowStockModal = false;
  lowStockItems: InventoryItem[] = [];
  lowStockCount = 0;
  stockoutPredictions: any[] = [];
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };
  barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Estimated Days Left' },
      },
      x: { title: { display: true, text: 'Item Name' } },
    },
  };

  sortKey = 'estimatedDaysLeft';
  sortChart() {
    this.stockoutPredictions.sort(
      (a, b) => (a[this.sortKey] ?? 0) - (b[this.sortKey] ?? 0),
    );
    this.updateChartData();
  }

  constructor(
    private dashboardService: DashboardService,
    private aiService: DashboardAiService,
    private usageService: UsageService,
    private inventoryService: InventoryService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.dashboardService.getInventory().subscribe((data) => {
      this.inventory = data;
      this.lowStockItems = data.filter(
        (item) => item.stock <= item.reorderLevel,
      );
      this.lowStockCount = this.lowStockItems.length;
      if (this.lowStockCount > 0) {
        this.showLowStockModal = true; // show modal only if low stock exists
      }
      this.inventoryChartData = this.inventory.map((item) => ({
        name: item.name,
        value: item.stock,
      }));
      this.aiService.getAiInsights().subscribe((data) => {
        this.aiInventoryInsights = data.filter(
          (item) => +item.predictedDaysLeft <= 7,
        );
      });
      const today = new Date().toISOString().split('T')[0];
      this.usageService.getDailyUsage(today).subscribe((data) => {
        // You can use this to populate a chart or display stats
        const usageMap: any = {};
        data.forEach((log) => {
          usageMap[log.itemId] = (usageMap[log.itemId] || 0) + log.quantity;
        });

        // Optionally map item names for the chart
        this.dailyUsageChartData = Object.keys(usageMap).map((id) => {
          const item = this.inventory.find((inv) => inv.id === id);
          return {
            name: item?.name || id,
            value: usageMap[id],
          };
        });
      });
      this.dashboardService.getForecast().subscribe((data) => {
        if (data?.predictions) {
          this.forecast = data.predictions;
        }
      });
    });

    this.dashboardService.getOrders().subscribe((data) => {
      this.orders = data;
      this.pendingOrders = data.filter(
        (order) => order.status === 'pending',
      ).length;

      const statusMap: any = {};
      data.forEach((order) => {
        statusMap[order.status] = (statusMap[order.status] || 0) + 1;
      });
      this.orderStatusData = Object.keys(statusMap).map((status) => ({
        name: status,
        value: statusMap[status],
      }));
    });

    this.inventoryService.calculateStockoutRisk().then((data) => {
      this.stockoutPredictions = data;
      this.updateChartData();
    });
  }

  updateChartData() {
    const validItems = this.stockoutPredictions.filter(
      (i) => i.estimatedDaysLeft !== null && i.estimatedDaysLeft !== undefined,
    );

    const labels = validItems.map((i) => i.name);
    const data = validItems.map((i) => i.estimatedDaysLeft);

    console.log('✅ Filtered Labels:', labels);
    console.log('✅ Filtered Data:', data);

    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Estimated Days Left',
          data,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  }

  onCloseModal() {
    this.showLowStockModal = false;
  }

  async predictUsage(productName: string) {
    const history = await this.inventoryService.getOrderHistory(productName);

    const response = await fetch('http://localhost:5000/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName, history }),
    });

    const result = await response.json();
    console.log('📈 Prediction Result:', result);
  }
}

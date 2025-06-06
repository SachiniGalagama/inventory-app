// dashboard-ai.service.ts
import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardAiService {
  constructor(private firestore: Firestore) {}

  getInventoryData(): Observable<any[]> {
    const inventoryRef = collection(this.firestore, 'inventory');
    return collectionData(inventoryRef, { idField: 'id' });
  }

  getOrdersData(): Observable<any[]> {
    const ordersRef = collection(this.firestore, 'orders');
    return collectionData(ordersRef, { idField: 'id' });
  }

  getAiInsights(): Observable<any[]> {
    return combineLatest([this.getInventoryData(), this.getOrdersData()]).pipe(
      map(([inventory, orders]) => {
        const usageMap: {
          [key: string]: { totalQty: number; days: Set<string> };
        } = {};

        orders.forEach((order) => {
          const date = new Date(order.date.seconds * 1000).toDateString();
          order.items.forEach((item: any) => {
            if (!usageMap[item.itemId]) {
              usageMap[item.itemId] = { totalQty: 0, days: new Set() };
            }
            usageMap[item.itemId].totalQty += item.quantity;
            usageMap[item.itemId].days.add(date);
          });
        });

        return inventory.map((item) => {
          const usage = usageMap[item.id] || { totalQty: 0, days: new Set() };
          const daysCount = usage.days.size || 1; // prevent division by zero
          const avgDailyUsage = usage.totalQty / daysCount;
          const daysUntilOut = avgDailyUsage
            ? (item.stock / avgDailyUsage).toFixed(1)
            : '∞';
          const suggestedReorder = Math.ceil(avgDailyUsage * 7); // 1 week buffer

          return {
            ...item,
            avgDailyUsage: avgDailyUsage.toFixed(2),
            predictedDaysLeft: daysUntilOut,
            reorderQuantity: suggestedReorder,
          };
        });
      }),
    );
  }
}

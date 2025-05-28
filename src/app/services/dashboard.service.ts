import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private firestore: Firestore) {}

  getInventory(): Observable<any[]> {
    const inventoryRef = collection(this.firestore, 'inventory');
    return collectionData(inventoryRef, { idField: 'id' }) as Observable<any[]>;
  }

  getOrders(): Observable<any[]> {
    const ordersRef = collection(this.firestore, 'orders');
    return collectionData(ordersRef, { idField: 'id' }) as Observable<any[]>;
  }

  getDashboardStats() {
    return this.getOrders().pipe(
      map((orders) => {
        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const totalOrders = orders.length;
        return { totalRevenue, totalOrders };
      })
    );
  }

  getForecast(): Observable<{ generated_at: any; predictions: number[] } | null> {
    const forecastDocRef = doc(this.firestore, 'forecast/latest');
    return docData(forecastDocRef, { idField: 'id' }).pipe(
      map((doc) => (doc ? doc as { generated_at: any; predictions: number[] } : null))
    );
  }

}

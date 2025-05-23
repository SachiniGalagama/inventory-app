import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsageService {
  constructor(private firestore: Firestore) {}

  getDailyUsage(date: string): Observable<any[]> {
    const usageRef = collection(this.firestore, 'inventoryUsage');
    const q = query(usageRef, where('date', '==', date));
    return collectionData(q, { idField: 'id' });
  }
}

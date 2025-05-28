// forecast.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  constructor(private firestore: Firestore) {}

  async getLatestForecast() {
    const docRef = doc(this.firestore, 'forecast/latest');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }
}

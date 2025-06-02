import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { StatCardComponent } from './stat-card/stat-card.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environment/environment';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { AddInventoryComponent } from './inventory/add-inventory/add-inventory.component';
import { EditInventoryComponent } from './inventory/edit-inventory/edit-inventory.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { AddOrderComponent } from './orders/add-order/add-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { LowStockModalComponent } from './low-stock-modal/low-stock-modal.component';
import { ForecastComponent } from './forecast/forecast.component';
import { NgChartsModule } from 'ng2-charts';
import { ReorderComponent } from './reorder/reorder.component';
import { NextWeekInventoryComponent } from './next-week-inventory/next-week-inventory.component';
import { DemandForecastComponent } from './demand-forecast/demand-forecast.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    SideBarComponent,
    StatCardComponent,
    LoginComponent,
    RegisterComponent,
    EditInventoryComponent,
    AddInventoryComponent,
    InventoryListComponent,
    OrderListComponent,
    AddOrderComponent,
    EditOrderComponent,
    LowStockModalComponent,
    ForecastComponent,
    ReorderComponent,
    NextWeekInventoryComponent,
    DemandForecastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxChartsModule,
    ReactiveFormsModule,
    CommonModule,
    NgChartsModule,
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddInventoryComponent } from './inventory/add-inventory/add-inventory.component';
import { EditInventoryComponent } from './inventory/edit-inventory/edit-inventory.component';
import { InventoryListComponent } from './inventory/inventory-list/inventory-list.component';
import { AddOrderComponent } from './orders/add-order/add-order.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { ForecastComponent } from './forecast/forecast.component';
import { ReorderComponent } from './reorder/reorder.component';
import { NextWeekInventoryComponent } from './next-week-inventory/next-week-inventory.component';
import { DemandForecastComponent } from './demand-forecast/demand-forecast.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'inventory', component: InventoryListComponent },
  { path: 'inventory/add', component: AddInventoryComponent },
  { path: 'inventory/edit/:id', component: EditInventoryComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/add', component: AddOrderComponent },
  { path: 'orders/edit/:id', component: EditOrderComponent },
  { path: 'forecast', component: ForecastComponent },
  { path:'reorder', component:ReorderComponent},
  { path:'nextweek-requirement', component:NextWeekInventoryComponent},
  { path:'demand-forecast', component:DemandForecastComponent}

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

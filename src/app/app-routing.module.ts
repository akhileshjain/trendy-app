import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddItemComponent } from './add-item/add-item.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PrintOrderComponent } from './print-order/print-order.component';
import { ShowOrderComponent } from './show-order/show-order.component';
import { ShowOrdersComponent } from './show-orders/show-orders.component';

const appRoutes: Routes = [
  { path: '',  component: HomepageComponent},
  { path: 'add_item',  component: AddItemComponent},
  {path:'add_customer', component: AddCustomerComponent},
  {path:'bill_create', component: CreateOrderComponent},
  {path:'bill_print', component: PrintOrderComponent},
  {path:'show_orders', component: ShowOrdersComponent},
  {path:'order/:order_id', component: ShowOrderComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddItemComponent } from './add-item/add-item.component';
import { CreateCashOrderComponent } from './create-cash-order/create-cash-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { HomepageComponent } from './homepage/homepage.component';
import { PrintOrderComponent } from './print-order/print-order.component';
import { ShowCashOrderComponent } from './show-cash-order/show-cash-order.component';
import { ShowCashOrdersComponent } from './show-cash-orders/show-cash-orders.component';
import { ShowOrderComponent } from './show-order/show-order.component';
import { ShowOrdersComponent } from './show-orders/show-orders.component';

const appRoutes: Routes = [
  { path: '',  component: HomepageComponent},
  { path: 'add_item',  component: AddItemComponent},
  {path:'add_customer', component: AddCustomerComponent},
  {path:'bill_create', component: CreateOrderComponent},
  {path:'bill_print', component: PrintOrderComponent},
  {path:'show_orders', component: ShowOrdersComponent},
  {path:'order/:order_id/open', component: ShowOrderComponent},
  {path:'order/:order_id/edit', component: EditOrderComponent},
  {path:'add_cash_order', component: CreateCashOrderComponent},
  {path:'show_cash_orders', component: ShowCashOrdersComponent},
  {path:'cashorder/:order_id', component: ShowCashOrderComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}
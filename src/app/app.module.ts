import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowOrdersComponent } from './show-orders/show-orders.component';
import { PrintOrderComponent } from './print-order/print-order.component';

const appRoutes: Routes = [{path:'', component: HomepageComponent},
                  {path:'add_customer', component: AddCustomerComponent},
                  {path:'bill_create', component: CreateOrderComponent},
                  {path:'bill_print', component: PrintOrderComponent},
                  {path:'show_orders', component: ShowOrdersComponent},
                  {path:'add_item', component: AddItemComponent}];

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CreateOrderComponent,
    AddCustomerComponent,
    AddItemComponent,
    ShowOrdersComponent,
    PrintOrderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule, 
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

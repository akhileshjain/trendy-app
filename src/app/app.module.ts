import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatTableModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowOrdersComponent } from './show-orders/show-orders.component';
import { PrintOrderComponent } from './print-order/print-order.component';
import { HeaderComponent } from './header/header.component';
import { SnackBarComponent } from './shared/snack-bar/snack-bar/snack-bar.component';
import { ShowOrderComponent } from './show-order/show-order.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    CreateOrderComponent,
    AddCustomerComponent,
    AddItemComponent,
    ShowOrdersComponent,
    PrintOrderComponent,
    HeaderComponent,
    SnackBarComponent,
    ShowOrderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule, 
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent],
  entryComponents: [SnackBarComponent]
})
export class AppModule { }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../service/orders.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
export interface cashOrders {
  cashOrderNumber: string;
  companyData: string;
  cashOrderDate: Date;
  netAmount: number;
}

@Component({
  selector: 'app-show-cash-orders',
  templateUrl: './show-cash-orders.component.html',
  styleUrls: ['./show-cash-orders.component.css']
})
export class ShowCashOrdersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["cashOrderNumber", "companyData",  "cashOrderDate", "netAmount", "detail"];
  dataSource;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  dataLoading: boolean = false;

  BILLS_DATA: cashOrders[] = [];


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.dataLoading = true;
    this.ordersService.getAllCashOrders().subscribe(res => {
      this.dataLoading = false;
      res.data.sort((x,y) => {
        return y.challanNumber - x.challanNumber;
     });
      res.data.map(b => {
         let obj = {"cashOrderNumber": undefined, "companyData": undefined,  "cashOrderDate": undefined,  "netAmount": undefined};      
         obj.cashOrderNumber = b.cashOrderNumber;
         obj.companyData = b.companyData;
         if(b.cashOrderDate) {
           let formattedDate = new Date(b.cashOrderDate);
           let month = formattedDate.getMonth() + 1;
           obj.cashOrderDate = formattedDate.getDate() + '-' + month + '-'+ formattedDate.getFullYear();
         } else {
           obj.cashOrderDate = '';
         }
          obj.netAmount = 'Rs.' + b.netAmount.toLocaleString();
          this.BILLS_DATA.push(obj);
        });
        this.dataSource = new MatTableDataSource(this.BILLS_DATA);
    });

  }
 ngOnDestroy() {
   this.dataSource = null;
 }
}

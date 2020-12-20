import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../service/orders.service';

export interface bills {
  challanNumber: string;
  grNo: string,
  companyData: string;
  billDate: Date;
  netAmount: number;
}

@Component({
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.css']
})
export class ShowOrdersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["challanNumber", "grNo", "companyData",  "billDate", "netAmount", "detail"];
  dataSource;
  BILLS_DATA: bills[] = [];


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.ordersService.getAllBills().subscribe(res => {
      res.data.map(b => {
         let obj = {"challanNumber": undefined, "grNo": undefined, "companyData": undefined,  "billDate": undefined,  "netAmount": undefined};      
         obj.challanNumber = b.challanNumber;
         obj.grNo = b.grNo;
         obj.companyData = b.companyData;
         if(b.billDate) {
           let formattedDate = new Date(b.billDate);
           let month = formattedDate.getMonth() + 1;
           obj.billDate = formattedDate.getDate() + '-' + month + '-'+ formattedDate.getFullYear();
         } else {
           obj.billDate = '';
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

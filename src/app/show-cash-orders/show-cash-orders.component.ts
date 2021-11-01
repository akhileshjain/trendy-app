import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../service/orders.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { SnackBarService } from '../shared/snack-bar/snack-bar/snack-bar.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
export interface cashOrders {
  cashOrderNumber: string;
  companyData: string;
  billDate: Date;
  netAmount: number;
}

@Component({
  selector: 'app-show-cash-orders',
  templateUrl: './show-cash-orders.component.html',
  styleUrls: ['./show-cash-orders.component.css'],
  providers: [ConfirmationDialogService, SnackBarService]
})
export class ShowCashOrdersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["cashOrderNumber", "companyData",  "billDate", "netAmount", "open", 'delete'];
  dataSource;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  dataLoading: boolean = false;

  BILLS_DATA: cashOrders[] = [];


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private ordersService: OrdersService, private confirmationDialogService: ConfirmationDialogService, private snackbarService: SnackBarService) { }

  ngOnInit() {
    this.dataLoading = true;
    this.ordersService.getAllCashOrders().subscribe(res => {
      this.dataLoading = false;
      res.data.map(b => {
         let obj = {"cashOrderNumber": undefined, "companyData": undefined,  "billDate": undefined,  "netAmount": undefined};      
         obj.cashOrderNumber = b.cashOrderNumber;
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
  deleteCashOrder(cashOrderNumber) {
    this.confirmationDialogService.confirm('Confirm Deletion', 'Are you sure you want to delete this Cash Order?', 'No', 'Yes').subscribe(res => {
      if(res) {
        let cOrder = {cashOrderNumber: cashOrderNumber};
        const index =  this.dataSource.data.map(function (obj) { return obj.cashOrderNumber; }).indexOf(cashOrderNumber);
        this.ordersService.deleteCashOrder(cOrder).subscribe(res => {
          this.snackbarService.snackMessage('S', 'Cash Order Deleted Successfully!');
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription(); 
        }, err => {
          this.snackbarService.snackMessage('E', 'Something went wrong!');
        })
      }
    }, err => {
      this.snackbarService.snackMessage('E', 'Something went wrong!');
    })
  }
  ngOnDestroy() {
   this.dataSource = null;
 }
}

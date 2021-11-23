import { Component, Inject, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OrdersService } from '../service/orders.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import { SnackBarService } from '../shared/snack-bar/snack-bar/snack-bar.service';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import * as XLSX from 'xlsx';

export interface bills {
  challanNumber: string;
  grNo: string,
  companyData: string;
  billDate: string;
  netAmount: string;
}

@Component({
  selector: 'app-show-orders',
  templateUrl: './show-orders.component.html',
  styleUrls: ['./show-orders.component.css'],
  providers: [ConfirmationDialogService, SnackBarService]
})
export class ShowOrdersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ["challanNumber", "grNo", "companyData",  "billDate", "netAmount", "open", "edit", 'delete'];
  dataSource;
  @ViewChild('TABLE', { read: ElementRef, static: false }) table:ElementRef;
  // @ViewChild('TABLE', {static: false}) table: ElementRef;
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  dataLoading: boolean = false;

  BILLS_DATA: bills[] = [];

  exportAsExcel() {
      let newBills = this.BILLS_DATA.map(r => {
        var x = r.billDate.split('-');
        var y = x[1] + '-' + x[0] + '-' + x[2];
        return {
          "Challan number" : r.challanNumber,
          "GR Number": r.grNo,
          "Company": r.companyData,
          "Bill Date": new Date(y),
          "Net Amount(in Rs.)": parseInt(r.netAmount.replace("Rs.", '').replace(",",""))
        }
      })
      const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(newBills);//converts a DOM TABLE element to a worksheet
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'Challans_Complete.xlsx');

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  constructor(private ordersService: OrdersService, private confirmationDialogService: ConfirmationDialogService, private snackbarService: SnackBarService) { }

  ngOnInit() {
    this.dataLoading = true;
    this.getAllBills();
  }

  getAllBills() {
    this.ordersService.getAllBills().subscribe(res => {
      this.dataLoading = false;
      res.data.sort((x,y) => {
         return y.challanNumber - x.challanNumber;
      })
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

  deleteOrder(challanNumber) {
    this.confirmationDialogService.confirm('Confirm Deletion', 'Are you sure you want to delete this Challan?', 'No', 'Yes').subscribe(res => {
      if(res) {
        let bill = {challanNumber: challanNumber};
        const index =  this.dataSource.data.map(function (obj) { return obj.challanNumber; }).indexOf(challanNumber);
        this.ordersService.deleteBill(bill).subscribe(res => {
          this.snackbarService.snackMessage('S', 'Challan Deleted Successfully!');
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

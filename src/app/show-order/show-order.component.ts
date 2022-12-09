import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../service/orders.service';
import {ActivatedRoute} from '@angular/router';
import {formatterDate} from '../../common/util';
import {getPrintBillObject, printBill} from '../../common/print';

@Component({
  selector: 'app-show-order',
  templateUrl: './show-order.component.html',
  styleUrls: ['./show-order.component.css']
})
export class ShowOrderComponent implements OnInit {

  constructor(private orderService: OrdersService, private route: ActivatedRoute) { }
  
  challanNumber: number;
  billExists = false;
  companyData: string;
  billDate: string;
  items: any;
  grNo: string;
  billingTotal: number;
  gstRate: number;
  transCharge: number;
  dbDate: Date;
  netAmount: number;
  disc: number;
  embText: string;
  embCharge: number;
  embBreakUp: string;
  freightText: string;
  gstBillNumber: string;
  totalQty: number = 0;

  ngOnInit() {
    this.route.params.subscribe(data => {
      if(data['order_id']) {
        this.challanNumber = data['order_id'];
        this.orderService.getBill(this.challanNumber).subscribe(res => {
          this.billExists = true;
          this.challanNumber = res.challanNumber;
          this.companyData = res.companyData;
          this.disc = res.disc;
          this.dbDate = new Date(res.billDate);
          this.billDate = formatterDate(new Date(res.billDate));
          this.items = res.table;
          this.items.map(i => {
            this.totalQty += parseInt(i.qty);
          });
          this.grNo = res.grNo;
          this.billingTotal = res.billingTotal;
          this.gstRate = res.gstRate;
          this.embText = res.embText;
          this.embCharge = res.embCharge;
          this.embBreakUp = res.embBreakUp;
          this.transCharge = res.transCharge;
          this.netAmount = res.netAmount;
          this.freightText = res.freightText;
          this.gstBillNumber = res.gstbillNumber;
        }, error => {
            this.billExists = false;
        })
      }
    })
  }
  printCurrentBill() {
      const bill = getPrintBillObject(this.challanNumber, this.gstBillNumber, this.companyData, this.dbDate, this.items, this.embText, this.embCharge, this.embBreakUp, 
        this.totalQty, this.billingTotal, this.gstRate, this.freightText, this.transCharge, this.netAmount, this.disc, this.grNo);    
     
        printBill(bill);
  }

}

import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../service/orders.service';
import {ActivatedRoute} from '@angular/router';
import {formatterDate} from '../../common/util';
import {getPrintCashOrderObject, printBill} from '../../common/print';

@Component({
  selector: 'app-show-cash-order',
  templateUrl: './show-cash-order.component.html',
  styleUrls: ['./show-cash-order.component.css']
})
export class ShowCashOrderComponent implements OnInit {

  constructor(private orderService: OrdersService, private route: ActivatedRoute) { }
  
  cashOrderNumber: number;
  billExists = false;
  companyData: string;
  cashOrderDate: string;
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
  gstBillNumber: string;
  totalQty: number = 0;

  ngOnInit() {
    this.route.params.subscribe(data => {
      if(data['order_id']) {
        this.cashOrderNumber = data['order_id'];
        this.orderService.getCashOrder(this.cashOrderNumber).subscribe(res => {
          this.billExists = true;
          this.cashOrderNumber = res.cashOrderNumber;
          this.companyData = res.companyData;
          this.disc = res.disc;
          this.dbDate = new Date(res.cashOrderDate);
          this.cashOrderDate = formatterDate(new Date(res.cashOrderDate));
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
          this.gstBillNumber = res.gstbillNumber;
        }, error => {
            this.billExists = false;
        })
      }
    })
  }
  printCurrentBill() {
      const bill = getPrintCashOrderObject(this.cashOrderNumber, this.companyData, this.dbDate, this.items, this.embText, this.embCharge, this.embBreakUp, this.totalQty, this.billingTotal, this.gstRate, this.transCharge, this.netAmount, this.disc, this.grNo);    
      printBill(bill);
  }

}

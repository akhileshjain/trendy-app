import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../service/orders.service';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {
  bill;
  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.bill = this.orderService.billingOrder;
    console.log(this.bill);
  }
  getSerialNo(index) {
    return index + 1 + '.';
  }
  isDiscZero() {
    if(this.bill && this.bill.disc) {
      if(this.bill.disc == "₹ 0" || this.bill.disc == "₹ ") {
        return 0;
      } else {
        return 1;
      }
    }
  }
  isGSTZero() {
    if(this.bill && this.bill.gstRate) {
      if(this.bill.gstRate == "₹ 0" || this.bill.gstRate == "₹ ") {
        return 0;
      } else {
        return 1;
      }
    }
  } 
  isTransZero() {
    if(this.bill && this.bill.transCharge) {
      if(this.bill.transCharge == "₹ 0" || this.bill.transCharge == "₹ ") {
        return 0;
      } else {
        return 1;
      }
    }
  }   
}

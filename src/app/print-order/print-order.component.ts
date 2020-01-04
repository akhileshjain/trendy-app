import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../service/orders.service';

@Component({
  selector: 'app-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {
  bill = {};
  constructor(private orderService: OrdersService) { }

  ngOnInit() {
    this.bill = this.orderService.billingOrder;
    console.log(this.bill);
  }
  getSerialNo(index) {
    return index + 1 + '.';
  }
}

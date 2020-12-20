import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // title = 'Trendy!';

  constructor(private router: Router) { }

  ngOnInit() {
  }
  onAddItemClick() {
    this.router.navigate(['add_item']);
  }
  onAddCustomerClick() {
    this.router.navigate(['add_customer']);
  }
  onCreateBill() {
    this.router.navigate(['bill_create']);
  }
  onShowOrders() {
    this.router.navigate(['show_orders']);
  }
}

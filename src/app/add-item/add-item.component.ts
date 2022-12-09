import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import {ItemModel} from '../service/models/item.model';
import {OrdersService} from '../service/orders.service';
import { HttpClient } from '@angular/common/http';
import { SnackBarService } from '../shared/snack-bar/snack-bar/snack-bar.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css'],
  providers: [SnackBarService]
})
export class AddItemComponent implements OnInit {
  addItemForm: FormGroup;
  itemsData = new ItemModel();

  sizes = [
    {value: '22', viewValue: '22'},
    {value: '24', viewValue: '24'},
    {value: '26', viewValue: '26'},
    {value: '28', viewValue: '28'},
    {value: '30', viewValue: '30'},
    {value: '32', viewValue: '32'},
    {value: '34', viewValue: '34'},
    {value: '36', viewValue: '36'},
    {value: '38', viewValue: '38'},
    {value: '40', viewValue: '40'},
    {value: '42', viewValue: '42'},
    {value: '44', viewValue: '44'},
  ];
  constructor(private http: HttpClient, private ordersService: OrdersService, public snackBarService: SnackBarService) { 

  }

  ngOnInit() {
    this.addItemForm = new FormGroup({
      'itemName': new FormControl('', Validators.required),
      'addToTotal': new FormControl(true, Validators.required)
      // ,'color': new FormControl('', Validators.required),
      // 'size': new FormControl('', Validators.required),
    });

  }

  onAddItem() {
    this.itemsData.itemName =  this.addItemForm.get('itemName').value;
    this.itemsData.addToTotal = this.addItemForm.get('addToTotal').value;
    // this.itemsData.color = this.addItemForm.get('color').value;
    // this.itemsData.size = this.addItemForm.get('size').value;

    this.ordersService.addItem(this.itemsData).subscribe((res) => {
      this.snackBarService.snackMessage('S', 'Item Saved Successfully!');
    }, err => {
      this.snackBarService.snackMessage('E', 'Item save failed!');
    });
    
    this.addItemForm.get('itemName').setValue('');
    this.addItemForm.controls['itemName'].markAsPristine();
    this.addItemForm.controls['itemName'].markAsUntouched();
   }
}

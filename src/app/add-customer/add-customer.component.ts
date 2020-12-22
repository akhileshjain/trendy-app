import { Component, OnInit, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CustomerModel} from '../service/models/customer.model';
import {OrdersService} from '../service/orders.service';
import { SnackBarService } from '../shared/snack-bar/snack-bar/snack-bar.service';

@Injectable({providedIn: "root"})
@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
  providers: [SnackBarService]
})
export class AddCustomerComponent implements OnInit {
  
  addCustomerForm: FormGroup;
  customerData =  new CustomerModel();
  states = [
    {value: 'Andhra Pradesh', viewValue: 'Andhra Pradesh'},
    {value: 'Arunachal Pradesh', viewValue: 'Arunachal Pradesh'},
    {value: 'Assam', viewValue: 'Assam'},
    {value: 'Bihar', viewValue: 'Bihar'},
    {value: 'Chhattisgarh', viewValue: 'Chhattisgarh'},
    {value: 'Goa', viewValue: 'Goa'},
    {value: 'Gujarat', viewValue: 'Gujarat'},
    {value: 'Haryana', viewValue: 'Haryana'},
    {value: 'Himachal Pradesh', viewValue: 'Himachal Pradesh'},
    {value: 'Jammu and Kashmir', viewValue: 'Jammu and Kashmir'},
    {value: 'Jharkhand', viewValue: 'Jharkhand'},
    {value: 'Karnataka', viewValue: 'Karnataka'},
    {value: 'Kerala', viewValue: 'Kerala'},
    {value: 'Madhya Pradesh', viewValue: 'Madhya Pradesh'},
    {value: 'Maharashtra', viewValue: 'Maharashtra'},
    {value: 'Manipur', viewValue: 'Manipur'},
    {value: 'Meghalaya', viewValue: 'Meghalaya'},
    {value: 'Mizoram', viewValue: 'Mizoram'},
    {value: 'Nagaland', viewValue: 'Nagaland'},
    {value: 'Odisha', viewValue: 'Odisha'},
    {value: 'Punjab', viewValue: 'Punjab'},
    {value: 'Rajasthan', viewValue: 'Rajasthan'},
    {value: 'Sikkim', viewValue: 'Sikkim'},
    {value: 'Tamil Nadu', viewValue: 'Tamil Nadu'},
    {value: 'Telangana', viewValue: 'Telangana'},
    {value: 'Tripura', viewValue: 'Tripura'},
    {value: 'Uttarakhand', viewValue: 'Uttarakhand'},
    {value: 'Uttar Pradesh', viewValue: 'Uttar Pradesh'},
    {value: 'West Bengal', viewValue: 'West Bengal'},
    {value: 'Andaman and Nicobar Islands', viewValue: 'Andaman and Nicobar Islands'},
    {value: 'Chandigarh', viewValue: 'Chandigarh'},
    {value: 'Dadra and Nagar Haveli', viewValue: 'Dadra and Nagar Haveli'},
    {value: 'Daman and Diu', viewValue: 'Daman and Diu'},
    {value: 'Delhi', viewValue: 'Delhi'},
    {value: 'Lakshadweep', viewValue: 'Lakshadweep'},
    {value: 'Puducherry', viewValue: 'Puducherry'}
  ];
  constructor(private http: HttpClient, private ordersService: OrdersService, private snackbarService: SnackBarService) { 
   
  } 

  ngOnInit() {
    this.addCustomerForm = new FormGroup({
      'custname': new FormControl('', Validators.required),
      'city': new FormControl('', Validators.required)
      // 'companyname': new FormControl(''),
      // 'address': new FormControl(null),
      // 'state': new FormControl(''),
      // 'pin': new FormControl(null),
      // 'mobile': new FormControl('' , [Validators.pattern("^([0|+[0-9]{1,5})?([7-9][0-9]{9})$"), this.validateMobileNo.bind(this)]),
      // 'phone': new FormControl(''), 
      // 'email': new FormControl('' , Validators.email),
      // 'gstin': new FormControl(null)
    });
  }
  validateMobileNo(control: FormControl): {[s: string]: boolean} {
    if(control.value.toString().trim().length != 10) {
      return {minLength : true};
    }
    return null;
  }
  onAddCustomer() {
    // console.log(this.addCustomerForm);

    this.customerData.custName = this.addCustomerForm.get('custname').value;
    this.customerData.city = this.addCustomerForm.get('city').value;
    // this.customerData.companyName = this.addCustomerForm.get('companyname').value;
    // this.customerData.address = this.addCustomerForm.get('address').value;
    // this.customerData.district = this.addCustomerForm.get('district').value;
    // this.customerData.state = this.addCustomerForm.get('state').value;
    // this.customerData.pin = this.addCustomerForm.get('pin').value;
    // this.customerData.mobile = this.addCustomerForm.get('mobile').value;
    // this.customerData.phone = this.addCustomerForm.get('phone').value;
    // this.customerData.email = this.addCustomerForm.get('email').value;
    // this.customerData.gstin = this.addCustomerForm.get('gstin').value;

    this.ordersService.addCustomer(this.customerData).subscribe((res) => {
        this.snackbarService.snackMessage('S', 'Customer Added Successfully!');
    }, err => {
        this.snackbarService.snackMessage('E', 'Customer could not be added successfully!');
    });
  } 
}

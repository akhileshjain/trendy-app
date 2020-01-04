import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../service/orders.service';
import { FormControl, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  gstCost: Number = 0.0;
  trCost: Number = 0.0;
  billTotal: Number = 0.0;
  items = [];
  date = new FormControl(new Date());
  constructor(private http: HttpClient, private orderService: OrdersService, 
    private router: Router) { }

  ngOnInit() {
    this.orderService.getItems();
     this.orderService.getItemUpdateListener().subscribe((items) => {
         this.items = items;
    });
  }
  getNumber(number) {
    if(number !== undefined || number !== null) {
      return  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(number);
    }
  }
  saveAndPrintOrder() {
    let table = [];
    let billPage = {challanNumber: '', gstbillNumber: '', companyData: '', billDate: '', table: [], billingTotal: '', gstRate: '', transCharge: '', netAmount: ''};

    let challanNumber = document.getElementById("challan-input").innerText.trim();
    let gstbillNumber = document.getElementById("gst-input").innerText.trim();
    let companyData = (<HTMLSelectElement>document.getElementById("company-input")).value.trim();
    let billDate1 = (<HTMLInputElement>document.getElementById("date-input")).value;
    let month = billDate1.substr(0, billDate1.indexOf('/'));
    let year = billDate1.substr(billDate1.lastIndexOf('/')+1, billDate1.length - 1);
    let date = billDate1.substring(billDate1.indexOf('/')+1, billDate1.lastIndexOf('/'));
    if(parseInt(date) < 10) {
      date = '0'+ date;
    }
    if(parseInt(month) < 10) {
      month = '0'+ month;
    }
    let billDate  = date + '-'+month+'-'+year;

    var tableRows = (<HTMLTableElement>document.getElementById('order-table')).rows;
    for(var i = 1; i < tableRows.length; i++) {
      let row = {item: '', size: '', rate: '', qty: '', price: ''};
      let itemType = (<HTMLSelectElement>tableRows[i].cells[0].children[0]).selectedOptions[0].innerText;
      let itemCustomInfo = (<HTMLElement>tableRows[i].cells[0].children[1]).innerText;
      let itemSize = tableRows[i].cells[1].innerText;
      let itemRate = tableRows[i].cells[2].innerText;
      let itemQty = tableRows[i].cells[3].innerText;
      let itemPrice = tableRows[i].cells[4].innerText;
      row.item = itemType + ' ' + itemCustomInfo;
      row.size = itemSize;
      row.rate = itemRate;
      row.qty = itemQty;
      row.price = itemPrice;
      table.push(row);
    }
    let billingTotal = document.getElementById('bill-total').innerText; 
    let gstRate = document.getElementById('gst').innerText; 
    let transCharge = document.getElementById('tr-charge').innerText; 
    let netAmount = document.getElementById('net-total').innerText; 

    billPage.challanNumber = challanNumber;
    billPage.gstbillNumber = gstbillNumber;
    billPage.companyData = companyData;
    billPage.billDate = billDate;
    billPage.table = table;
    billPage.billingTotal = billingTotal;
    billPage.gstRate = gstRate;
    billPage.transCharge = transCharge;
    billPage.netAmount = netAmount;
    console.log(billPage);
    this.orderService.billingOrder = billPage;
    this.router.navigate(['/bill_print']);
  }
  callGST(event) {
    if(event.target.innerText.indexOf("₹") <= 0 && !isNaN(parseFloat(event.target.innerText.replace('₹', '').replace('/,/g', '').trim()))) {
      let gst = parseFloat(event.target.innerText.replace('₹', '').replace('/,/g', '').trim());
      event.target.innerText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(gst);
      this.gstCost = gst;
      this.setNetTotal();
    } 
  }
  callTransportationCharge(event) {
    if(event.target.innerText.indexOf("₹") <= 0 && !isNaN(parseFloat(event.target.innerText.replace('₹', '').replace('/,/g', '').trim()))) {
      let tr_charge = parseFloat(event.target.innerText.replace('₹', '').replace('/,/g', '').trim());
      event.target.innerText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(tr_charge);
      this.trCost = tr_charge;
      this.setNetTotal();
    }
  }
  callCalc(event) {
    let total = 0;
    if (event.target.classList.contains('rate') === true) {
       if (!isNaN(parseFloat(event.target.innerText.substring(2).replace(/,/g, '').trim()))) {
           let rate = parseFloat(event.target.innerText.substring(2).replace(/,/g, '').trim());
           let qty = parseInt(event.target.parentNode.cells[3].innerText.trim());
           if(!isNaN(rate) && !isNaN(qty)) {
             let price = rate * qty;
             event.target.parentNode.cells[4].innerText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
            }
       } else {
            let rate = 0;
            event.target.innerText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(rate); 
       }
    } else if(event.target.classList.contains('qty') === true) {
      if(!isNaN(parseInt(event.target.innerText.trim()))) {
          let rate = parseFloat(event.target.parentNode.cells[2].innerText.substring(2).replace(/,/g, '').trim());
          let qty = event.target.innerText.trim();
          if(!isNaN(rate) && !isNaN(qty)) {
          let price = rate * qty;
          event.target.parentNode.cells[4].innerText =new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);          
          }
      }
    }
    
    if((<HTMLTableElement>document.getElementById("order-table")).rows) {
      for(let i = 0; i < (<HTMLTableElement>document.getElementById("order-table")).rows.length; i++) {
          if(i !== 0) {
              let ind_total = parseFloat((<HTMLTableElement>document.getElementById("order-table")).rows[i].cells[4].innerText.substring(2).replace(/,/g, '').trim());
              if(!isNaN(ind_total)) {
                total = total + ind_total;
              }
          }
      }
      if(!isNaN(total)) {
        let formattedTotal = this.getNumber(total);
        this.billTotal = total;
        (<HTMLTableElement>document.getElementById("bill-total")).innerText = formattedTotal; 
      
      }
      this.setNetTotal();
    }
  }
  setNetTotal = function() {
    this.netTotal = this.billTotal + this.gstCost + this.trCost;
    let formattedNetTotal = this.getNumber(this.netTotal);
    (<HTMLTableElement>document.getElementById("net-total")).innerText = formattedNetTotal;    
  }
  addRow() {  
    let table =  <HTMLTableElement>document.getElementById("order-table");
    console.log(table);
    let row = table.insertRow(-1);

    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    
    var selectList = document.createElement("select");
    var editableDiv = document.createElement("div");
    editableDiv.style.minWidth = '100px';
    editableDiv.style.border = '0.5px solid lightblue';
    selectList.id = "mySelect";
    cell0.appendChild(selectList);
    for (var i = 0; i < this.items.length; i++) {
      var option = document.createElement("option");
      option.value = this.items[i].id;
      option.text = this.items[i].itemName;
      selectList.appendChild(option);
  }
    cell0.style.border = '1px solid #DDD';
    cell0.style.padding = '4px 0';
    cell0.style.display = 'flex';
    editableDiv.contentEditable = "true";
    cell0.appendChild(editableDiv);

    cell1.innerHTML = '';
    cell1.contentEditable = "true";
    cell1.style.border = '1px solid #DDD';
    cell1.style.textAlign = 'center';
    cell1.style.padding = '4px 0';

    cell2.contentEditable = "true";
    cell2.style.border = '1px solid #DDD';
    cell2.style.textAlign = 'center';
    cell2.style.padding = '4px 0';
    cell2.classList.add('rate');
    cell2.addEventListener("keyup", ($event) => { this.callCalc($event); 
      let number = parseFloat((<HTMLElement>$event.target).innerText);
      if(!isNaN(number)) {
        let formattedNumber = this.getNumber(number);
        (<HTMLElement>$event.target).innerText = formattedNumber;
      } 
      let formattedprice = parseFloat((<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText);
      if(!isNaN(formattedprice)) {
        (<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(formattedprice);          
      }
    });

    cell3.contentEditable = "true";
    cell3.style.border = '1px solid #DDD';
    cell3.style.padding = '4px 0';
    cell3.style.textAlign = 'center';
    cell3.classList.add('qty');
    cell3.addEventListener("keyup", ($event) => { this.callCalc($event)
      let formattedprice = parseFloat((<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText);
      if(!isNaN(formattedprice)) {
        (<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(formattedprice);          
      }
    });

    cell4.contentEditable = "true";
    cell4.style.border = '1px solid #DDD';
    cell4.style.padding = '4px 0';
    cell4.style.textAlign = 'center';
    cell4.classList.add('price');

    // cell6.style.border = '1px solid #DDD';
    // cell6.style.padding = '4px 0';
    // cell6.style.textAlign = 'center';

  }
}

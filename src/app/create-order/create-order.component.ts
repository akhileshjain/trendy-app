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
  discCost: Number = 0.0;
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
      return number; //new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(number);
    }
  }
  saveAndPrintOrder() {
    let table = [];
    let billPage = {challanNumber: '', gstbillNumber: '', companyData: '', billDate: '', table: [], billingTotal: '', gstRate: '', transCharge: '', netAmount: '', disc: '', grNo: ''};

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
      let itemRate = "₹ " + (<HTMLInputElement>tableRows[i].cells[2].children[0]).value;
      let itemQty = (<HTMLInputElement>tableRows[i].cells[3].children[0]).value;
      let itemPrice = "₹ " + tableRows[i].cells[4].innerText;
      row.item = itemType + ' ' + itemCustomInfo;
      row.size = itemSize;
      row.rate = itemRate;
      row.qty = itemQty;
      row.price = itemPrice;
      table.push(row);
    }
    let billingTotal = "₹ " + document.getElementById('bill-total').innerText; 
    let gstRate = "₹ " + (<HTMLInputElement>document.getElementById('gst')).value.trim(); 
    let transCharge = "₹ " + (<HTMLInputElement>document.getElementById('tr-charge')).value.trim(); 
    let netAmount = "₹ " + document.getElementById('net-total').innerText; 
    let discCost = "₹ " + this.discCost;
    let grNo = (<HTMLSelectElement>document.getElementById("gr-input")).value.trim();

    billPage.challanNumber = challanNumber;
    billPage.gstbillNumber = gstbillNumber;
    billPage.companyData = companyData;
    billPage.billDate = billDate;
    billPage.table = table;
    billPage.billingTotal = billingTotal;
    billPage.gstRate = gstRate;
    billPage.transCharge = transCharge;
    billPage.netAmount = netAmount;
    billPage.disc = discCost;
    billPage.grNo = grNo;

    console.log(billPage);
    this.orderService.billingOrder = billPage;
    this.router.navigate(['/bill_print']);
  }
  callGST(event) {
    if(!isNaN(parseFloat(event.target.value.trim()))) {
      let gst = parseFloat(event.target.value.trim());
      event.target.value = gst;
      this.gstCost = gst;
      this.setNetTotal();
    } 
  }
  callDisc() {
    if(!isNaN(parseFloat(document.getElementById('disc').innerText.trim()))) {
      let disc = document.getElementById('disc').innerText.trim();
    //  event.target.innerText = disc;
      this.discCost = (<any>disc / 100) * <number>this.billTotal;
      this.setNetTotal();
    } 
  }
  callTransportationCharge(event) {
    if(!isNaN(parseFloat(event.target.value.trim()))) {
      let tr_charge = parseFloat(event.target.value.trim());
      event.target.value = tr_charge;
      this.trCost = tr_charge;
      this.setNetTotal();
    }
  }
  callCalc(event) {
    let total = 0;
    if (event.target.classList.contains('rate') === true) {
       if (!isNaN(parseFloat(event.target.value.trim()))) {
           let rate = parseFloat(event.target.value.trim());
           let qty = parseInt(event.target.parentNode.parentNode.cells[3].children[0].value.trim());
           if(!isNaN(rate) && !isNaN(qty)) {
             let price = rate * qty;
             event.target.parentNode.parentNode.cells[4].innerText = price;
            }
       } else {
            let rate = 0;
            event.target.innerText = rate;
       }
    } else if(event.target.classList.contains('qty') === true) {
      if(!isNaN(parseInt(event.target.value.trim()))) {
          let rate = parseFloat(event.target.parentNode.parentNode.cells[2].children[0].value.trim());
          let qty = event.target.value.trim();
          if(!isNaN(rate) && !isNaN(qty)) {
          let price = rate * qty;
          event.target.parentNode.parentNode.cells[4].innerText = price;
          }
      }
    }
    
    if((<HTMLTableElement>document.getElementById("order-table")).rows) {
      for(let i = 0; i < (<HTMLTableElement>document.getElementById("order-table")).rows.length; i++) {
          if(i !== 0) {
              let ind_total = parseFloat((<HTMLTableElement>document.getElementById("order-table")).rows[i].cells[4].innerText.trim());
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
      
      this.callDisc();
    }
  }
  setNetTotal = function() {
    this.netTotal = this.billTotal - this.discCost + this.gstCost + this.trCost;
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
    editableDiv.style.minWidth = '340px';
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

    var inp1 = document.createElement("input");
    inp1.style.border = '1px solid #DDD';
    inp1.style.textAlign = 'center';
    inp1.style.padding = '4px 4px';
    inp1.style.width = '200px';
    inp1.classList.add('rate');
    cell2.appendChild(inp1);
//    cell2.contentEditable = "true";
//    cell2.style.border = '1px solid #DDD';
//    cell2.style.textAlign = 'center';
//    cell2.style.padding = '4px 0';
//    cell2.classList.add('rate');
    cell2.addEventListener("keyup", ($event) => { this.callCalc($event); 
      let number = parseFloat((<HTMLElement>$event.target).innerText);
      if(!isNaN(number)) {
        let formattedNumber = this.getNumber(number);
        (<HTMLElement>$event.target).innerText = formattedNumber;
      } 
      let formattedprice = parseFloat((<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText);
      if(!isNaN(formattedprice)) {
        (<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText = formattedprice.toString().trim(); // new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(formattedprice);          
      }
    });

    var inp = document.createElement("input");
    inp.style.padding = '4px 4px';
    inp.style.width = '200px';
    inp.style.border = '1px solid #DDD';
    inp.style.textAlign = 'center';
    inp.classList.add('qty');
    cell3.appendChild(inp); //contentEditable = "true";
    cell3.addEventListener("keyup", ($event) => { this.callCalc($event)
      let formattedprice = parseFloat((<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText);
      if(!isNaN(formattedprice)) {
        (<HTMLElement>(<HTMLElement>$event.target).parentNode.lastElementChild).innerText = formattedprice.toString().trim(); //new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(formattedprice);          
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

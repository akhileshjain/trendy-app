import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../service/orders.service';
import { SnackBarService } from '../shared/snack-bar/snack-bar/snack-bar.service';
import { FormControl, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {getPrintBillObject, printBill} from '../../common/print';
import {getBillObject} from '../../common/util';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
  providers: [SnackBarService]
})
export class EditOrderComponent implements OnInit {
  challanNo: Number;
  billExists = false;
  companyId: string;
  companyData: string;
  embBreakUp: string;
  grNo: string;
  transCharge: number;
  dbDate: Date;
  netAmount: number;
  disc: number;
  embText: string;
  billingTotal: number;
  gstBillNumber: string;
  gstCost: Number = 0.0;
  gstRate: number;
  embCharge: Number = 0.0;
  trCost: Number = 0.0;
  billTotal: Number = 0.0;
  discCost: number = 0.0;
  discPercent: number = 0.0;
  totalQty: number = 0.0;
  items: any;
  tableItems = [];
  customerList = [];
  date = new FormControl(new Date());
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  dataLoading: boolean = false;
  constructor(private http: HttpClient, private orderService: OrdersService, 
    private router: Router, private route: ActivatedRoute, public snackBarService: SnackBarService
    ) { }

  ngOnInit() {
    this.route.params.subscribe(data => {
      if(data['order_id']) {
        this.challanNo = data['order_id'];
        this.orderService.getItems();
        this.orderService.getItemUpdateListener().subscribe((items) => {
              this.items = items;
          });
        this.orderService.getBill(this.challanNo).subscribe(res => {
          this.billExists = true;
          this.challanNo = res.challanNumber;
          this.companyData = res.companyData;
          this.companyId = res.companyId;
          this.disc = res.disc;
          this.discPercent = res.discPercent;
          // this.dbDate = new Date(res.billDate);
          // this.billDate = formatterDate(new Date(res.billDate));
          this.tableItems = res.table;
          this.tableItems.map(i => {
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



    // this.orderService.getItems();
    this.dataLoading = true;
    this.orderService.getCustomers().subscribe(res => {
      this.dataLoading = false;
      this.customerList = res;
    });
    // this.orderService.getChallanNumber().subscribe(res => {
    //   this.dataLoading = false;
    //   this.challanNo = res;  

    // }, e => {
    //   this.dataLoading = false;
    //   this.snackBarService.snackMessage('E', 'Issue fetching latest Challan Number')
    // });
   
  }
  getRowItem(rowItem) {
    var customRow;
    this.items.map(e => {
      if(rowItem.indexOf(e.itemName) != -1) {  
         customRow = rowItem.substring(e.itemName.length+1, rowItem.length);
      }
  });
      return customRow;
  }
  getPrice(item) {
    return item.substring(3, item.length);
  }

  getNumber(number) {
    if(number !== undefined || number !== null) {
      return number; //new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(number);
    }
  }
  editOrder() {
    let table = [];
    let challanNumber = document.getElementById("challan-input").innerText.trim();
    let gstbillNumber = document.getElementById("gst-input").innerText.trim();
    let companyData = (<HTMLSelectElement>document.getElementById("company-input")).innerText.trim();
    let companyId = this.companyData;
    let netQty = parseInt(document.getElementById('net-qty').innerText.trim()); 
    let billTotal = parseFloat(document.getElementById('bill-total').innerText);
    let gstRate = parseFloat((<HTMLInputElement>document.getElementById('gst')).value.trim());
    let transCharge = parseFloat((<HTMLInputElement>document.getElementById('tr-charge')).value.trim());
    let netAmount = parseFloat(document.getElementById('net-total').innerText);
    let discPercent = parseFloat((<HTMLInputElement>document.getElementById('disc')).innerText.trim());
    let embrCharge = parseFloat((<HTMLInputElement>document.getElementById('embr')).value.trim());
    let embBreakUp = (<HTMLSelectElement>document.getElementById("emb-input")).value.trim();
    let embText = document.getElementById('emb-label').innerText.trim();
    let grNo = (<HTMLSelectElement>document.getElementById("gr-input")).value.trim();
    var tableRows = (<HTMLTableElement>document.getElementById('order-table')).rows;
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
    let billDate  = new Date(year + '-' + month + '-' + date);

    for(var i = 1; i < tableRows.length; i++) {
      let row = {item: '', size: '', rate: '', qty: '', price: ''};
      let itemType = (<HTMLSelectElement>tableRows[i].cells[0].children[0]).selectedOptions[0].innerText;
      let itemCustomInfo = (<HTMLElement>tableRows[i].cells[0].children[1]).innerText;
      let itemSize = tableRows[i].cells[1].innerText;
      let itemRate = (<HTMLInputElement>tableRows[i].cells[2].children[0]).value;
      let itemQty = (<HTMLInputElement>tableRows[i].cells[3].children[0]).value;
      let itemPrice = "Rs. " + tableRows[i].cells[4].innerText;
      row.item = itemType + ' ' + itemCustomInfo;
      row.size = itemSize;
      row.rate = itemRate;
      row.qty = itemQty;
      row.price = itemPrice;
      table.push(row);
    }
    let billObject = getBillObject(challanNumber, gstbillNumber, companyId, companyData, billDate, table,
      netQty, billTotal, embText, embrCharge, embBreakUp, gstRate, transCharge, netAmount, this.discCost, grNo, discPercent);

    this.orderService.billingOrder = billObject;
    if((!gstRate && gstbillNumber != '') || (gstRate && gstbillNumber == '')) {
      this.snackBarService.snackMessage('E', 'If you are providing GST Amount, please enter Bill No. and vice-versa.');      
    } else {
      this.orderService.editBill(billObject).subscribe(res => {
        this.snackBarService.snackMessage('S', 'Bill Edited successfully!');
        // this.router.navigate(['/bill_print']);
      }, err => {
        this.snackBarService.snackMessage('E', 'There was some problem saving the bill.');
      });
    }
  }
  callGST(event) {
    if(!isNaN(parseFloat(event.target.value.trim()))) {
      let gst = parseFloat(event.target.value.trim());
      event.target.value = gst;
      this.gstCost = gst;
      this.setNetTotal();
    } 
  }
  callEmbr(event) {
    if(!isNaN(parseFloat(event.target.value.trim()))) {
      let embCharge = parseFloat(event.target.value.trim());
      event.target.value = embCharge;
      this.embCharge = embCharge;
      this.setNetTotal();
    } 
  }
  callDisc(event) {
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
    let totQty = 0;
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
          let qty = parseInt(event.target.value.trim());
          if(!isNaN(rate) && !isNaN(qty)) {
          let price = rate * qty;
          event.target.parentNode.parentNode.cells[4].innerText = price;
          }
      }
    }
    
    if((<HTMLTableElement>document.getElementById("order-table")).rows) {
      for(let i = 0; i < (<HTMLTableElement>document.getElementById("order-table")).rows.length; i++) {
          if(i !== 0) {
              let tableElt = (<HTMLTableElement>document.getElementById('order-table'));
              let ind_total = parseFloat(tableElt.rows[i].cells[4].innerText.trim());
              let ind_qty = parseInt((<HTMLInputElement>tableElt.rows[i].cells[3].children[0]).value.trim());
              if(!isNaN(ind_total)) {
                total = total + ind_total;
              }
              if(!isNaN(ind_qty)) {
                totQty = totQty + ind_qty;
              }
            }
          }
          if(!isNaN(total)) {
            let formattedTotal = this.getNumber(total);
            this.billTotal = total;
            (<HTMLTableElement>document.getElementById("bill-total")).innerText = formattedTotal; 
            (<HTMLTableElement>document.getElementById("net-qty")).innerText = totQty.toString(); 
      
      }    
      this.callDisc(event);
    }
  }
  setNetTotal = function() {
    this.netTotal = this.billTotal - this.discCost + this.embCharge + this.gstCost + this.trCost;
    let formattedNetTotal = this.getNumber(this.netTotal);
    (<HTMLTableElement>document.getElementById("net-total")).innerText = formattedNetTotal;    
  }
  addRow() {  
    let table =  <HTMLTableElement>document.getElementById("order-table");
    let row = table.insertRow(-1);

    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    let cell5 = row.insertCell(5);
    
    var selectList = document.createElement("select");
    var editableDiv = document.createElement("div");
    var deleteBtn = document.createElement("button");

    editableDiv.style.minWidth = '340px';
    editableDiv.style.border = '1px solid ivory';
    selectList.id = "mySelect";
    cell0.appendChild(selectList);
    for (var i = 0; i < this.items.length; i++) {
      var option = document.createElement("option");
      option.value = this.items[i].id;
      option.text = this.items[i].itemName;
      selectList.appendChild(option);
  }
    cell0.style.border = '1px solid ivory';
    cell0.style.padding = '4px 0';
    cell0.style.display = 'flex';
    editableDiv.contentEditable = "true";
    cell0.appendChild(editableDiv);

    cell1.innerHTML = '';
    cell1.contentEditable = "true";
    cell1.style.border = '1px solid ivory';
    cell1.style.textAlign = 'center';
    cell1.style.padding = '4px 0';

    var inp1 = document.createElement("input");
    inp1.style.border = '1px solid ivory';
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
    inp.style.border = '1px solid ivory';
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
    cell4.style.border = '1px solid ivory';
    cell4.style.padding = '4px 0';
    cell4.style.textAlign = 'center';
    cell4.classList.add('price');

    deleteBtn.textContent = 'Delete Row';
    cell5.appendChild(deleteBtn);
    cell5.addEventListener('click', (event) => {
       this.deleteRow(event);
    })

    // cell6.style.border = '1px solid #DDD';
    // cell6.style.padding = '4px 0';
    // cell6.style.textAlign = 'center';
  }
  deleteRow(event) {
    let elementToBeRemoved = event.target.parentElement.parentElement;
    if(elementToBeRemoved.children[4].innerText.trim() == '' || elementToBeRemoved.children[4].innerText.trim() == 0) {
      document.getElementById('order-table').removeChild(elementToBeRemoved);
    } else {
      this.snackBarService.snackMessage('E', `In order to delete this row, you need to update the price of this row to 0 first. Either set qty column or rate column to 0. `);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrdersService } from '../service/orders.service';
import { SnackBarService } from '../shared/snack-bar/snack-bar/snack-bar.service';
import { FormControl, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import {formatterDate} from '../../common/util';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
  providers: [SnackBarService]
})
export class CreateOrderComponent implements OnInit {
  challanNo: Number;
  gstCost: Number = 0.0;
  embCharge: Number = 0.0;
  trCost: Number = 0.0;
  billTotal: Number = 0.0;
  discCost: number = 0.0;
  items = [];
  date = new FormControl(new Date());
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'indeterminate';
  dataLoading: boolean = false;
  constructor(private http: HttpClient, private orderService: OrdersService, 
    private router: Router, public snackBarService: SnackBarService
    ) { }

  ngOnInit() {
    this.orderService.getItems();
    this.dataLoading = true;
    this.orderService.getChallanNumber().subscribe(res => {
      this.dataLoading = false;
      this.challanNo = res;  

    }, e => {
      this.dataLoading = false;
      this.snackBarService.snackMessage('E', 'Issue fetching latest Challan Number')
    });
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
    let billPage = {challanNumber: '', gstbillNumber: '', companyData: '', billDate: '', table: [], embCharge: '', embBreakUp: '', netQty: '', billingTotal: '', gstRate: '', transCharge: '', netAmount: '', disc: '', grNo: ''};

    let bill = {challanNumber: '', gstbillNumber: '', companyData: '', billDate: undefined, table: [], embCharge: 0, embBreakUp: '',  netQty: 0, billingTotal: 0, gstRate: 0, transCharge: 0, netAmount: 0, disc: 0.0, grNo: ''};

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
    let billingTotal = "Rs. " + document.getElementById('bill-total').innerText; 
    let netQty = document.getElementById('net-qty').innerText; 
    let gstRate = "Rs. " + (<HTMLInputElement>document.getElementById('gst')).value.trim(); 
    let embCharge = "Rs. " + (<HTMLInputElement>document.getElementById('embr')).value.trim(); 
    let embBreakUp = (<HTMLSelectElement>document.getElementById("emb-input")).value.trim();
    let transCharge = "Rs. " + (<HTMLInputElement>document.getElementById('tr-charge')).value.trim(); 
    let netAmount = "Rs. " + document.getElementById('net-total').innerText; 
    let discCost = "Rs. " + this.discCost;
    let grNo = (<HTMLSelectElement>document.getElementById("gr-input")).value.trim();

    billPage.challanNumber = challanNumber;
    billPage.gstbillNumber = gstbillNumber;
    billPage.companyData = companyData;
    billPage.billDate = billDate;
    billPage.table = table;
    billPage.netQty = netQty;
    billPage.billingTotal = billingTotal;
    billPage.embCharge = embCharge;
    billPage.embBreakUp = embBreakUp;
    billPage.gstRate = gstRate;
    billPage.transCharge = transCharge;
    billPage.netAmount = netAmount;
    billPage.disc = discCost;
    billPage.grNo = grNo;

    bill.challanNumber = challanNumber;
    bill.gstbillNumber = gstbillNumber;
    bill.companyData = companyData;
    bill.billDate = new Date(billDate.split('-').reverse().join('-'));
    bill.table = table;
    bill.billingTotal = parseFloat(document.getElementById('bill-total').innerText);
    bill.netQty = parseInt(document.getElementById('net-qty').innerText);
    bill.gstRate = parseFloat((<HTMLInputElement>document.getElementById('gst')).value.trim());
    bill.embCharge = parseFloat((<HTMLInputElement>document.getElementById('embr')).value.trim());
    bill.embBreakUp = embBreakUp;
    bill.transCharge = parseFloat((<HTMLInputElement>document.getElementById('tr-charge')).value.trim());
    bill.netAmount = parseFloat(document.getElementById('net-total').innerText);
    bill.disc = this.discCost;
    bill.grNo = grNo;    

    this.orderService.billingOrder = billPage;
    this.orderService.saveBill(bill).subscribe(res => {
      this.snackBarService.snackMessage('S', 'Bill Saved successfully! Generating bill now...');
      this.printBill(bill);
      // this.router.navigate(['/bill_print']);
    }, err => {
      this.snackBarService.snackMessage('E', 'There was some problem saving the bill.');
    });
  }

  printBill(billPage) {

    let data = [];
    let consData = [];
    let consArr = [];

    let head = [['Sr No.', 'Item', 'Size', 'Rate (in Rs.)', 'Qty', 'Price (in Rs.)']];
    billPage.table.forEach((i, index) => {
      let arr = [];
      let sr = index + 1 + '.';
      let item = i.item;
      let price = i.price;
      let quantity = i.qty;
      let rate = i.rate;
      let size = i.size;
      arr.push(sr);
      arr.push(item);
      arr.push(size);
      arr.push(rate);
      arr.push(quantity);
      arr.push(price);
      data.push(arr);
    });
    data.push(['','', '', 'Total Qty', billPage.netQty, '', '']);

      const doc = new jsPDF('p','pt', 'a4');
      doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
      var img = new Image()
      img.src = 'assets/trendy.PNG'
      doc.addImage(img, 'png', 10, 20, 100, 40, 'NONE', 'NONE', 10);
      doc.setFontSize(20);
      doc.text('ESTIMATE', 250, 45);
      // doc.setFontSize(10);
      doc.setFontSize(12);
      doc.text('O - 0161-2704284', 470, 40);
      doc.setFontSize(14);
      doc.text('Challan No: ' + billPage.challanNumber, 30, 70);
      doc.setFontSize(16);
      var splitTitle = doc.splitTextToSize('Name and Address: ' +billPage.companyData, 300);
      doc.text(30, 90, splitTitle);
      doc.setFontSize(14);
      doc.text(440, 90, 'Dated: ' + formatterDate(billPage.billDate));
      // doc.text(billPage.gstbillNumber, 11,40);
      doc.setTextColor(100);
    
      (doc as any).autoTable({
        head: head,
        body: data,
        startY: 150,
        theme: 'grid',
        didDrawCell: data => {

        }
      })
      let finalY = doc.previousAutoTable.finalY; //this gives you the value of the end-y-axis-position of the previous autotable.
      if(billPage.grNo) {
        doc.text('GR #: ' + billPage.grNo, 40, finalY + 20);
      }

      consArr.push('Total');
      consArr.push('Rs.' + billPage.billingTotal.toFixed(2));
      consData.push(consArr);
      consArr = [];

      if(billPage.disc) {
        consArr.push('Discount');
        consArr.push('Rs.' + billPage.disc.toFixed(2));
        consData.push(consArr);
        consArr = [];
      }
      if(billPage.embCharge) {
        consArr.push('Embroidery. (' + billPage.embBreakUp + ')');
        consArr.push('Rs.' + billPage.embCharge.toFixed(2));
        consData.push(consArr);
        consArr = [];
      }
      if(billPage.gstRate) {
        consArr.push('GST for bill # ' + billPage.gstbillNumber);
        consArr.push('Rs.' +billPage.gstRate.toFixed(2));
        consData.push(consArr);
        consArr = [];
      }
      if(billPage.transCharge) {
        consArr.push('Transport Charges');
        consArr.push('Rs.' +billPage.transCharge.toFixed(2));
        consData.push(consArr);
        consArr = [];
      }

      consArr.push('Net Payable');
      consArr.push('Rs.' + billPage.netAmount.toFixed(2));
      consData.push(consArr);      
      consArr = [];
      
      (doc as any).autoTable({
        // head: head,
        body: consData,
        startY: finalY + 20,
        tableWidth: '300',
        styles: {
          halign: 'right'
       },
        margin: {'left': 250},
        theme: 'plain',
        columnStyles: {
          0: {cellWidth: 220, fontSize: 12, fontStyle: 'bold'},
          1: {cellWidth: 80, fontSize: 12},
        },
        didDrawCell: (cell, data) => {
          // cell.style.hAlign = 'right';
        }
      })

      // Open PDF document in new tab
      // doc.output('dataurlnewwindow');

      doc.save(`challan_${billPage.challanNumber} .pdf`);

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
    
    var selectList = document.createElement("select");
    var editableDiv = document.createElement("div");
    editableDiv.style.minWidth = '340px';
    editableDiv.style.border = '1px solid #f582ae';
    selectList.id = "mySelect";
    cell0.appendChild(selectList);
    for (var i = 0; i < this.items.length; i++) {
      var option = document.createElement("option");
      option.value = this.items[i].id;
      option.text = this.items[i].itemName;
      selectList.appendChild(option);
  }
    cell0.style.border = '1px solid #f582ae';
    cell0.style.padding = '4px 0';
    cell0.style.display = 'flex';
    editableDiv.contentEditable = "true";
    cell0.appendChild(editableDiv);

    cell1.innerHTML = '';
    cell1.contentEditable = "true";
    cell1.style.border = '1px solid #f582ae';
    cell1.style.textAlign = 'center';
    cell1.style.padding = '4px 0';

    var inp1 = document.createElement("input");
    inp1.style.border = '1px solid #f582ae';
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
    inp.style.border = '1px solid #f582ae';
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
    cell4.style.border = '1px solid #f582ae';
    cell4.style.padding = '4px 0';
    cell4.style.textAlign = 'center';
    cell4.classList.add('price');

    // cell6.style.border = '1px solid #DDD';
    // cell6.style.padding = '4px 0';
    // cell6.style.textAlign = 'center';

  }
}

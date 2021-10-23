import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {formatterDate} from './util';

export const getPrintBillObject = (challanNumber, gstBillNumber, companyData, billDate, items, embText, embCharge, embBreakUp, totalQty, billingTotal, gstRate, transCharge, netAmount, disc, grNo) => {
    let bill = {challanNumber: '', gstbillNumber: '', companyData: '', companyId: '', billDate: undefined, table: [], embText: '', embCharge: 0, embBreakUp: '',  netQty: 0, billingTotal: 0, gstRate: 0, transCharge: 0, netAmount: 0, disc: 0.0, grNo: ''};

    bill.challanNumber = challanNumber;
    bill.gstbillNumber = gstBillNumber;
    bill.companyData = companyData;
    bill.billDate = billDate;
    bill.table = items;
    bill.embText = embText;
    bill.embCharge = embCharge;
    bill.embBreakUp = embBreakUp;
    bill.netQty = totalQty;
    bill.billingTotal = billingTotal;
    bill.netQty = totalQty;
    bill.gstRate = gstRate;
    bill.transCharge = transCharge;
    bill.netAmount = netAmount;
    bill.disc = disc;
    bill.grNo = grNo;

    return bill;
}
export const getPrintCashOrderObject = (cashOrderNumber, companyData, billDate, items, embText, embCharge, embBreakUp, totalQty, billingTotal, gstRate, transCharge, netAmount, disc, grNo) => {
    let cashOrder = {cashOrderNumber: '', companyData: '', companyId: '', billDate: undefined, table: [], embText: '', embCharge: 0, embBreakUp: '',  netQty: 0, billingTotal: 0, gstRate: 0, transCharge: 0, netAmount: 0, disc: 0.0, grNo: ''};

    cashOrder.cashOrderNumber = cashOrderNumber;
    cashOrder.companyData = companyData;
    cashOrder.billDate = billDate;
    cashOrder.table = items;
    cashOrder.embText = embText;
    cashOrder.embCharge = embCharge;
    cashOrder.embBreakUp = embBreakUp;
    cashOrder.netQty = totalQty;
    cashOrder.billingTotal = billingTotal;
    cashOrder.netQty = totalQty;
    cashOrder.gstRate = gstRate;
    cashOrder.transCharge = transCharge;
    cashOrder.netAmount = netAmount;
    cashOrder.disc = disc;
    cashOrder.grNo = grNo;

    return cashOrder;
}

export const printBill = (billPage) => {
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
        if(billPage.challanNumber) {
            doc.text('Challan No: ' + billPage.challanNumber, 30, 70);
        } else {
            doc.text('Cash Order No: ' + billPage.cashOrderNumber, 30, 70);
        }
        doc.setFontSize(16);
        var splitTitle = doc.splitTextToSize('Name and Address: ' +billPage.companyData, 300);
        doc.text(30, 90, splitTitle);
        doc.setFontSize(14);
        doc.text(440, 90, 'Dated: ' + formatterDate(billPage.billDate));
        doc.setTextColor(100);
    
        (doc).autoTable({
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
        consArr.push(billPage.embText + '(' + billPage.embBreakUp + ')');
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
        
        (doc).autoTable({
        body: consData,
        startY: finalY + 20,
        tableWidth: '320',
        styles: {
            halign: 'right'
        },
        margin: {'left': 225},
        theme: 'plain',
        columnStyles: {
            0: {cellWidth: 220, fontSize: 12, fontStyle: 'bold'},
            1: {cellWidth: 100, fontSize: 12},
        },
        didDrawCell: (cell, data) => {
        }
        })

        doc.text('---------------------', 30, doc.previousAutoTable.finalY + 50);
        doc.setFontSize(10);
        doc.text('------------------------------', 450, doc.previousAutoTable.finalY + 50);
        doc.setFontSize(10);
        doc.text('(Customer Signature)', 30, doc.previousAutoTable.finalY + 60);
        doc.setFontSize(10);
        doc.text('(For Lavika Knitwears)', 450, doc.previousAutoTable.finalY + 60);
        doc.setFontSize(10);

        // Open PDF document in new tab
        // doc.output('dataurlnewwindow');
        if(billPage.challanNumber) {
            doc.save(`challan_${billPage.challanNumber} .pdf`);
        } else {
            doc.save(`cashOrder_${billPage.cashOrderNumber} .pdf`);
        }
      
}

export const getBillObject = (challanNumber, gstbillNumber, companyId, companyData, billDate, table,
    netQty, billTotal, embText, embrCharge, embBreakUp, gstRate, transCharge, netAmount, discCost, grNo, freightText, discPercent) => {

    let billObject = {challanNumber: '', gstbillNumber: '', companyData: '', companyId: '', billDate: '', table: [], embText:'', embCharge: '', 
    embBreakUp: '', netQty: '', billingTotal: '', gstRate: '', transCharge: '', netAmount: '', disc: '', grNo: '', freightText: '', discPercent: 0.0};

    let rupeeSymbol = 'Rs.';

    billObject.challanNumber = challanNumber;
    billObject.gstbillNumber = gstbillNumber;
    billObject.companyId = companyId;
    billObject.companyData = companyData;
    billObject.billDate = billDate;
    billObject.table = table;
    billObject.netQty = netQty;
    billObject.billingTotal = billTotal;
    // billObject.embCharge = rupeeSymbol + embrCharge;
    billObject.embText = embText;
    billObject.embCharge = embrCharge;
    billObject.embBreakUp = embBreakUp;
    // billObject.gstRate = rupeeSymbol + gstRate;
    billObject.gstRate = gstRate;
    // billObject.transCharge = rupeeSymbol + transCharge;
    billObject.transCharge = transCharge;
    // billObject.netAmount = rupeeSymbol + netAmount;
    billObject.netAmount = netAmount;
    // billObject.disc = rupeeSymbol + discCost;
    billObject.disc = discCost;
    billObject.discPercent = discPercent;
    billObject.grNo = grNo;
    billObject.freightText = freightText;

    return billObject;
}

export const getCashOrderObject = (cashOrderNumber, companyId, companyData, cashOrderDate, table,
    netQty, billTotal, embText, embrCharge, embBreakUp, gstRate, transCharge, netAmount, discCost, grNo, freightText) => {

    let cashOrderObject = {cashOrderNumber: '', companyData: '', companyId: '', cashOrderDate: '', table: [], embText:'', embCharge: '', embBreakUp: '', netQty: '', billingTotal: '', gstRate: '', transCharge: '', netAmount: '', disc: '', grNo: '', freightText: ''};

    cashOrderObject.cashOrderNumber = cashOrderNumber;
    cashOrderObject.companyId = companyId;
    cashOrderObject.companyData = companyData;
    cashOrderObject.cashOrderDate = cashOrderDate;
    cashOrderObject.table = table;
    cashOrderObject.netQty = netQty;
    cashOrderObject.billingTotal = billTotal;
    cashOrderObject.embText = embText;
    cashOrderObject.embCharge = embrCharge;
    cashOrderObject.embBreakUp = embBreakUp;
    cashOrderObject.gstRate = gstRate;
    cashOrderObject.transCharge = transCharge;
    cashOrderObject.netAmount = netAmount;
    cashOrderObject.disc = discCost;
    cashOrderObject.grNo = grNo;
    cashOrderObject.freightText = freightText;
        
    return cashOrderObject;
}

export const formatterDate = (jsDate) => {

     let date = jsDate.getDate();
     if(date <= 9) {
         date = '0'+ date;
     }
     let numMonth = jsDate.getMonth() + 1;
     let year = jsDate.getFullYear();
     let month = '';

     switch (numMonth) {
         case 1 : {
             month = 'Jan';
             break;
         }
         case 2 : {
             month = 'Feb';
             break;
         }
         case 3 : {
             month = 'Mar';
             break;
         }
         case 4 : {
             month = 'Apr';
             break;
         }
         case 5 : {
             month = 'May';
             break;
         }
         case 6 : {
             month = 'Jun';
             break;
         }
         case 7 : {
             month = 'Jul';
             break;
         }
         case 8 : {
             month = 'Aug';
             break;
         }
         case 9 : {
             month = 'Sep';
             break;
         }
         case 10 : {
             month = 'Oct';
             break;
         }
         case 11 : {
             month = 'Nov';
             break;
         }
         case 12 : {
             month = 'Dec';
             break;
         }
     }
     return date + '-' + month + '-' + year;
}
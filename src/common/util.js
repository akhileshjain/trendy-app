export const getBillObject = (challanNumber, gstbillNumber, companyId, companyData, billDate, table,
    netQty, billTotal, embText, embrCharge, embBreakUp, gstRate, transCharge, netAmount, discCost, grNo) => {

    let billObject = {challanNumber: '', gstbillNumber: '', companyData: '', companyId: '', billDate: '', table: [], embText:'', embCharge: '', embBreakUp: '', netQty: '', billingTotal: '', gstRate: '', transCharge: '', netAmount: '', disc: '', grNo: ''};

    let rupeeSymbol = 'Rs.';

    billObject.challanNumber = challanNumber;
    billObject.gstbillNumber = gstbillNumber;
    billObject.companyId = companyId;
    billObject.companyData = companyData;
    billObject.billDate = billDate;
    billObject.table = table;
    billObject.netQty = netQty;
    // billObject.billingTotal = rupeeSymbol + billTotal;
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
    billObject.grNo = grNo;
        
    return billObject;
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
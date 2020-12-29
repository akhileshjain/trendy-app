import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, Subject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { ItemModel } from "./models/item.model";

@Injectable({ providedIn: "root" })
export class OrdersService {
  url = "https://safe-dawn-47148.herokuapp.com/";
  private items = [];
  billingOrder;
  private itemsUpdated = new Subject<any>();

  constructor(private http: HttpClient) {}

  addCustomer(customerData) {
    return this.http.post(`${this.url}api/customer`, customerData).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }
  getCustomers() {
    let d = this.http.get<{data:any}>(`${this.url}api/customers`).pipe(
      map(res => {
        return res.data;
      }), catchError((err) => {
        return throwError(err);
      })
    );
    return d;
  }
  getAllBills() {
     return this.http.get<{data:any}>(`${this.url}api/bills`).pipe(
       catchError((err) => {
         return throwError(err.error);
       })
     );
  }

  saveBill(billObj) {
      return this.http.post(`${this.url}api/bill`, billObj).pipe(
        catchError((err) => {
          return throwError(err.error);
        })
      );
  }
  getChallanNumber() {
    return this.http.get<any>(`${this.url}api/getLatestChallanNo`).pipe(map(res => {
         return (res.data ? parseInt(res.data.challanNumber) + 1 : 1);
    }),
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }
  getItems() {
    this.http.get<{ message: string; data: any }>(`${this.url}api/items`)
      .pipe(map((items) => {
          return items.data.map((item) => {
            return {
              id: item._id,
              itemName: item.itemName,
            };
          });
        })
      )
      .subscribe((transformedItems) => {
        this.items = transformedItems;
        this.itemsUpdated.next([...this.items]);
      });
  }

  getItemUpdateListener() {
    return this.itemsUpdated.asObservable();
  }

  addItem(itemsData) {
    return this.http.post(`${this.url}api/item`, itemsData).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    );
  }
}

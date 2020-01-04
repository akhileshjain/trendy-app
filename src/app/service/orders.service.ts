import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {ItemModel} from './models/item.model';

@Injectable({providedIn: 'root'})
export class OrdersService {
    private items = [];
    billingOrder;
    private itemsUpdated = new Subject<any>();

    constructor(private http: HttpClient) {

    }

    addCustomer(customerData) {
     return this.http.post('http://localhost:3000/api/customer', customerData).pipe(
         catchError(err => {
             return throwError(err.error);
         })
     );
}

getItems() {
 this.http.get<{ message: string; data: any }>('http://localhost:3000/api/items').pipe(map((items) => {
        return items.data.map(item => {
            return {
                id: item._id,
                itemName: item.itemName
            }
        })
 }))
 .subscribe((transformedItems) => {
       this.items = transformedItems;
       this.itemsUpdated.next([...this.items]);
 })
}

getItemUpdateListener() {
    return this.itemsUpdated.asObservable();
  }

addItem(itemsData) {
return this.http.post('http://localhost:3000/api/item', itemsData).pipe(
        catchError(err => {
            return throwError(err.error);
        })
    );
}
}
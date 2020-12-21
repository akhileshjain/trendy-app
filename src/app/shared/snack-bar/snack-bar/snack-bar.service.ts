import { SnackBarComponent } from '../snack-bar/snack-bar.component';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';

@Injectable()
export class SnackBarService {
public message: string;
public isValid: string;
constructor(private snackBar: MatSnackBar) {}

  public snackMessage( isValid: string, message: string, time = 5000) {

   let snackRef: MatSnackBarRef<SnackBarComponent>;
   if (isValid === 'S') {
      snackRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: time, // 6000,
      data: {
        msgty: isValid,
        msgtext: message
      }
    });
   }
   // tslint:disable-next-line:one-line
   else {
      snackRef = this.snackBar.openFromComponent(SnackBarComponent, {
      duration: time, // 6000,
      panelClass: ['error'],
      data: {
        msgty: isValid,
        msgtext: message
      }
    });
   }
 }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';

@Injectable()
export class ConfirmationDialogService {
  config: MatDialogConfig;
  dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  constructor(private dialog: MatDialog) {
    this.config = new MatDialogConfig();
    this.config.disableClose = true;
    this.config.panelClass = 'conf-dialog';
    this.config.width = '35em';
  }

  public confirm(
    title: string,
    message: string,
    cancelButton?: string,
    okayButton?: string,
    width?: string
  ): Observable<boolean> {
    if (width) {
      this.config.width = width;
    } else {
      this.config.width = '35em';
    }
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, this.config);

    this.dialogRef.componentInstance.title = title;
    this.dialogRef.componentInstance.message = message;
    this.dialogRef.componentInstance.closeButtonText = cancelButton || 'Cancel';
    this.dialogRef.componentInstance.confirmButtonText = okayButton || '';

    return this.dialogRef.afterClosed();
  }

  public close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}

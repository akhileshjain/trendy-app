import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

    public title: string;
    public message: string;
    public closeButtonText: string;
    public confirmButtonText: string;
    isConfirmVisible = true;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) { }

  ngOnInit() {
    if ( this.confirmButtonText === '') {
      this.isConfirmVisible = false;
    }
  }

  onDialogConfirm() {
    this.dialogRef.close(true);
  }

  onDialogClose() {
    this.dialogRef.close(false);
  }
}

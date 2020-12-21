import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})

export class SnackBarComponent implements OnInit {
  public message: string;
  public valid: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}

  ngOnInit() {
    debugger;
    if (this.data.msgty === 'S') {
      this.valid = 'S';
      this.message = this.data.msgtext;
    } else {
      this.valid = 'E';
      this.message = this.data.msgtext;
    }
  }
}

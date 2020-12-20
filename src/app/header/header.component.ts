import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isHomePage: boolean;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  onHeaderClick() {
    this.router.navigate(['']);
  }
}

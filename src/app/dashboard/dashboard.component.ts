import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  authorized: boolean = false;
  selectedNavItem: string = '';

  constructor() { }

  //Check authorization
  ngOnInit(): void {
    const authorized = localStorage.getItem('authorized');
    this.authorized = authorized ? true : false;
  }

}

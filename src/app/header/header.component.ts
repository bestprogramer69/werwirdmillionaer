import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  
  @Input() pageTitle: string | undefined;
  @Input() dashboard: boolean=  false;
  @Input() login: boolean | undefined;
  @Input() logout: boolean | undefined;

  @Output() navItemSelected: EventEmitter<string> = new EventEmitter<string>();
  adminNav1Clicked: boolean = false;
  adminNav2Clicked: boolean = false;
  adminNav3Clicked: boolean = false;
  clickedNavItem: string = window.sessionStorage.getItem('clickedNavItem') || 'Highscore';
  authorized: boolean = false;

//check authorization
  ngOnInit() {
    this.navItemSelected.emit(this.clickedNavItem);
    const authorized = localStorage.getItem('authorized');
    this.authorized = authorized ? true : false;
  }
  constructor(private router: Router) {
  
   }

   //set navbar to the clicked Item
   onNavItemClick(navItem: string) {
    this.clickedNavItem = navItem;
    window.sessionStorage.setItem('clickedNavItem', navItem);
    this.navItemSelected.emit(navItem);

    if (navItem === 'Highscore') {
      this.adminNav1Clicked = true;
      this.adminNav2Clicked = false;
      this.adminNav3Clicked = false;
    } else if (navItem === 'Questions') {
      this.adminNav1Clicked = false;
      this.adminNav2Clicked = true;
      this.adminNav3Clicked = false;
    } else if (navItem === 'Categories') {
      this.adminNav1Clicked = false;
      this.adminNav2Clicked = false;
      this.adminNav3Clicked = true;
    }
  }
  
  goToLoginPage() {
    this.router.navigate(['/', 'login'])
  }
  logOut() {
    localStorage.removeItem('authorized');
    this.authorized =false;
    this.router.navigate(['/']);
  }
}

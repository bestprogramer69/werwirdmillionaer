import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router) {}

  user!: string;
  password!: string;

  login() {
    const hash = SHA256(this.password).toString();
    this.http.get(`https://backendwerwirdmillionaer.azurewebsites.net/login/${this.user}`).subscribe((data: any) => {     
      if(!data){
        console.log('login not existing');
      }
      else if ( data[0].password !== hash) {
        console.log('incorrect login');
        return;
      }

      
      localStorage.setItem('authorized', 'true');
      this.router.navigate(['/', 'dashboard']);
    }); 
}
}

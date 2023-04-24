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

  //check login
  login() {
    //hash login
    const hash = SHA256(this.password).toString();      
    //get hashed login from database
    this.http.get(`https://backendwerwirdmillionaer.azurewebsites.net/login/${this.user}`).subscribe((data: any) => {     
      console.log(data);
      if(!data){
        alert('login not existing')
        console.log('login not existing');
        return;
      }
      else if ( data[0].password !== hash) {
        alert('incorrect login')
        console.log('incorrect login');
        return;
      }

      //set to authorized      
      console.log('login correct');

      localStorage.setItem('authorized', 'true');
      this.router.navigate(['/', 'dashboard']);
    }); 
}
}

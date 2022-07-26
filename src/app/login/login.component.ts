import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent{
  form: FormGroup;
  invalidLogin: boolean = false; 

  
  constructor(
    fb: FormBuilder,
    private router: Router, 
    private authService: AuthService){

    this.form = fb.group({
      org: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  signIn(credentials:any) {
    this.authService.login(credentials)
    .subscribe(result => { 
        if (result)
          this.router.navigate(['/home']);
        else 
        this.invalidLogin = true;
      }, 
      (error: any) => {
        this.invalidLogin = true;
      });
  }

  get org(){
    return this.form.get('org');
  }

  get url(){
    return this.form.get('url');
  }

  get username(){
    return this.form.get('username');
  }

  get password(){
    return this.form.get('password');
  }

}

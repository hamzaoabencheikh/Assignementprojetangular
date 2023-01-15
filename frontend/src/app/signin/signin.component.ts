import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { isDevMode } from '@angular/core';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit{


  signInForm! : FormGroup;
  signInData : any = null;

  server = isDevMode() ? 'http://localhost:3000' : '';
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router){}

  ngOnInit(){

    this.signInForm = this.fb.group({
        username: '',
        password: ''
    })

    this.signInForm.valueChanges.subscribe(value =>{
      this.signInData = value;
    }) 
  }

  signIn() : void {
      this.http.post(`${this.server}/api/signIn`,this.signInData).subscribe({
        next: (response: any) => {
            document.cookie = `token=${response.cookie};` ;
            this.router.navigate(['/dashboard']);
        },
        error: (error) => alert(error.error.data),
      });
  }
}

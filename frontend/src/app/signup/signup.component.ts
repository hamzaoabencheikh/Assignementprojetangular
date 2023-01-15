import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { isDevMode } from '@angular/core';


@Component({
  selector: 'app-signin',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{


  signUpForm! : FormGroup;
  signUpData : any = null;
  server = isDevMode() ? 'http://localhost:3000' : '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router){}

  ngOnInit(){
    this.signUpForm = this.fb.group({
        username: '',
        password: ''
    })

    this.signUpForm.valueChanges.subscribe(value =>{
      this.signUpData = value;
    }) 
  }

  signUp() : void {
      this.http.post(`${this.server}/api/signUp`,this.signUpData).subscribe({
        next: (response: any) => {
            document.cookie = `token=${response.cookie};` ;
            this.router.navigate(['/dashboard']);
        },
        error: (error) => alert(error.error.data),
      });
  }
}

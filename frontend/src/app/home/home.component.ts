import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

    assignmentForm! : FormGroup;
    assignmentData: any = null;
    courses: any = []
    images: any = {}
    rateControl: any = null;
    constructor(private fb: FormBuilder, private http: HttpClient){}

    ngOnInit(){
      this.assignmentForm = this.fb.group({
        subject: '',
        name: '',
        mark: 0,
        remark: '',
        date:'',
        completed: new FormControl(false),
      })

      this.assignmentForm.valueChanges.subscribe(value =>{
        if(value.mark > 20){
          value = {...value, mark:20}
        }
        this.assignmentData = value;
        this.selectImages()

      })

      this.http.get("http://localhost:3000/api/courses").subscribe({
        next: (response: any) => {
          this.courses = response;
        }
      })
    }

    submitAssignment() : void {
      console.log(this.assignmentData)
      this.http.post('http://localhost:3000/api/addAssignment',this.assignmentData).subscribe({
        next: (response: any) => {
            alert(response.message)
        },
        error: (error) => console.log(error),
      });
    }

    selectImages(): void{
      const selectedSubject = this.courses.filter((course: any)  => course.name === this.assignmentData.subject)[0]
      this.images = {
        ownerPicture: selectedSubject.ownerPicture,
        assignmentPictures: selectedSubject.assignmentPictures,

      }
  }
  readonly max = 20;
  mynumber = 2;
  validateInput(e: any, input: any = null) {
    let value = +e;
    if (value < 1) value = 1;
    if (value > this.max) value = this.max;
    this.mynumber = value;
    if (input.value != value) {
      const start = input.selectionStart ? input.selectionStart - 1 : -1;
      input.value = value;
      if (start>=0) input.selectionStart = input.selectionEnd = start;
    }
  }
}

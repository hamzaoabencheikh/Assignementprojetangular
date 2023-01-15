import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import { isDevMode } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  assignmentForm! : FormGroup;
  assignmentData: any = null;
  courses: any = []
  images: any = {}
  rateControl: any = null;
  assignments! : any;
  columns = ['subject', 'name', 'mark', 'remark','date']
  displayedColumns = this.columns.concat(['completed'])
  courseForm! : FormGroup 
  courseData: any = null;
  server = isDevMode() ? 'http://localhost:3000' : '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router, private http: HttpClient,private fb: FormBuilder,
  ) {
  }

  ngOnInit(){
    
    this.assignmentForm = this.fb.group({
      subject: '',
      name: '',
      mark: new FormControl(0, [Validators.min(0), Validators.max(20)]),
      remark: '',
      date:'',
      completed: new FormControl(false),
    })
    this.courseForm = this.fb.group({
      name: '',
    })
    this.courseForm.valueChanges.subscribe(value =>{
      this.courseData = value;
    }) 

    this.http.get(`${this.server}/api/verify`,{withCredentials: true}).subscribe({
          next: (response) => {
              const signedin = response;
              if(!signedin){this.router.navigate(['/signin']);}
              else{
                this.http.get(`${this.server}/api/assignments`).subscribe({
                  next: (response: any) => {
                    this.assignments = new MatTableDataSource(response);
                    setTimeout(() => this.assignments.paginator = this.paginator);
                  }
                })
              }
          },
          error: (error) => {
            this.router.navigate(['/signin']);
            console.log(error)
          },
        });
        this.assignmentForm.valueChanges.subscribe(value =>{
          if(value.mark > 20){
            value = {...value, mark:20}
          }
          this.assignmentData = value;
          this.selectImages()
  
        })
  
        this.http.get(`${this.server}/api/courses`).subscribe({
          next: (response: any) => {
            this.courses = response;
          }
        })
  }

  filter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.assignments.filter = filterValue.trim().toLocaleLowerCase();

    if(this.assignments.paginator){
      this.assignments.paginator.firstPage();
    }
  }

  ownerPicture: any = null;
  assignmentPictures: any = null;

  onOwnerPictureSelected(event: any): void {
      this.ownerPicture = event.target.files[0] ?? null;
  }

  onAssignmentPictureSelected(event: any): void{
    this.assignmentPictures = event.target.files[0] ?? null;
  }

  addCourse(){
      const ownerPictureForm = new FormData();
      ownerPictureForm.append("file", this.ownerPicture);
      this.http.post(`${this.server}/api/file/upload`, ownerPictureForm).subscribe({
        next: (response) =>{
            const uploadedOwnerPicture = response
            
            const assignmentPictureForm = new FormData();
            assignmentPictureForm.append("file", this.assignmentPictures);

            this.http.post(`${this.server}/api/file/upload`, assignmentPictureForm).subscribe({
              next: (response) =>{
                  const uploadedAssignmentPictures = response
                  
                  const courseData = {
                      name: this.courseData.name,
                      ownerPicture: uploadedOwnerPicture,
                      assignmentPictures: uploadedAssignmentPictures
                  }

                  this.http.post(`${this.server}/api/addCourse`, courseData).subscribe({
                    next: (response: any) => {
                        alert(response.message)
                    },
                    error: (e) => console.log(e)
                  })


              }
            })
          }
      })
  }

  updateAssignment(id: String, newValue: Boolean): void{
    this.http.post(`${this.server}/api/updateAssignment`, {id:id, newValue:newValue}).subscribe({
      next: (response) =>{
      }
    })
  }

  submitAssignment() : void {
    console.log(this.assignmentData)
    this.http.post(`${this.server}/api/addAssignment`,this.assignmentData).subscribe({
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

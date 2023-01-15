import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'AssignementDevoir';
  server = isDevMode() ? 'http://localhost:3000' : '';

  user = null;
  constructor(
    private router: Router, private http: HttpClient,
  ) {
    router.events.subscribe((val) => {
      this.http.get(`${this.server}/api/getUser`,{withCredentials: true}).subscribe({
        next: (response: any) => {
          this.user = response.username
        }
      })
  });
  }

  ngOnInit(){
    this.http.get(`${this.server}/api/getUser`,{withCredentials: true}).subscribe({
      next: (response: any) => {
        this.user = response.username
      }
    })
  }

  logout(){
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    });

    this.router.navigate(['/signin']);
  }
}

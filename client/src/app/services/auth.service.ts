import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User> = new BehaviorSubject<User>({_id:"",token:"",username:"",profilePicture:""});

  url = "http://localhost:3000";

  error = "";

  constructor( private http: HttpClient, private router : Router) { }

  login(data : {username : String, password : string}) {
    return this.http.post(this.url+"/api/login",{username: data.username, password: data.password}).pipe(
      tap((res : any) => {
        this.authorise(res);
      })
    );
  }

  signup(data : {username : String, password : string}) {
    return this.http.post(this.url+"/api/signup",{username: data.username, password: data.password}).pipe(
      tap((res : any) => {
        this.authorise(res);
      })
    );
  }

  logoff() {
    localStorage.removeItem("web-messenger");
    this.user.next({_id:"",token:"",username:"",profilePicture:""});
    this.router.navigate(['/auth']);
  }

  authorise(res : any) {
    if (res.error) {
      console.log(res.error)
      this.error = res.error;
    } else {
      this.user.next(res);
      this.error = "";
      localStorage.setItem("web-messenger",JSON.stringify(this.user.value));
      this.router.navigate(['/home']);
    }
  }

  checkLocalStroage(){
    let data = localStorage.getItem("web-messenger");
    if(data) {
      this.user.next(JSON.parse(data));
      this.router.navigate(['/home']);
    }
  }
}

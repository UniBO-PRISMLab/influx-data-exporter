import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(credentials:any) { 
    
   return this.http.post<any>('/api/auth', credentials)
     .pipe(
       map(response => {
        let result = response
        if(result){
          localStorage.setItem('token',result)
          return true;
        }
        return false;
       })
     )
  }

  logout() { 
    localStorage.removeItem('token');
  }

  isLoggedIn() { 
    let token = localStorage.getItem('token');
    if(token) return true
    else return false;
  }

  get currentUser(){
    let token = localStorage.getItem('token');
    if(!token) return null;
    
    return helper.decodeToken(token);
  }

}

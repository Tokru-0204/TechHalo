import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../common/Login';
import { Register } from '../common/Register';
import { SessionService } from './session.service';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'http://localhost:8080/api/auth/';

  constructor(private sessionService: SessionService, private http: HttpClient) { }
  login(userData: Login): Observable<any> {
    return this.http.post(this.url + 'signin', userData).pipe(
      catchError(err => {
        console.error('Login error', err);
        throw err; // Hoặc bạn có thể xử lý lỗi theo cách của mình
      })
    );
  }
  register(user: Register): Observable<any> {
    return this.http.post(this.url + 'signup', user);
  }

  forgotPassword(email: string) {
    return this.http.post(this.url + 'send-mail-forgot-password-token', email);
  }

   // Method to get user by email
   getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.url}getUserIdByEmail?email=${email}`);
  }


  
}

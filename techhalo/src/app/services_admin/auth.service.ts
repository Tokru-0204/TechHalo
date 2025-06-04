import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../common/Login';
import { SessionService } from './session.service';
import { User } from '../common/User';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = 'http://localhost:8080/api/auth/';

  constructor(private sessionService: SessionService, private http: HttpClient) { }

  login(userData: Login): Observable<any> {
    return this.http.post(this.url + 'signin',userData);
  }


  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}`);
  }

  getAvailableUsersNotInPromotion(promotionCodeId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}available-not-in-promotion/${promotionCodeId}`);
  }

  public getRoleByEmail(email: string): Observable<string> {
    return this.http.get<{ role: string }>(`${this.url}role-by-email?email=${email}`).pipe(
      map(response => response.role) // Trích xuất giá trị `role` từ JSON
    );
  }

}

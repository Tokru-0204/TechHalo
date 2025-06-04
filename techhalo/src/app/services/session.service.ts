import { Injectable } from '@angular/core';
import { Email } from '../common/Email';
import { Login } from '../common/Login';
import jwt_decode from 'jwt-decode';

const TOKEN_KEY = 'auth-token';
const ROLES_KEY = 'auth-roles';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  login!: Login;
  data!: any;

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public getUser(): any {
    try {
      let email:Email = jwt_decode(String(this.getToken())) as Email;
      return email.sub;
    }
    catch (Error) {
      return null;
    }
  }

  public getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwt_decode(token); // Decode the JWT token
        console.log(decoded); // Log the decoded token to inspect its contents
        return decoded.userId; // Return the userId (assuming it's stored as 'userId' in the JWT token)
      } catch (e) {
        console.error("Error decoding token:", e);
        return null;
      }
    }
    return null;
  }

  public saveRoles(roles: string[]): void {
    sessionStorage.setItem(ROLES_KEY, JSON.stringify(roles));
  }

  public getRoles(): string[] {
    const roles = sessionStorage.getItem(ROLES_KEY);
    return roles ? JSON.parse(roles) : [];
  }

  public hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
  
  
}

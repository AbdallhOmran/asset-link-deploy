import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // matches: router.post('/login', authController.login) in auth.routes.js
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // calls the real login controller:
  // expects { companyEmail, password }, returns { message, token, company }
  login(companyEmail: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { companyEmail, password });
  }

  // ===== Token & session helpers =====

  saveSession(token: string, company: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('company', JSON.stringify(company));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCompany(): any {
    const data = localStorage.getItem('company');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
  }
}
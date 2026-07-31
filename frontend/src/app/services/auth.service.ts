import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // matches: router.post('/login', authController.login) in auth.routes.js
  // private baseUrl = 'https://asset-link-api.vercel.app/api/auth';
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  // calls the real login controller:
  // expects { companyEmail, password }, returns { message, token, company }
  login(companyEmail: string, password: string) {
    return this.http.post(`${this.baseUrl}/login`, { companyEmail, password });
  }

  // POST /api/auth/register-company
  register(data: {
    companyName: string;
    companyEmail: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    commercialRegistrationNumber?: string;
    taxRegister?: string;
    companyAddress?: string;
  }) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/register-company`,
      data
    );
  }

  // POST /api/auth/verify-otp
  verifyOtp(email: string, otp: string) {
    return this.http.post<{ success: boolean; message: string; company?: any }>(
      `${this.baseUrl}/verify-otp`,
      { email, otp }
    );
  }

  // POST /api/auth/resend-otp
  resendOtp(email: string) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/resend-otp`,
      { email }
    );
  }

  // POST /api/auth/forgot-password
  forgotPassword(email: string) {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.baseUrl}/forgot-password`,
      { email }
    );
  }

  // PUT /api/auth/reset-password/:token
  resetPassword(token: string, password: string) {
    return this.http.put<{ success: boolean; message: string }>(
      `${this.baseUrl}/reset-password/${token}`,
      { password }
    );
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
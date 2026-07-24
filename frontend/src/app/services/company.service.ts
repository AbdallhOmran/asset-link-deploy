import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = 'http://localhost:3000/api/company';

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }

}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private baseUrl = 'https://asset-link-api.vercel.app/api/company';

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  updateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/profile`, data);
  }
  getMyAssets() {
    return this.http.get(`${this.baseUrl.replace('company', 'asset')}/my-assets`);
  }
}
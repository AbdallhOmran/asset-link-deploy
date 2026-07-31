import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsEscrowService {

  private apiUrl = 'https://asset-link-api.vercel.app/api/payment';
  // private apiUrl = 'http://localhost:3000/api/payment';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

}
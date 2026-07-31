import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsEscrowService {

  private apiUrl = environment.apiUrl + '/api/payment';
  // private apiUrl = 'http://localhost:3000/api/payment';

  constructor(private http: HttpClient) {}

  private generateIdempotencyKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString();
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  createPayment(bookingId: string): Observable<any> {
    const headers = new HttpHeaders({ 'x-idempotency-key': this.generateIdempotencyKey() });
    return this.http.post<any>(`${this.apiUrl}/create`, { bookingId }, { headers });
  }

  completePayment(bookingId: string): Observable<any> {
    const headers = new HttpHeaders({ 'x-idempotency-key': this.generateIdempotencyKey() });
    return this.http.post<any>(`${this.apiUrl}/pay`, { bookingId }, { headers });
  }

}
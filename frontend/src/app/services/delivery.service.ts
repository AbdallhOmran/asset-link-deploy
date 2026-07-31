import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private apiUrl = environment.apiUrl + '/api/deliveries';
  // private apiUrl = 'http://localhost:3000/api/deliveries';

  constructor(private http: HttpClient) {}

  // Get all deliveries
  getDeliveryHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }

  // Get single delivery
  getDeliveryById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Get delivery timeline
  getDeliveryTimeline(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/timeline`);
  }

  // Create delivery
  createDelivery(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Update delivery status
  updateDeliveryStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, {
      status,
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private baseUrl = 'http://localhost:3000/api/bookings';

  constructor(private http: HttpClient) {}

  // bookings on assets I own (matches GET /bookings/company)
  getCompanyBookings() {
    return this.http.get(`${this.baseUrl}/company`);
  }

  // bookings I made as a renter (matches GET /bookings/my)
  getMyBookings() {
    return this.http.get(`${this.baseUrl}/my`);
  }

  getBookingById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createBooking(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateStatus(id: string, statusData: any) {
    return this.http.patch(`${this.baseUrl}/${id}/status`, statusData);
  }

  cancelBooking(id: string, cancelReason: string) {
    return this.http.patch(`${this.baseUrl}/${id}/cancel`, { cancelReason });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NegotiationService {
  private api = 'http://localhost:3000/api/negotiation';

  constructor(private http: HttpClient) {}

  getHistory(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}/history`);
  }

  getCurrent(companyId: string): Observable<any> {
    return this.http.get(`${this.api}/company/${companyId}/current`);
  }

  counterOffer(negotiationId: string, offerData: any): Observable<any> {
    return this.http.post(`${this.api}/${negotiationId}/offers`, offerData);
  }

  acceptOffer(data: any): Observable<any> {
    return this.http.patch(`${this.api}/${data.negotiationId}/accept`, data);
  }

  rejectOffer(data: any): Observable<any> {
    return this.http.patch(`${this.api}/${data.negotiationId}/reject`, data);
  }
}

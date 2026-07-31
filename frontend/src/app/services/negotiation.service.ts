import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Shape of the first offer sent when starting a new negotiation
export interface VersionData {
  rentPrice: number;
  securityDeposit: number;
  rentalDuration: number;
  durationUnit: 'Day' | 'Week' | 'Month'; // matches version.model.js enum exactly
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NegotiationService {
  private api = 'https://asset-link-api.vercel.app/api/negotiation';
  // private api = 'http://localhost:3000/api/negotiation';

  constructor(private http: HttpClient) {}

  getHistory(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}/history`);
  }

  getNegotiation(companyId: string): Observable<any> {
    return this.http.get(`${this.api}/company/${companyId}`);
  }

  getNegotiationById(id: string): Observable<any> {
    return this.http.get(`${this.api}/${id}`);
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

  // New method — needed for the Orders page (starting a negotiation from a Pending booking)
  createNegotiation(negotiationData: any, versionData: VersionData): Observable<any> {
    return this.http.post(this.api, { negotiationData, versionData });
  }
}
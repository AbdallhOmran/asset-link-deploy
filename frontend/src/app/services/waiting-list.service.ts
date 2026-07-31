import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WaitingListDTO {
  assetId: string;
  companyId: string;
  requestedStartDate: string;
  requestedEndDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class WaitingListService {
  private apiUrl = `${environment.apiUrl}/api/waiting-list`;

  constructor(private http: HttpClient) {}

  joinWaitingList(data: WaitingListDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getWaitingListByAsset(assetId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${assetId}`);
  }

  removeFromWaitingList(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  notifyFirstWaitingCompany(assetId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${assetId}/notify`, {});
  }
}

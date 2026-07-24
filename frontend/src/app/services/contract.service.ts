import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private baseUrl = 'http://localhost:3000/api/contracts';

  constructor(private http: HttpClient) {}

  // matches GET /contracts (returns all contracts)
  getContracts() {
    return this.http.get(this.baseUrl);
  }

  getContractById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createContract(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  approveContract(id: string) {
    return this.http.patch(`${this.baseUrl}/${id}/approve`, {});
  }

  rejectContract(id: string) {
    return this.http.patch(`${this.baseUrl}/${id}/reject`, {});
  }

  getDownloadUrl(id: string): string {
    return `${this.baseUrl}/${id}/download`;
  }

  getViewUrl(id: string): string {
    return `${this.baseUrl}/${id}/view`;
  }
}
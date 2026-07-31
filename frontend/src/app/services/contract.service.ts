import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
<<<<<<< Updated upstream
  private baseUrl = environment.apiUrl + '/api/contracts';
=======
  private baseUrl = 'http://localhost:3000/api/contracts';
>>>>>>> Stashed changes
  // private baseUrl = 'http://localhost:3000/api/contracts';

  constructor(private http: HttpClient) {}

  // GET /contracts — returns all contracts for the logged-in company
  getContracts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // GET /contracts/:id — returns a single contract with populated refs
  getContractById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // POST /contracts — create a new contract (usually triggered from negotiation accept)
  createContract(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  // PATCH /contracts/:id/approve — only the owner company can approve
  approveContract(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/approve`, {});
  }

  // PATCH /contracts/:id/reject — only the owner company can reject
  rejectContract(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/reject`, {});
  }

  // GET /contracts/:id/pdf — generate the PDF server-side
  generatePdf(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`);
  }

  // Direct URL for downloading (opens in new tab)
  getDownloadUrl(id: string): string {
    return `${this.baseUrl}/${id}/download`;
  }

  // Direct URL for viewing (opens in new tab)
  getViewUrl(id: string): string {
    return `${this.baseUrl}/${id}/view`;
  }
}

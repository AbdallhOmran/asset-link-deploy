import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AssetPayload {
  assetCode: string;
  companyId: string;
  assetCategoryId: string;
  assetName: string;
  description: string;
  assetImages: string[];
  price: {
    daily: number;
    weekly?: number;
    monthly?: number;
  };
  securityDeposit?: number;
  minRentalDays?: number;
  maxRentalDays?: number;
  location?: string;
  availableFrom?: string;
  specifications?: {
    operatingWeight?: string;
    enginePower?: string;
    fuelType?: string;
    maxCapacity?: string;
    keyDimension?: string;
    noiseEmissions?: string;
    driveConfiguration?: string;
    additionalSpec?: string;
  };
  maintenance?: {
    status?: string;
    lastMaintenanceDate?: string;
    nextServiceDue?: string;
    notes?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private baseUrl = 'https://asset-link-api.vercel.app/api';
  // private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /** POST /api/asset — requires auth token (injected by AuthInterceptor) */
  addAsset(payload: AssetPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/asset`, payload);
  }

  /** GET /api/asset — list all assets */
  getAssets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/asset`);
  }

  /** GET /api/asset/:id — get single asset */
  getAssetDetails(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asset/${id}`);
  }

  /** GET /api/asset/search — search assets with filters */
  searchAssets(query: any): Observable<any> {
    let params = new HttpParams();
    Object.keys(query).forEach(key => {
      if (query[key] !== null && query[key] !== undefined && query[key] !== '') {
        params = params.append(key, query[key]);
      }
    });
    return this.http.get(`${this.baseUrl}/asset/search`, { params });
  }

  /** PUT /api/asset/:id — update asset */
  updateAsset(id: string, payload: Partial<AssetPayload>): Observable<any> {
    return this.http.put(`${this.baseUrl}/asset/${id}`, payload);
  }

  /** GET /api/assetCategory/viewCategories — list categories for dropdown */
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/assetCategory/viewCategories`);
  }

  /** GET /api/asset/:id/availability — check asset availability */
  getAssetAvailability(id: string, startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get(`${this.baseUrl}/asset/${id}/availability`, { params });
  }

  /** GET /api/asset/:id/availability without dates — returns all active bookings */
  getAssetBookings(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/asset/${id}/availability`);
  }

  /** GET /api/asset/recommended — get recommended assets based on smart AI matching */
  getRecommendedAssets(query?: any): Observable<any> {
    let params = new HttpParams();
    if (query) {
      Object.keys(query).forEach(key => {
        if (query[key] !== null && query[key] !== undefined && query[key] !== '') {
          params = params.append(key, query[key]);
        }
      });
    }
    return this.http.get(`${this.baseUrl}/asset/recommended`, { params });
  }
}

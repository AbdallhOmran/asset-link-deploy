import { HttpClient } from '@angular/common/http';
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
  private baseUrl = 'http://localhost:3000/api';

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

  /** PUT /api/asset/:id — update asset */
  updateAsset(id: string, payload: Partial<AssetPayload>): Observable<any> {
    return this.http.put(`${this.baseUrl}/asset/${id}`, payload);
  }

  /** GET /api/assetCategory/viewCategories — list categories for dropdown */
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/assetCategory/viewCategories`);
  }
}

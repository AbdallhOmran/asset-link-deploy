import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AssetCategory {
  _id: string;
  assetCategoryName: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  // private baseUrl = 'https://asset-link-api.vercel.app/api/assetCategory';
  private baseUrl = 'http://localhost:3000/api/assetCategory';

  constructor(private http: HttpClient) {}

  /** POST /api/assetCategory/addCategory — body: { assetCategoryName } */
  addCategory(name: string): Observable<AssetCategory> {
    return this.http.post<AssetCategory>(`${this.baseUrl}/addCategory`, {
      assetCategoryName: name,
    });
  }

  /** GET /api/assetCategory/viewCategories */
  getCategories(): Observable<AssetCategory[]> {
    return this.http.get<AssetCategory[]>(`${this.baseUrl}/viewCategories`);
  }
}

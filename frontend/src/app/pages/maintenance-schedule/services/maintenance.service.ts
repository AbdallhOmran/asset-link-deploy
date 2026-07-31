import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of, combineLatest } from 'rxjs';
import {
  MaintenanceRecord,
  AssetMaintenanceSummary,
  NewMaintenanceRequest,
  MaintenanceFilterOptions,
  MaintenanceStats,
  MaintenanceStatusType,
} from '../models/maintenance.model';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private readonly baseUrl = environment.apiUrl + '/api/maintenances';
  private readonly assetUrl = environment.apiUrl + '/api/asset';

  private recordsSubject = new BehaviorSubject<MaintenanceRecord[]>([]);
  private assetsSubject = new BehaviorSubject<AssetMaintenanceSummary[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filterSubject = new BehaviorSubject<MaintenanceFilterOptions>({
    searchQuery: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    priorityFilter: 'all',
  });

  public records$ = this.recordsSubject.asObservable();
  public assets$ = this.assetsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public filters$ = this.filterSubject.asObservable();

  public filteredRecords$: Observable<MaintenanceRecord[]> = combineLatest([
    this.recordsSubject,
    this.filterSubject,
  ]).pipe(
    map(([records, filters]) => {
      return records.filter((r) => {
        const matchesQuery =
          !filters.searchQuery ||
          (r.assetName || '').toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          (r.assetCode || '').toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          (r.maintenanceCode || '').toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          (r.desc || '').toLowerCase().includes(filters.searchQuery.toLowerCase());

        const matchesStatus =
          filters.statusFilter === 'all' || r.status === filters.statusFilter;

        return matchesQuery && matchesStatus;
      });
    })
  );

  public stats$: Observable<MaintenanceStats> = combineLatest([
    this.recordsSubject,
    this.assetsSubject,
  ]).pipe(
    map(([records, assets]) => {
      return {
        totalAssets: assets.length || records.length,
        currentCount: records.filter((r) => r.status === 'completed').length,
        upcomingCount: records.filter((r) => r.status === 'scheduled').length,
        inProgressCount: records.filter((r) => r.status === 'in-progress').length,
        overdueCount: records.filter((r) => r.status === 'scheduled').length,
        totalMaintenanceCostThisMonth: records.reduce(
          (sum, r) => sum + (r.cost || 0),
          0
        ),
      };
    })
  );

  constructor(private http: HttpClient) {}

  loadMaintenanceRecords(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const filters = this.filterSubject.value;
    let params = new HttpParams();
    
    if (filters.statusFilter && filters.statusFilter !== 'all') {
      const reverseMap: Record<string, string> = {
        'scheduled': 'Scheduled',
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
      };
      params = params.set('status', reverseMap[filters.statusFilter] || filters.statusFilter);
    }
    
    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    this.http.get<any>(`${this.baseUrl}/history`, { params }).subscribe({
      next: (res) => {
        const data = res.data || res || [];
        const mapped = this.mapBackendRecords(Array.isArray(data) ? data : []);
        this.recordsSubject.next(mapped);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.errorSubject.next(
          err.error?.message || err.error?.error || 'Failed to load maintenance records'
        );
        this.loadingSubject.next(false);
      },
    });
  }

  loadAssets(): void {
    this.http.get<any>(this.assetUrl).pipe(
      catchError(() => of([]))
    ).subscribe((res) => {
      const assets = Array.isArray(res) ? res : res.data || res.assets || [];
      const mapped: AssetMaintenanceSummary[] = assets.map((a: any) => ({
        assetId: a._id,
        assetCode: a.assetCode || '',
        assetName: a.assetName || '',
        category: a.assetCategoryId?.name || 'General',
        company: a.companyId?.companyName || '',
        maintenanceStatus: a.status === 'Maintenance' ? 'in-progress' as MaintenanceStatusType : 'current' as MaintenanceStatusType,
        lastMaintenance: '',
        nextMaintenance: '',
        hoursOperated: 0,
        healthScore: a.healthScore || 100,
        thresholdHours: 3000,
      }));
      this.assetsSubject.next(mapped);
    });
  }

  requestNewMaintenance(req: NewMaintenanceRequest): Observable<any> {
    const payload = {
      assetId: req.assetId,
      issueDescription: `${req.maintenanceType}: ${req.notes}`,
      maintenanceCost: req.estimatedHours ? req.estimatedHours * 120 : 500,
      maintenanceDate: req.scheduledDate,
      notes: req.notes,
    };

    return this.http.post<any>(this.baseUrl, payload).pipe(
      tap(() => this.loadMaintenanceRecords()),
      catchError((err) => {
        throw err.error?.error || 'Failed to create maintenance';
      })
    );
  }

  updateMaintenanceStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, { status }).pipe(
      tap(() => this.loadMaintenanceRecords()),
      catchError((err) => {
        throw err.error?.error || 'Failed to update status';
      })
    );
  }

  deleteMaintenance(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadMaintenanceRecords()),
      catchError((err) => {
        throw err.error?.error || 'Failed to delete maintenance';
      })
    );
  }

  updateFilters(newFilters: Partial<MaintenanceFilterOptions>): void {
    this.filterSubject.next({
      ...this.filterSubject.value,
      ...newFilters,
    });
  }

  private mapBackendRecords(records: any[]): MaintenanceRecord[] {
    return records.map((r: any) => {
      const asset = r.assetId || {};
      return {
        id: r._id,
        maintenanceCode: r.maintenanceCode || '',
        assetId: typeof r.assetId === 'object' ? r.assetId?._id : r.assetId,
        assetCode: asset.assetCode || '',
        assetName: asset.assetName || 'Unknown Asset',
        category: asset.assetCategoryId?.name || 'General',
        type: r.issueDescription || '',
        tech: 'Assigned',
        date: r.maintenanceDate
          ? new Date(r.maintenanceDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : '',
        hrs: 0,
        status: this.mapStatus(r.status),
        priority: 'medium' as any,
        desc: r.notes || r.issueDescription || '',
        cost: r.maintenanceCost || 0,
      };
    });
  }

  private mapStatus(backendStatus: string): any {
    const map: Record<string, string> = {
      'Pending': 'scheduled',
      'Scheduled': 'scheduled',
      'In Progress': 'in-progress',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
    };
    return map[backendStatus] || backendStatus?.toLowerCase() || 'scheduled';
  }
}
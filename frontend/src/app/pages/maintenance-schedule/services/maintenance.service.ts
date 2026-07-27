import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, catchError, of } from 'rxjs';
import {
  MaintenanceRecord,
  AssetMaintenanceSummary,
  NewMaintenanceRequest,
  MaintenanceFilterOptions,
  MaintenanceStats,
  MaintenanceStatusType
} from '../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private readonly apiUrl = 'http://localhost:3000/api/maintenances';

  // BehaviorSubjects for reactive state management
  private assetsSubject = new BehaviorSubject<AssetMaintenanceSummary[]>([]);
  private recordsSubject = new BehaviorSubject<MaintenanceRecord[]>([]);
  private filterSubject = new BehaviorSubject<MaintenanceFilterOptions>({
    searchQuery: '',
    statusFilter: 'all',
    categoryFilter: 'all',
    priorityFilter: 'all'
  });

  public assets$: Observable<AssetMaintenanceSummary[]> = this.assetsSubject.asObservable();
  public records$: Observable<MaintenanceRecord[]> = this.recordsSubject.asObservable();
  public filters$: Observable<MaintenanceFilterOptions> = this.filterSubject.asObservable();

  // Filtered records pipeline
  public filteredRecords$: Observable<MaintenanceRecord[]> = this.recordsSubject.pipe(
    map(records => {
      const filters = this.filterSubject.value;
      return records.filter(r => {
        const matchesQuery = !filters.searchQuery ||
          r.assetName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          r.assetCode.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          r.tech.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          r.type.toLowerCase().includes(filters.searchQuery.toLowerCase());

        const matchesStatus = filters.statusFilter === 'all' || r.status === filters.statusFilter;
        const matchesCategory = filters.categoryFilter === 'all' || r.category === filters.categoryFilter;
        const matchesPriority = filters.priorityFilter === 'all' || r.priority === filters.priorityFilter;

        return matchesQuery && matchesStatus && matchesCategory && matchesPriority;
      });
    })
  );

  // Statistics calculation pipeline
  public stats$: Observable<MaintenanceStats> = this.assets$.pipe(
    map(assets => {
      const records = this.recordsSubject.value;
      return {
        totalAssets: assets.length,
        currentCount: assets.filter(a => a.maintenanceStatus === 'current').length,
        upcomingCount: assets.filter(a => a.maintenanceStatus === 'upcoming').length,
        inProgressCount: assets.filter(a => a.maintenanceStatus === 'in-progress').length,
        overdueCount: assets.filter(a => a.maintenanceStatus === 'overdue').length,
        totalMaintenanceCostThisMonth: records.reduce((sum, r) => sum + (r.cost || 0), 0)
      };
    })
  );

  constructor(private http: HttpClient) {
    this.loadMaintenanceHistory();
  }

  // ── Data Loading from API ──

  /**
   * Load maintenance history from backend API
   * Maps backend fields to frontend MaintenanceRecord model
   */
  public loadMaintenanceHistory(): void {
    this.http.get<any[]>(`${this.apiUrl}/history`).pipe(
      map(backendRecords => this.mapBackendToRecords(backendRecords)),
      catchError(err => {
        console.error('Failed to load maintenance history:', err);
        return of([]);
      })
    ).subscribe(records => {
      this.recordsSubject.next(records);
      this.buildAssetSummaries(records);
    });
  }

  /**
   * Map backend maintenance records to frontend MaintenanceRecord model
   * Backend: { _id, maintenanceCode, assetId (populated), issueDescription, maintenanceCost, maintenanceDate, notes, status }
   * Frontend: { id, assetId, assetName, assetCode, category, type, tech, date, hrs, status, desc, priority, cost }
   */
  private mapBackendToRecords(backendRecords: any[]): MaintenanceRecord[] {
    return backendRecords.map(r => {
      const asset = r.assetId || {};
      return {
        id: r._id || r.maintenanceCode,
        assetId: typeof r.assetId === 'object' ? r.assetId._id : r.assetId,
        assetName: asset.assetName || asset.name || 'Unknown Asset',
        assetCode: asset.assetCode || r.maintenanceCode || '',
        category: asset.category || 'General',
        type: r.issueDescription || 'Maintenance',
        tech: r.assignedTo || 'Unassigned',
        date: r.maintenanceDate ? new Date(r.maintenanceDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '',
        hrs: asset.hoursOperated || 0,
        status: this.mapBackendStatus(r.status),
        priority: r.priority || 'medium',
        desc: r.notes || r.issueDescription || '',
        cost: r.maintenanceCost || 0
      };
    });
  }

  /**
   * Map backend status strings to frontend status types
   */
  private mapBackendStatus(status: string): 'completed' | 'in-progress' | 'scheduled' | 'cancelled' {
    const statusMap: Record<string, 'completed' | 'in-progress' | 'scheduled' | 'cancelled'> = {
      'Completed': 'completed',
      'In Progress': 'in-progress',
      'Scheduled': 'scheduled',
      'Pending': 'scheduled',
      'Cancelled': 'cancelled'
    };
    return statusMap[status] || 'scheduled';
  }

  /**
   * Build asset summaries from maintenance records
   */
  private buildAssetSummaries(records: MaintenanceRecord[]): void {
    const assetMap = new Map<string, AssetMaintenanceSummary>();

    records.forEach(r => {
      if (!assetMap.has(r.assetId)) {
        let maintenanceStatus: MaintenanceStatusType = 'current';
        if (r.status === 'in-progress') maintenanceStatus = 'in-progress';
        else if (r.status === 'scheduled') maintenanceStatus = 'upcoming';

        assetMap.set(r.assetId, {
          assetId: r.assetId,
          assetCode: r.assetCode,
          assetName: r.assetName,
          category: r.category,
          company: '',
          maintenanceStatus,
          lastMaintenance: r.status === 'completed' ? r.date : '',
          nextMaintenance: r.status === 'scheduled' ? r.date : '',
          hoursOperated: r.hrs,
          healthScore: r.status === 'completed' ? 90 : r.status === 'in-progress' ? 70 : 80,
          thresholdHours: r.hrs + 500
        });
      }
    });

    this.assetsSubject.next(Array.from(assetMap.values()));
  }

  // ── Actions ──

  public updateFilters(newFilters: Partial<MaintenanceFilterOptions>): void {
    this.filterSubject.next({
      ...this.filterSubject.value,
      ...newFilters
    });
  }

  /**
   * Create a new maintenance request via API
   * Maps frontend NewMaintenanceRequest to backend expected payload
   */
  public requestNewMaintenance(req: NewMaintenanceRequest): Observable<MaintenanceRecord> {
    const apiPayload = {
      assetId: req.assetId,
      issueDescription: req.maintenanceType,
      maintenanceCost: req.estimatedHours ? req.estimatedHours * 120 : 500,
      maintenanceDate: req.scheduledDate,
      notes: req.notes
    };

    return this.http.post<any>(this.apiUrl, apiPayload).pipe(
      map(backendRecord => {
        const mapped = this.mapBackendToRecords([backendRecord])[0];
        // Update local state with the new record
        const updatedRecords = [mapped, ...this.recordsSubject.value];
        this.recordsSubject.next(updatedRecords);
        this.buildAssetSummaries(updatedRecords);
        return mapped;
      }),
      catchError(err => {
        console.error('Failed to create maintenance:', err);
        throw err;
      })
    );
  }

  /**
   * Update maintenance status via API
   */
  public updateMaintenanceStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      tap(() => this.loadMaintenanceHistory()),
      catchError(err => {
        console.error('Failed to update maintenance status:', err);
        throw err;
      })
    );
  }

  /**
   * Delete maintenance via API
   */
  public deleteMaintenance(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.loadMaintenanceHistory()),
      catchError(err => {
        console.error('Failed to delete maintenance:', err);
        throw err;
      })
    );
  }
}


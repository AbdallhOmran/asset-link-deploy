import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  of,
  map,
  forkJoin,
} from 'rxjs';

import {
  InspectionRecord,
  CreateInspectionPayload,
  InspectionStats,
  InspectionFilterOptions,
} from '../models/inspection.model';

@Injectable({
  providedIn: 'root',
})
export class InspectionService {
  private readonly baseUrl = environment.apiUrl + '/api/inspection';
  private readonly bookingUrl = environment.apiUrl + '/api/bookings';
  private readonly assetUrl = environment.apiUrl + '/api/asset';

  // Reactive state
  private inspectionsSubject = new BehaviorSubject<InspectionRecord[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  private filterSubject = new BehaviorSubject<InspectionFilterOptions>({
    searchQuery: '',
    statusFilter: 'all',
    typeFilter: 'all',
  });

  public inspections$ = this.inspectionsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  public filters$ = this.filterSubject.asObservable();

  // Filtered inspections pipeline
  public filteredInspections$: Observable<InspectionRecord[]> =
    this.inspections$.pipe(
      map((inspections) => {
        const filters = this.filterSubject.value;

        return inspections.filter((r) => {
          const matchesQuery =
            !filters.searchQuery ||
            (r.inspectorName || '')
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            (r.assetId?.assetName || '')
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            (r.assetId?.assetCode || '')
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase()) ||
            (r.bookingId?.bookingCode || '')
              .toLowerCase()
              .includes(filters.searchQuery.toLowerCase());

          const matchesStatus =
            filters.statusFilter === 'all' ||
            r.status === filters.statusFilter;

          const matchesType =
            filters.typeFilter === 'all' ||
            r.inspectionType === filters.typeFilter;

          return (
            matchesQuery &&
            matchesStatus &&
            matchesType
          );
        });
      })
    );

  // Stats pipeline
  public stats$: Observable<InspectionStats> = this.inspections$.pipe(
    map((inspections) => {
      const total = inspections.length;

      const passedCount = inspections.filter(
        (i) => i.status === 'Passed'
      ).length;

      const failedCount = inspections.filter(
        (i) => i.status === 'Failed'
      ).length;

      const averageScore =
        total > 0
          ? Math.round(
              inspections.reduce(
                (sum, i) => sum + i.conditionScore,
                0
              ) / total
            )
          : 0;

      return {
        total,
        passedCount,
        failedCount,
        averageScore,
      };
    })
  );

  constructor(private http: HttpClient) {}

  // ─────────────────────────────────────────────
  // Data Fetching
  // ─────────────────────────────────────────────

  loadInspections(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    const filters = this.filterSubject.value;

    let params = new HttpParams();

    if (
      filters.statusFilter &&
      filters.statusFilter !== 'all'
    ) {
      params = params.set('status', filters.statusFilter);
    }

    if (
      filters.typeFilter &&
      filters.typeFilter !== 'all'
    ) {
      params = params.set(
        'inspectionType',
        filters.typeFilter
      );
    }

    this.http.get<any>(this.baseUrl, { params }).subscribe({
      next: (res) => {
        this.inspectionsSubject.next(res.data || []);
        this.loadingSubject.next(false);
      },
      error: (err) => {
        this.errorSubject.next(
          err.error?.message || 'Failed to load inspections'
        );
        this.loadingSubject.next(false);
      },
    });
  }

  getInspectionById(id: string): Observable<InspectionRecord> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res) => res.data),
      catchError((err) => {
        throw err.error?.message || 'Failed to load inspection';
      })
    );
  }

  // ─────────────────────────────────────────────
  // CRUD
  // ─────────────────────────────────────────────

  createInspection(
    payload: CreateInspectionPayload
  ): Observable<InspectionRecord> {
    return this.http
      .post<any>(`${this.baseUrl}/create`, payload)
      .pipe(
        tap(() => {
          this.loadInspections();
        }),
        map((res) => res.data),
        catchError((err) => {
          throw err.error?.message || 'Failed to create inspection';
        })
      );
  }

  updateInspection(
    id: string,
    data: Partial<CreateInspectionPayload>
  ): Observable<InspectionRecord> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data).pipe(
      tap(() => this.loadInspections()),
      map((res) => res.data),
      catchError((err) => {
        throw err.error?.message || 'Failed to update inspection';
      })
    );
  }

  deleteInspection(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadInspections()),
      catchError((err) => {
        throw err.error?.message || 'Failed to delete inspection';
      })
    );
  }

  // ─────────────────────────────────────────────
  // Filters
  // ─────────────────────────────────────────────

  updateFilters(
    newFilters: Partial<InspectionFilterOptions>
  ): void {
    this.filterSubject.next({
      ...this.filterSubject.value,
      ...newFilters,
    });

    // Re-trigger filtered pipeline
    this.inspectionsSubject.next(this.inspectionsSubject.value);
  }

  // ─────────────────────────────────────────────
  // Assets & Bookings
  // ─────────────────────────────────────────────

  getAssets(): Observable<any[]> {
    return this.http.get<any>(this.assetUrl).pipe(
      map((res) =>
        Array.isArray(res)
          ? res
          : res.data || res.assets || []
      ),
      catchError(() => of([]))
    );
  }

  getBookings(): Observable<any[]> {
    return forkJoin([
      this.http
        .get<any>(this.bookingUrl + '/company')
        .pipe(catchError(() => of([]))),
      this.http
        .get<any>(this.bookingUrl + '/my')
        .pipe(catchError(() => of([]))),
    ]).pipe(
      map(([res1, res2]) => {
        const arr1 = Array.isArray(res1)
          ? res1
          : res1.data || res1.bookings || [];

        const arr2 = Array.isArray(res2)
          ? res2
          : res2.data || res2.bookings || [];

        return [...arr1, ...arr2];
      })
    );
  }
}
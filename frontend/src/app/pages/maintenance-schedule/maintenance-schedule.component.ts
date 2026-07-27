import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceService } from './services/maintenance.service';
import {
  MaintenanceRecord,
  AssetMaintenanceSummary,
  MaintenanceStats,
  MaintenanceStatusType,
  NewMaintenanceRequest,
} from './models/maintenance.model';

@Component({
  selector: 'app-maintenance-schedule',
  templateUrl: './maintenance-schedule.component.html',
  styleUrls: ['./maintenance-schedule.component.css'],
})
export class MaintenanceScheduleComponent implements OnInit {
  filteredRecords$: Observable<MaintenanceRecord[]>;
  assets$: Observable<AssetMaintenanceSummary[]>;
  stats$: Observable<MaintenanceStats>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  isRequestModalOpen = false;
  activeStatusFilter: 'all' | MaintenanceStatusType = 'all';

  // Delete confirmation
  showDeleteConfirm = false;
  maintenanceToDelete: MaintenanceRecord | null = null;
  deleteError: string | null = null;

  constructor(private maintenanceService: MaintenanceService) {
    this.filteredRecords$ = this.maintenanceService.filteredRecords$;
    this.assets$ = this.maintenanceService.assets$;
    this.stats$ = this.maintenanceService.stats$;
    this.loading$ = this.maintenanceService.loading$;
    this.error$ = this.maintenanceService.error$;
  }

  ngOnInit(): void {
    this.maintenanceService.loadMaintenanceRecords();
    this.maintenanceService.loadAssets();
  }

  onSearch(query: string): void {
    this.maintenanceService.updateFilters({ searchQuery: query });
  }

  onFilterStatus(status: 'all' | MaintenanceStatusType): void {
    this.activeStatusFilter = status;
    this.maintenanceService.updateFilters({ statusFilter: status });
  }

  onDateRangeChange(range: { start: string; end: string }): void {
    this.maintenanceService.updateFilters({ startDate: range.start, endDate: range.end });
  }

  openRequestModal(): void {
    this.isRequestModalOpen = true;
  }

  closeRequestModal(): void {
    this.isRequestModalOpen = false;
  }

  handleNewRequest(request: NewMaintenanceRequest): void {
    this.maintenanceService.requestNewMaintenance(request).subscribe({
      next: () => {
        this.closeRequestModal();
      },
      error: (err: any) => {
        console.error('Failed to create maintenance:', err);
      },
    });
  }

  // Status update
  onStatusUpdate(event: { id: string; status: string }): void {
    this.maintenanceService.updateMaintenanceStatus(event.id, event.status).subscribe({
      error: (err: any) => {
        console.error('Failed to update status:', err);
      },
    });
  }

  // Delete flow
  confirmDelete(record: MaintenanceRecord): void {
    this.maintenanceToDelete = record;
    this.showDeleteConfirm = true;
    this.deleteError = null;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.maintenanceToDelete = null;
    this.deleteError = null;
  }

  executeDelete(): void {
    if (!this.maintenanceToDelete) return;

    this.maintenanceService.deleteMaintenance(this.maintenanceToDelete.id).subscribe({
      next: () => {
        this.cancelDelete();
      },
      error: (err: any) => {
        this.deleteError = typeof err === 'string' ? err : 'Failed to delete';
      },
    });
  }

  retryLoad(): void {
    this.maintenanceService.loadMaintenanceRecords();
    this.maintenanceService.loadAssets();
  }
}

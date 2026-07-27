import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  typeFilter: string = 'all';

  // Delete confirmation
  showDeleteConfirm = false;
  maintenanceToDelete: MaintenanceRecord | null = null;
  deleteError: string | null = null;

  // Maintenance type metadata matching Figma
  maintTypeMeta: Record<string, { color: string; bg: string; border: string; icon: string }> = {
    'Routine':       { color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100',   icon: 'clipboard-list' },
    'Preventive':    { color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-100',   icon: 'shield-check' },
    'Emergency':     { color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100',    icon: 'alert-triangle' },
    'Corrective':    { color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100',  icon: 'hammer' },
    'Certification': { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100', icon: 'badge-check' },
  };

  // Status metadata matching Figma
  maintStatusMeta: Record<string, { color: string; bg: string; border: string; dot: string; label: string; pulse: boolean }> = {
    'scheduled':   { color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-100',    dot: 'bg-blue-500',    label: 'Scheduled',   pulse: false },
    'in-progress': { color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-100',   dot: 'bg-amber-500',   label: 'In Progress', pulse: true },
    'completed':   { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500', label: 'Completed',   pulse: false },
    'overdue':     { color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-100',     dot: 'bg-red-500',     label: 'Overdue',     pulse: false },
    'cancelled':   { color: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-100',   dot: 'bg-slate-400',   label: 'Cancelled',   pulse: false },
  };

  maintTypes = ['Routine', 'Preventive', 'Emergency', 'Corrective', 'Certification'];

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

  // Figma helpers
  formatCost(amount: number): string {
    return '$' + amount.toLocaleString('en-US');
  }

  getTypeMeta(type: string) {
    return this.maintTypeMeta[type] || this.maintTypeMeta['Routine'];
  }

  getStatusMeta(status: string) {
    return this.maintStatusMeta[status] || this.maintStatusMeta['scheduled'];
  }

  getInitials(name: string): string {
    return (name || '')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  getPriorityDot(priority: string): string {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-400';
      default:
        return 'bg-slate-300';
    }
  }
}

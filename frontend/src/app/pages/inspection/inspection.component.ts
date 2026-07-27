import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InspectionService } from './services/inspection.service';
import {
  InspectionRecord,
  InspectionStats,
  InspectionStatus,
  CreateInspectionPayload,
} from './models/inspection.model';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css'],
})
export class InspectionComponent implements OnInit {
  filteredInspections$: Observable<InspectionRecord[]>;
  stats$: Observable<InspectionStats>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  activeStatusFilter: 'all' | InspectionStatus = 'all';
  isCreateModalOpen = false;

  assets: any[] = [];
  bookings: any[] = [];

  // Delete confirmation
  showDeleteConfirm = false;
  inspectionToDelete: InspectionRecord | null = null;
  deleteError: string | null = null;

  activeFilter: 'all' | 'Pre-Rental' | 'Post-Rental' = 'all';

  // Inspector identity stats (static for now, could be derived from records)
  inspectorStats = {
    assignedToday: 3,
    highPriority: 1,
    completedMtd: 12
  };

  constructor(private inspectionService: InspectionService) {
    this.filteredInspections$ = this.inspectionService.filteredInspections$;
    this.stats$ = this.inspectionService.stats$;
    this.loading$ = this.inspectionService.loading$;
    this.error$ = this.inspectionService.error$;
  }

  ngOnInit(): void {
    this.inspectionService.loadInspections();
    this.loadDropdownData();
  }

  setPhaseFilter(phase: 'all' | 'Pre-Rental' | 'Post-Rental'): void {
    this.activeFilter = phase;
    // We could filter locally or via backend. For now, since we don't have phase in backend yet, 
    // we will rely on client side or backend if it supports it.
    // If backend doesn't support 'phase', we filter locally in the template.
  }

  private loadDropdownData(): void {
    this.inspectionService.getAssets().subscribe((data) => (this.assets = data));
    this.inspectionService.getBookings().subscribe((data) => (this.bookings = data));
  }

  onSearch(query: string): void {
    this.inspectionService.updateFilters({ searchQuery: query });
  }

  onFilterStatus(status: 'all' | InspectionStatus): void {
    this.activeStatusFilter = status;
    this.inspectionService.updateFilters({ statusFilter: status });
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  handleNewInspection(payload: CreateInspectionPayload): void {
    this.inspectionService.createInspection(payload).subscribe({
      next: () => {
        this.closeCreateModal();
      },
      error: (err) => {
        console.error('Failed to create inspection:', err);
      },
    });
  }

  // Delete flow
  confirmDelete(record: InspectionRecord): void {
    this.inspectionToDelete = record;
    this.showDeleteConfirm = true;
    this.deleteError = null;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.inspectionToDelete = null;
    this.deleteError = null;
  }

  executeDelete(): void {
    if (!this.inspectionToDelete) return;

    this.inspectionService.deleteInspection(this.inspectionToDelete._id).subscribe({
      next: () => {
        this.cancelDelete();
      },
      error: (err) => {
        this.deleteError = typeof err === 'string' ? err : 'Failed to delete inspection';
      },
    });
  }

  retryLoad(): void {
    this.inspectionService.loadInspections();
  }
}

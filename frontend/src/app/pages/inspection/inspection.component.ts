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

  // Figma-matching state
  activeInsp: string | null = null;
  startedIds: Set<string> = new Set();

  // Inspector identity stats
  inspectorStats = {
    assignedToday: 3,
    highPriority: 1,
    completedMtd: 12,
  };

  // Priority metadata matching Figma
  priorityMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
    high: { label: 'High Priority', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' },
    medium: { label: 'Medium Priority', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
    low: { label: 'Low Priority', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' },
  };

  // Phase metadata matching Figma
  phaseMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
    'Pre-Rental': { label: 'Pre-Rental', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
    'Post-Rental': { label: 'Post-Rental', color: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100' },
    'Inspection': { label: 'Inspection', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100' },
  };

  // Gradient configs per inspection index
  gradientConfigs = [
    { from: '#1E40AF', to: '#0E7490', accent: '#38BDF8' },
    { from: '#78350F', to: '#B45309', accent: '#FCD34D' },
    { from: '#1E3A5F', to: '#374151', accent: '#94A3B8' },
    { from: '#065F46', to: '#047857', accent: '#34D399' },
    { from: '#7C3AED', to: '#4F46E5', accent: '#A78BFA' },
    { from: '#BE185D', to: '#E11D48', accent: '#FDA4AF' },
  ];

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

  // Figma-matching methods
  toggleExpand(inspId: string): void {
    this.activeInsp = this.activeInsp === inspId ? null : inspId;
  }

  isExpanded(inspId: string): boolean {
    return this.activeInsp === inspId;
  }

  startInspection(inspId: string): void {
    this.startedIds.add(inspId);
  }

  isStarted(inspId: string): boolean {
    return this.startedIds.has(inspId);
  }

  getGradient(index: number): { from: string; to: string; accent: string } {
    return this.gradientConfigs[index % this.gradientConfigs.length];
  }

  getPhaseLabel(phase: string | undefined): string {
    return this.phaseMeta[phase || 'Inspection']?.label || 'Inspection';
  }

  getPhaseClasses(phase: string | undefined): string {
    const p = this.phaseMeta[phase || 'Inspection'] || this.phaseMeta['Inspection'];
    return `${p.bg} ${p.border} ${p.color}`;
  }

  getPriorityClasses(): string {
    const p = this.priorityMeta['medium'];
    return `${p.bg} ${p.border} ${p.color}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
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

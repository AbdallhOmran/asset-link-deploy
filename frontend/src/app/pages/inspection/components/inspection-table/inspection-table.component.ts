import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  InspectionRecord,
  InspectionStatus,
} from '../../models/inspection.model';

@Component({
  selector: 'app-inspection-table',
  templateUrl: './inspection-table.component.html',
  styleUrls: ['./inspection-table.component.css'],
})
export class InspectionTableComponent {
  @Input() records: InspectionRecord[] | null = [];
  @Input() activeStatusFilter: string = 'all';
  @Input() loading = false;

  @Output() searchChange = new EventEmitter<string>();

  @Output() statusFilterChange =
    new EventEmitter<'all' | InspectionStatus>();

  @Output() typeFilterChange =
    new EventEmitter<'all' | 'before_use' | 'after_return'>();

  @Output() viewDetail = new EventEmitter<InspectionRecord>();
  @Output() deleteRecord = new EventEmitter<InspectionRecord>();

  searchQuery = '';

  activeTypeFilter: 'all' | 'before_use' | 'after_return' = 'all';

  expandedRowId: string | null = null;

  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery);
  }

  onFilterStatus(status: 'all' | InspectionStatus): void {
    this.activeStatusFilter = status;
    this.statusFilterChange.emit(status);
  }

  onFilterType(type: 'all' | 'before_use' | 'after_return'): void {
    this.activeTypeFilter = type;
    this.typeFilterChange.emit(type);
  }

  toggleRowExpand(id: string): void {
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }

  getChecklistItems(checklist: any): { label: string; passed: boolean }[] {
    if (!checklist) return [];

    return [
      { label: 'Brakes', passed: !!checklist.brakes },
      { label: 'Engine', passed: !!checklist.engine },
      { label: 'Body', passed: !!checklist.body },
      { label: 'Tires', passed: !!checklist.tires },
      { label: 'Lights', passed: !!checklist.lights },
    ];
  }

  getScoreColor(score: number): string {
    if (score >= 70) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    }

    if (score >= 40) {
      return 'text-amber-700 bg-amber-50 border-amber-100';
    }

    return 'text-red-700 bg-red-50 border-red-100';
  }

  onDelete(event: Event, record: InspectionRecord): void {
    event.stopPropagation();
    this.deleteRecord.emit(record);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Passed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'Failed':
        return 'bg-red-50 text-red-700 border-red-200';

      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  }

  getStatusDot(status: string): string {
    switch (status) {
      case 'Passed':
        return 'bg-emerald-500';

      case 'Failed':
        return 'bg-red-500';

      default:
        return 'bg-amber-500';
    }
  }

  getInspectionTypeClass(type: string): string {
    return type === 'before_use'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-purple-50 text-purple-700 border-purple-200';
  }

  getInspectionTypeLabel(type: string): string {
    switch (type) {
      case 'before_use':
        return 'Before Rental';

      case 'after_return':
        return 'After Rental';

      default:
        return '-';
    }
  }

  getDamageBadge(record: InspectionRecord): string {
    if (record.inspectionType === 'before_use') {
      return '-';
    }

    if (!record.hasDamage) {
      return 'No Damage';
    }

    switch (record.damageLevel) {
      case 'minor':
        return 'Minor';

      case 'moderate':
        return 'Moderate';

      case 'severe':
        return 'Severe';

      default:
        return 'Unknown';
    }
  }

  getDamageClass(record: InspectionRecord): string {
    if (record.inspectionType === 'before_use') {
      return 'bg-slate-50 text-slate-500 border-slate-200';
    }

    if (!record.hasDamage) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }

    switch (record.damageLevel) {
      case 'minor':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';

      case 'moderate':
        return 'bg-orange-50 text-orange-700 border-orange-200';

      case 'severe':
        return 'bg-red-50 text-red-700 border-red-200';

      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  }
}
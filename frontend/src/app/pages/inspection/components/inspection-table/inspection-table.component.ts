import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InspectionRecord, InspectionStatus } from '../../models/inspection.model';

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
  @Output() statusFilterChange = new EventEmitter<'all' | InspectionStatus>();
  @Output() viewDetail = new EventEmitter<InspectionRecord>();
  @Output() deleteRecord = new EventEmitter<InspectionRecord>();

  searchQuery = '';
  expandedRowId: string | null = null;

  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery);
  }

  onFilterStatus(status: 'all' | InspectionStatus): void {
    this.activeStatusFilter = status;
    this.statusFilterChange.emit(status);
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
    if (score >= 70) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 40) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-red-700 bg-red-50 border-red-100';
  }

  onDelete(event: Event, record: InspectionRecord): void {
    event.stopPropagation();
    this.deleteRecord.emit(record);
  }
}

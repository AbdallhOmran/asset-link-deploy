import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaintenanceRecord, MaintenanceStatusType } from '../../models/maintenance.model';

@Component({
  selector: 'app-maintenance-table',
  templateUrl: './maintenance-table.component.html',
  styleUrls: ['./maintenance-table.component.css'],
})
export class MaintenanceTableComponent {
  @Input() records: MaintenanceRecord[] | null = [];
  @Input() activeStatusFilter: string = 'all';

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<'all' | MaintenanceStatusType>();
  @Output() dateRangeChange = new EventEmitter<{ start: string; end: string }>();
  @Output() statusUpdate = new EventEmitter<{ id: string; status: string }>();
  @Output() deleteRecord = new EventEmitter<MaintenanceRecord>();

  searchQuery = '';
  viewMode: 'table' | 'timeline' = 'table';
  expandedRowId: string | null = null;

  readonly statusOptions = ['Pending', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery);
  }

  onFilterStatus(status: 'all' | MaintenanceStatusType): void {
    this.activeStatusFilter = status;
    this.statusFilterChange.emit(status);
  }

  onDateRangeChange(range: { start: string; end: string }): void {
    this.dateRangeChange.emit(range);
  }

  toggleRowExpand(id: string): void {
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }

  onStatusChange(event: Event, record: MaintenanceRecord): void {
    event.stopPropagation();
    const target = event.target as HTMLSelectElement;
    this.statusUpdate.emit({ id: record.id, status: target.value });
  }

  onDelete(event: Event, record: MaintenanceRecord): void {
    event.stopPropagation();
    this.deleteRecord.emit(record);
  }
}

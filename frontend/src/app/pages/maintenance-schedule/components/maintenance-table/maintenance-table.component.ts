import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaintenanceRecord, MaintenanceStatusType } from '../../models/maintenance.model';

@Component({
  selector: 'app-maintenance-table',
  templateUrl: './maintenance-table.component.html',
  styleUrls: ['./maintenance-table.component.css']
})
export class MaintenanceTableComponent {
  @Input() records: MaintenanceRecord[] | null = [];
  @Input() activeStatusFilter: string = 'all';

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<'all' | MaintenanceStatusType>();

  searchQuery = '';
  viewMode: 'table' | 'timeline' = 'table';
  expandedRowId: string | null = null;

  onSearchInput(): void {
    this.searchChange.emit(this.searchQuery);
  }

  onFilterStatus(status: 'all' | MaintenanceStatusType): void {
    this.activeStatusFilter = status;
    this.statusFilterChange.emit(status);
  }

  toggleRowExpand(id: string): void {
    this.expandedRowId = this.expandedRowId === id ? null : id;
  }
}

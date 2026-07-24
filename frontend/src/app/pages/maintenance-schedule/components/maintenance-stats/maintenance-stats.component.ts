import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaintenanceStats, MaintenanceStatusType } from '../../models/maintenance.model';

@Component({
  selector: 'app-maintenance-stats',
  templateUrl: './maintenance-stats.component.html',
  styleUrls: ['./maintenance-stats.component.css']
})
export class MaintenanceStatsComponent {
  @Input() stats: MaintenanceStats | null = null;
  @Input() activeFilter: 'all' | MaintenanceStatusType = 'all';
  @Output() filterChange = new EventEmitter<'all' | MaintenanceStatusType>();

  onSelectFilter(filter: 'all' | MaintenanceStatusType): void {
    this.filterChange.emit(filter);
  }
}

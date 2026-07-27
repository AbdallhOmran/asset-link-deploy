import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InspectionStats, InspectionStatus } from '../../models/inspection.model';

@Component({
  selector: 'app-inspection-stats',
  templateUrl: './inspection-stats.component.html',
  styleUrls: ['./inspection-stats.component.css'],
})
export class InspectionStatsComponent {
  @Input() stats: InspectionStats | null = null;
  @Input() activeFilter: 'all' | InspectionStatus = 'all';
  @Output() filterChange = new EventEmitter<'all' | InspectionStatus>();

  onSelectFilter(filter: 'all' | InspectionStatus): void {
    this.filterChange.emit(filter);
  }
}

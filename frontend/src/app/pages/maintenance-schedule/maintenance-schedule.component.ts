import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MaintenanceService } from './services/maintenance.service';
import {
  MaintenanceRecord,
  AssetMaintenanceSummary,
  MaintenanceStats,
  MaintenanceStatusType,
  NewMaintenanceRequest
} from './models/maintenance.model';

@Component({
  selector: 'app-maintenance-schedule',
  templateUrl: './maintenance-schedule.component.html',
  styleUrls: ['./maintenance-schedule.component.css']
})
export class MaintenanceScheduleComponent implements OnInit {
  records$: Observable<MaintenanceRecord[]>;
  filteredRecords$: Observable<MaintenanceRecord[]>;
  assets$: Observable<AssetMaintenanceSummary[]>;
  stats$: Observable<MaintenanceStats>;

  isRequestModalOpen = false;
  activeStatusFilter: 'all' | MaintenanceStatusType = 'all';

  constructor(private maintenanceService: MaintenanceService) {
    this.records$ = this.maintenanceService.records$;
    this.filteredRecords$ = this.maintenanceService.filteredRecords$;
    this.assets$ = this.maintenanceService.assets$;
    this.stats$ = this.maintenanceService.stats$;
  }

  ngOnInit(): void {}

  onSearch(query: string): void {
    this.maintenanceService.updateFilters({ searchQuery: query });
  }

  onFilterStatus(status: 'all' | MaintenanceStatusType): void {
    this.activeStatusFilter = status;
    this.maintenanceService.updateFilters({ statusFilter: status });
  }

  openRequestModal(): void {
    this.isRequestModalOpen = true;
  }

  closeRequestModal(): void {
    this.isRequestModalOpen = false;
  }

  handleNewRequest(request: NewMaintenanceRequest): void {
    this.maintenanceService.requestNewMaintenance(request).subscribe(() => {
      // Notification or toast standard logic
    });
  }
}

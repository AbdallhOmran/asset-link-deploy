import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { MaintenanceScheduleRoutingModule } from './maintenance-schedule-routing.module';
import { MaintenanceScheduleComponent } from './maintenance-schedule.component';
import { MaintenanceStatsComponent } from './components/maintenance-stats/maintenance-stats.component';
import { PredictiveAlertsComponent } from './components/predictive-alerts/predictive-alerts.component';
import { MaintenanceTableComponent } from './components/maintenance-table/maintenance-table.component';
import { RequestMaintenanceModalComponent } from './components/request-maintenance-modal/request-maintenance-modal.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

@NgModule({
  declarations: [
    MaintenanceScheduleComponent,
    MaintenanceStatsComponent,
    PredictiveAlertsComponent,
    MaintenanceTableComponent,
    RequestMaintenanceModalComponent,
    StatusBadgeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaintenanceScheduleRoutingModule
  ]
})
export class MaintenanceScheduleModule {}

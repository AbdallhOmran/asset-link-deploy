import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionComponent } from './inspection.component';
import { InspectionStatsComponent } from './components/inspection-stats/inspection-stats.component';
import { InspectionTableComponent } from './components/inspection-table/inspection-table.component';
import { CreateInspectionModalComponent } from './components/create-inspection-modal/create-inspection-modal.component';

@NgModule({
  declarations: [
    InspectionComponent,
    InspectionStatsComponent,
    InspectionTableComponent,
    CreateInspectionModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    InspectionRoutingModule,
  ],
})
export class InspectionModule {}

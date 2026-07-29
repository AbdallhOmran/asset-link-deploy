import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionComponent } from './inspection.component';

const routes: Routes = [
  {
    path: '',
    component: InspectionComponent,
    title: 'Inspection Reports - AssetLink Dashboard',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspectionRoutingModule {}

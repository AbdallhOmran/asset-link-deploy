import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspectionsListComponent } from './components/inspections-list/inspections-list.component';
import { InspectionDetailComponent } from './components/inspection-detail/inspection-detail.component';

const routes: Routes = [
  // تحويل تلقائي لجدول الفحوصات
  { path: '', redirectTo: 'inspections', pathMatch: 'full' },
  
  // صفحة جدول الفحوصات
  { path: 'inspections', component: InspectionsListComponent },
  
  // صفحة تقرير تفاصيل الفحص ومقارنة Before/After
  { path: 'inspections/:id', component: InspectionDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
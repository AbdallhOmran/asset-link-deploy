import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryTrackingComponent } from './pages/delivery-tracking/delivery-tracking.component';

const routes: Routes = [
  {
    path: 'delivery-tracking',
    component: DeliveryTrackingComponent,
  },
  {
    path: '',
    redirectTo: 'delivery-tracking',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'delivery-tracking',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

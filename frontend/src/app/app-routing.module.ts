import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { DeliveryTrackingComponent } from './pages/delivery-tracking/delivery-tracking.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'register', 
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) 
  },
  { 
    path: 'otp', 
    loadChildren: () => import('./pages/otp/otp.module').then(m => m.OtpModule) 
  },
  { 
    path: 'dashboard', 
    component: AssetDashboardComponent 
  },
  {
    path: 'maintenance-schedule',
    loadChildren: () => import('./pages/maintenance-schedule/maintenance-schedule.module').then(m => m.MaintenanceScheduleModule)
  },
  {
    path: 'delivery-tracking',
    component: DeliveryTrackingComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { DeliveryTrackingComponent } from './pages/delivery-tracking/delivery-tracking.component';
import { NegotiationRoomComponent } from './pages/negotiation-room/negotiation-room.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { PaymentsEscrowComponent } from './pages/payments-escrow/payments-escrow.component';

import { DashboardLayoutComponent } from './shared/layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [

  // أول ما يفتح الموقع
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // صفحات الـ Authentication
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(m => m.RegisterModule)
  },

  {
    path: 'otp',
    loadChildren: () =>
      import('./pages/otp/otp.module').then(m => m.OtpModule)
  },

  // جميع صفحات التطبيق
  {
    path: 'app',
    component: DashboardLayoutComponent,

    children: [

      {
        path: 'dashboard',
        component: AssetDashboardComponent
      },

      {
        path: 'company-profile',
        component: CompanyProfileComponent
      },

      {
        path: 'payments-escrow',
        component: PaymentsEscrowComponent
      },

      {
        path: 'bookings',
        component: BookingsComponent
      },

      {
        path: 'contracts',
        component: ContractsComponent
      },

      {
        path: 'delivery-tracking',
        component: DeliveryTrackingComponent
      },

      {
        path: 'negotiation-room',
        component: NegotiationRoomComponent
      },

      {
        path: 'inspections',
        loadChildren: () =>
          import('./pages/inspection/inspection.module')
            .then(m => m.InspectionModule)
      },

      {
        path: 'maintenance-schedule',
        loadChildren: () =>
          import('./pages/maintenance-schedule/maintenance-schedule.module')
            .then(m => m.MaintenanceScheduleModule)
      },

      {
        path: 'assets/add',
        loadChildren: () =>
          import('./pages/add-asset/add-asset.module')
            .then(m => m.AddAssetModule)
      },

      // لو حد دخل /app
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  // أي Route غلط
  {
    path: '**',
    redirectTo: 'login'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
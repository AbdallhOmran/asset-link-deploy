import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InspectionsListComponent } from './components/inspections-list/inspections-list.component';
import { InspectionDetailComponent } from './components/inspection-detail/inspection-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { DeliveryTrackingComponent } from './pages/delivery-tracking/delivery-tracking.component';
import { NegotiationRoomComponent } from './pages/negotiation-room/negotiation-room.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { PaymentsEscrowComponent } from './pages/payments-escrow/payments-escrow.component';
import { EditCompanyProfileComponent } from './pages/edit-company-profile/edit-company-profile.component';
import { DashboardLayoutComponent } from './shared/layout/dashboard-layout/dashboard-layout.component';
import { AssetDetailsComponent } from './pages/asset-details/asset-details.component';
import { SmartMatchesComponent } from './pages/smart-matches/smart-matches.component';
import { AddAssetComponent } from './pages/add-asset/add-asset.component';
import { OrdersComponent } from './pages/orders/orders.component';
const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

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

  {
    path: 'app',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: AssetDashboardComponent
      },
      { path: 'smart-matches', component: SmartMatchesComponent },
      {
        path: 'company-profile',
        component: CompanyProfileComponent
      },
      {
        path: 'edit-company-profile',
        component: EditCompanyProfileComponent
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
  path: 'orders',
  component: OrdersComponent
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
      {
        path: 'assets/edit/:id',
        loadChildren: () =>
          import('./pages/add-asset/add-asset.module')
            .then(m => m.AddAssetModule)
      },
      {
        path: 'assets/category/add',
        loadChildren: () =>
          import('./pages/add-category/add-category.module')
            .then(m => m.AddCategoryModule)
      },

      {
        path: 'assets/details/:id',
        loadChildren: () =>
          import('./pages/asset-details/asset-details.module')
            .then(m => m.AssetDetailsModule)
      },

      { 
        path: 'inspections', 
        component: InspectionsListComponent 
      },
      { 
        path: 'inspections/:id', 
        component: InspectionDetailComponent 
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // {
  //   path: '**',
  //   redirectTo: 'login'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
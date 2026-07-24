import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
// تأكدي من عمل Import للـ LoginComponent لو مش موجود

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
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterShellComponent } from './register-shell/register-shell.component';
import { StepCompanyComponent } from './steps/step-company/step-company.component';
import { StepContactComponent } from './steps/step-contact/step-contact.component';
import { StepAccountComponent } from './steps/step-account/step-account.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterShellComponent,
    children: [
      { path: '', redirectTo: 'step-1', pathMatch: 'full' },
      { path: 'step-1', component: StepCompanyComponent },
      { path: 'step-2', component: StepContactComponent },
      { path: 'step-3', component: StepAccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {}

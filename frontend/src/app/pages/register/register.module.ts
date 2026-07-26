import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterShellComponent } from './register-shell/register-shell.component';
import { StepCompanyComponent } from './steps/step-company/step-company.component';
import { StepContactComponent } from './steps/step-contact/step-contact.component';
import { StepAccountComponent } from './steps/step-account/step-account.component';
import { RegisterStateService } from './register-state.service';

@NgModule({
  declarations: [
    RegisterShellComponent,
    StepCompanyComponent,
    StepContactComponent,
    StepAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RegisterRoutingModule
  ],
  providers: [
    RegisterStateService
  ]
})
export class RegisterModule {}

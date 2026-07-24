import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { OtpPageComponent } from './otp-page/otp-page.component';
import { OtpInputComponent } from './otp-input/otp-input.component';

const routes: Routes = [
  {
    path: '',
    component: OtpPageComponent
  }
];

@NgModule({
  declarations: [
    OtpPageComponent,
    OtpInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class OtpModule {}

import { Component } from '@angular/core';

// Reusable two-column layout: dark branding panel on the left,
// white form area on the right (content projected via <ng-content>)
@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {}
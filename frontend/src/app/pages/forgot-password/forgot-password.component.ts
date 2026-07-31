import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';
  isSent: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email) return;
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isSent = true;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to send reset link';
        this.isLoading = false;
      }
    });
  }

  resend() {
    this.isSent = false;
    this.email = '';
  }
}

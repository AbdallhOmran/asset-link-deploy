import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  companyEmail = '';
  password = '';
  rememberMe = true;
  showPassword = false;

  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.companyEmail, this.password).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.authService.saveSession(res.token, res.company);
        this.router.navigate(['/dashboard']); // TODO: adjust to your real dashboard route
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}
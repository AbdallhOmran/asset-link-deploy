import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  confirm: string = '';
  done: boolean = false;
  token: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  get strength(): number {
    if (this.password.length < 4) return 1;
    if (this.password.length < 7) return 2;
    if (this.password.length < 10) return 3;
    return 4;
  }

  get match(): boolean {
    return this.password.length > 0 && this.confirm.length > 0 && this.password === this.confirm;
  }

  onSubmit() {
    if (!this.match || this.strength < 2) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.done = true;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to reset password';
        this.isLoading = false;
      }
    });
  }
}

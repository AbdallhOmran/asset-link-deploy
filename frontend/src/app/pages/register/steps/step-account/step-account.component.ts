import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterStateService } from '../../register-state.service';

@Component({
  selector: 'app-step-account',
  templateUrl: './step-account.component.html',
  styleUrls: ['./step-account.component.css']
})
export class StepAccountComponent implements OnInit {
  public form!: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerState: RegisterStateService
  ) {}

  ngOnInit(): void {
    const saved = this.registerState.currentData.account;

    this.form = this.fb.group({
      password: [saved.password || '', [Validators.required, Validators.minLength(8)]],
      confirmPassword: [saved.confirmPassword || '', [Validators.required]],
      agreeTerms: [saved.agreeTerms || false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Custom password match validator
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    if (password && confirm && password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Calculate password strength score (1 to 4)
  get passwordStrengthScore(): number {
    const pwd = this.form.get('password')?.value || '';
    if (pwd.length === 0) return 0;
    if (pwd.length < 4) return 1; // Weak
    if (pwd.length < 7) return 2; // Fair
    if (pwd.length < 10) return 3; // Good
    return 4; // Strong
  }

  get passwordStrengthText(): string {
    const score = this.passwordStrengthScore;
    switch (score) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  }

  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  public toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  public onBack(): void {
    this.registerState.updateAccountSetup(this.form.value);
    this.router.navigate(['/register/step-2']);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.registerState.updateAccountSetup(this.form.value);

    // Call service to complete registration, then navigate to OTP verification route
    this.registerState.submitRegistration().subscribe({
      next: (res) => {
        this.isSubmitting = false;
        // Navigate to OTP page for email verification
        this.router.navigate(['/otp']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Registration submit error:', err);
      }
    });
  }
}

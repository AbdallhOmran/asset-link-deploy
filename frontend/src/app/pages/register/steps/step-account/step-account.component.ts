import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterStateService } from '../../register-state.service';

@Component({
  selector: 'app-step-account',
  templateUrl: './step-account.component.html',
  styleUrls: ['./step-account.component.css'],
})
export class StepAccountComponent implements OnInit {
  public form!: FormGroup;
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  public isSubmitting: boolean = false;
  public submitError: string = ''; // ✅ added to surface backend errors to the user

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerState: RegisterStateService
  ) {}

  ngOnInit(): void {
    const saved = this.registerState.currentData.account;

    this.form = this.fb.group(
      {
        // ✅ fixed: matches the backend's actual password rule exactly
        // (auth.controller.js passwordRegex: 8+ chars, upper, lower, digit, special char)
        password: [
          saved.password || '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
            ),
          ],
        ],
        confirmPassword: [saved.confirmPassword || '', [Validators.required]],
        agreeTerms: [saved.agreeTerms || false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;

    if (password && confirm && password !== confirm) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // ✅ fixed: score based on actual character variety, not just length.
  // Each criterion (length, lowercase, uppercase, digit, special char)
  // contributes to the score, matching what the backend actually requires.
  get passwordStrengthScore(): number {
    const pwd = this.form.get('password')?.value || '';
    if (pwd.length === 0) return 0;

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;

    // map 0-5 raw criteria met -> 1-4 display scale
    if (score <= 1) return 1; // Weak
    if (score === 2 || score === 3) return 2; // Fair
    if (score === 4) return 3; // Good
    return 4; // Strong (all 5 criteria met)
  }

  get passwordStrengthText(): string {
    const score = this.passwordStrengthScore;
    switch (score) {
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
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
    this.submitError = '';
    this.registerState.updateAccountSetup(this.form.value);

    this.registerState.submitRegistration().subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/otp']);
      },
      error: (err) => {
        this.isSubmitting = false;
        // ✅ fixed: surface the real backend error message to the user
        // instead of only logging it silently to the console
        this.submitError =
          err.error?.message || 'Something went wrong while creating your account. Please try again.';
      },
    });
  }
}
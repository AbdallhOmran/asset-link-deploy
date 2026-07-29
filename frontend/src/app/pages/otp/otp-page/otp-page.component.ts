import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterStateService } from '../../register/register-state.service';

@Component({
  selector: 'app-otp-page',
  templateUrl: './otp-page.component.html',
  styleUrls: ['./otp-page.component.css']
})
export class OtpPageComponent implements OnInit, OnDestroy {
  public otpCode: string = '';
  public isInvalid: boolean = false;
  public errorMessage: string = '';
  public isLoading: boolean = false;
  public isSuccess: boolean = false;

  // Countdown timer state (60 seconds)
  public countdown: number = 60;
  public canResend: boolean = false;
  private timerRef: any = null;

  public userEmail: string = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private registerState: RegisterStateService
  ) {}

  ngOnInit(): void {
    this.userEmail = this.registerState.getRegisteredEmail();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  public startCountdown(): void {
    this.stopCountdown();
    this.countdown = 60;
    this.canResend = false;

    this.timerRef = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.cdr.markForCheck();
      } else {
        this.canResend = true;
        this.stopCountdown();
        this.cdr.markForCheck();
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  public onCodeChange(code: string): void {
    this.otpCode = code;
    if (this.isInvalid) {
      this.isInvalid = false;
      this.errorMessage = '';
    }
  }

  public onCodeCompleted(code: string): void {
    this.otpCode = code;
    this.verifyOtp();
  }

  public verifyOtp(): void {
    if (this.otpCode.length < 6) {
      this.isInvalid = true;
      this.errorMessage = 'Please enter the complete 6-digit verification code.';
      return;
    }

    this.isLoading = true;
    this.isInvalid = false;
    this.errorMessage = '';

    this.authService.verifyOtp(this.userEmail, this.otpCode).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading = false;
        this.isInvalid = true;
        this.errorMessage = err.error?.message || 'Verification code is invalid or expired. Please try again.';
        this.cdr.markForCheck();
      }
    });
  }

  public resendCode(): void {
    if (!this.canResend || this.isLoading) return;

    this.isLoading = true;

    this.authService.resendOtp(this.userEmail).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.otpCode = '';
        this.isInvalid = false;
        this.errorMessage = '';
        this.startCountdown();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to resend OTP. Please try again.';
        this.isInvalid = true;
        this.cdr.markForCheck();
      }
    });
  }

  public formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}


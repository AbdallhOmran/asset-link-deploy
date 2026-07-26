import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

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

  public userEmail: string = 'marcus.chen@terraequip.com';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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

    // TODO: Replace with actual OTP Verification API call
    setTimeout(() => {
      this.isLoading = false;

      // Mock test validation: if code is '000000', simulate invalid code
      if (this.otpCode === '000000') {
        this.isInvalid = true;
        this.errorMessage = 'Verification code is invalid or expired. Please try again.';
      } else {
        this.isSuccess = true;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1200);
      }
      this.cdr.markForCheck();
    }, 1200);
  }

  public resendCode(): void {
    if (!this.canResend || this.isLoading) return;

    this.isLoading = true;
    // TODO: Replace with actual Resend OTP API call
    setTimeout(() => {
      this.isLoading = false;
      this.otpCode = '';
      this.isInvalid = false;
      this.errorMessage = '';
      this.startCountdown();
      this.cdr.markForCheck();
    }, 800);
  }

  public formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}

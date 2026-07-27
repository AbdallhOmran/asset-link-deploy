import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

// renamed from 'StepperStep' to avoid confusion with the shared StepperComponent's own StepperStep interface
export interface RegisterStep {
  id: number;
  label: string;
}

@Component({
  selector: 'app-register-shell',
  templateUrl: './register-shell.component.html',
  styleUrls: ['./register-shell.component.css'],
})
export class RegisterShellComponent implements OnInit, OnDestroy {
  public steps: RegisterStep[] = [
    { id: 1, label: 'Company Info' },
    { id: 2, label: 'Contact Details' },
    { id: 3, label: 'Account Setup' },
  ];

  public currentStep: number = 1; // 1-based, matches step-1/step-2/step-3 routes
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCurrentStep(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateCurrentStep(event.urlAfterRedirects || event.url);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private updateCurrentStep(url: string): void {
    if (url.includes('step-3')) {
      this.currentStep = 3;
    } else if (url.includes('step-2')) {
      this.currentStep = 2;
    } else {
      this.currentStep = 1;
    }
  }

  // ✅ fixed: shared app-stepper expects a 0-based index, but currentStep here is 1-based
  get stepperIndex(): number {
    return this.currentStep - 1;
  }

  public navigateToStep(stepId: number): void {
    if (stepId < this.currentStep) {
      this.router.navigate([`/register/step-${stepId}`]);
    }
  }
}
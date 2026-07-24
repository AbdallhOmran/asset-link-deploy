import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

export interface StepperStep {
  id: number;
  label: string;
}

@Component({
  selector: 'app-register-shell',
  templateUrl: './register-shell.component.html',
  styleUrls: ['./register-shell.component.css']
})
export class RegisterShellComponent implements OnInit, OnDestroy {
  public steps: StepperStep[] = [
    { id: 1, label: 'Company Info' },
    { id: 2, label: 'Contact Details' },
    { id: 3, label: 'Account Setup' }
  ];

  public currentStep: number = 1;
  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateCurrentStep(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
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

  public navigateToStep(stepId: number): void {
    // Only allow navigating back to previously visited steps
    if (stepId < this.currentStep) {
      this.router.navigate([`/register/step-${stepId}`]);
    }
  }
}

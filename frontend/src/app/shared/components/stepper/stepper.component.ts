import { Component, Input } from '@angular/core';

export type StepStatus = 'completed' | 'active' | 'upcoming';

export interface StepperStep {
  label: string;
  subLabel?: string;
  icon?: string;
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
})
export class StepperComponent {
  @Input() steps: StepperStep[] = [];
  @Input() currentStep = 0;

  getStatus(index: number): StepStatus {
    if (index < this.currentStep) return 'completed';
    if (index === this.currentStep) return 'active';
    return 'upcoming';
  }

  isLineCompleted(index: number): boolean {
    return index < this.currentStep;
  }

  getStepIcon(index: number): string {
    if (this.steps[index]?.icon) {
      return this.steps[index].icon!;
    }

    switch (index) {
      case 0:
        return '⬚'; // Package
      case 1:
        return '⛟'; // Truck
      case 2:
        return '⌖'; // Location
      case 3:
        return '✓'; // Delivered
      default:
        return '•';
    }
  }
}

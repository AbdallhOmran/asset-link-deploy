import { Component, Input } from '@angular/core';

// Matches the "Delivery Progress" horizontal circular stepper:
// - completed: solid blue circle + white icon, connecting line before/after is blue
// - active: white circle with thick blue border + ring glow, blue icon
// - upcoming: white circle with gray border, gray icon
export type StepStatus = 'completed' | 'active' | 'upcoming';

export interface StepperStep {
  label: string;
  subLabel?: string; // e.g. date "Jul 10 · 8:00 AM" or status "In progress..."
  icon?: string; // placeholder emoji/symbol - swap with real icon component later
}

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
})
export class StepperComponent {
  @Input() steps: StepperStep[] = [];
  @Input() currentStep = 0; // index-based (0 = first step)

  getStatus(index: number): StepStatus {
    if (index < this.currentStep) return 'completed';
    if (index === this.currentStep) return 'active';
    return 'upcoming';
  }

  // Line segment AFTER step `index` (connecting it to the next step) is blue
  // only if this step has already been completed.
  isLineCompleted(index: number): boolean {
    return index < this.currentStep;
  }
}
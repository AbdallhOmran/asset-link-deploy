import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pricing-section',
  templateUrl: './pricing-section.component.html',
})
export class PricingSectionComponent {
  @Input() form!: FormGroup;

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}

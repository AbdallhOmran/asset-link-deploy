import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-specs-section',
  templateUrl: './specs-section.component.html',
})
export class SpecsSectionComponent {
  @Input() form!: FormGroup;
}

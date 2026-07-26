import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-location-section',
  templateUrl: './location-section.component.html',
})
export class LocationSectionComponent {
  @Input() form!: FormGroup;
}

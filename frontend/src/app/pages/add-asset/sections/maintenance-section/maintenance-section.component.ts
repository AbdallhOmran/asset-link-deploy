import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-maintenance-section',
  templateUrl: './maintenance-section.component.html',
})
export class MaintenanceSectionComponent {
  @Input() form!: FormGroup;

  maintenanceStatuses = [
    'Current — all services up to date',
    'Due Soon — service within 30 days',
    'Overdue — immediate service required',
  ];

  complianceDocs = [
    { label: 'Annual Safety Inspection Certificate', key: 'safetyCert' },
    { label: 'OSHA Compliance Certificate', key: 'oshaCert' },
    { label: 'Equipment Insurance Certificate', key: 'insuranceCert' },
  ];

  /** Receives output from shared app-date-range-picker and patches the form */
  onDateRangeChange(range: { start: string; end: string }): void {
    this.form.patchValue({
      lastMaintenanceDate: range.start,
      nextServiceDue: range.end,
    });
  }
}

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetMaintenanceSummary, NewMaintenanceRequest } from '../../models/maintenance.model';

@Component({
  selector: 'app-request-maintenance-modal',
  templateUrl: './request-maintenance-modal.component.html',
  styleUrls: ['./request-maintenance-modal.component.css']
})
export class RequestMaintenanceModalComponent implements OnInit {
  @Input() assets: AssetMaintenanceSummary[] = [];
  @Input() isOpen = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<NewMaintenanceRequest>();

  maintenanceForm!: FormGroup;
  isSubmitting = false;

  readonly maintenanceTypes = [
    'Scheduled Service',
    'Engine Service',
    'Hydraulic Overhaul',
    'Safety & Compliance Inspection',
    'Undercarriage & Track Replacement',
    'Electrical & Diagnostics',
    'Emergency Repair'
  ];

  readonly technicians = [
    'Jake Morrison (Lead Hydraulic Specialist)',
    'Maria Santos (Senior Heavy Diesel Mechanic)',
    'Tom Becker (Undercarriage & Safety Inspector)',
    'Sarah Jenkins (Electrical & Telematics Tech)',
    'External Certified Vendor'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.maintenanceForm = this.fb.group({
      assetId: ['', [Validators.required]],
      maintenanceType: ['Scheduled Service', [Validators.required]],
      scheduledDate: [today, [Validators.required]],
      technician: ['', [Validators.required]],
      priority: ['medium', [Validators.required]],
      estimatedHours: [8, [Validators.required, Validators.min(1)]],
      notes: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.maintenanceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.maintenanceForm.value;

    const selectedAsset = this.assets.find(a => a.assetId === formValues.assetId);

    const requestPayload: NewMaintenanceRequest = {
      assetId: formValues.assetId,
      assetName: selectedAsset?.assetName,
      maintenanceType: formValues.maintenanceType,
      scheduledDate: formValues.scheduledDate,
      technician: formValues.technician,
      priority: formValues.priority,
      estimatedHours: formValues.estimatedHours,
      notes: formValues.notes
    };

    setTimeout(() => {
      this.submitRequest.emit(requestPayload);
      this.isSubmitting = false;
      this.closeModal();
    }, 400);
  }

  closeModal(): void {
    this.maintenanceForm.reset({
      maintenanceType: 'Scheduled Service',
      priority: 'medium',
      estimatedHours: 8
    });
    this.close.emit();
  }
}

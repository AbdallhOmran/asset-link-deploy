import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetMaintenanceSummary, NewMaintenanceRequest } from '../../models/maintenance.model';

@Component({
  selector: 'app-request-maintenance-modal',
  templateUrl: './request-maintenance-modal.component.html',
  styleUrls: ['./request-maintenance-modal.component.css'],
})
export class RequestMaintenanceModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() assets: AssetMaintenanceSummary[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<NewMaintenanceRequest>();

  maintenanceForm: FormGroup;
  isSubmitting = false;
  saved = false;

  selectedType = 'Routine';
  selectedPriority: 'high' | 'medium' | 'low' = 'medium';

  maintTypes = [
    { key: 'Routine',       icon: 'clipboard-list', color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100' },
    { key: 'Preventive',    icon: 'shield-check',   color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-100' },
    { key: 'Emergency',     icon: 'alert-triangle', color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-100' },
    { key: 'Corrective',    icon: 'hammer',         color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100' },
    { key: 'Certification', icon: 'badge-check',    color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  technicians = ['Carlos Rivera', 'Dana Park', 'External — NW Cert', 'External — SureTech'];

  constructor(private fb: FormBuilder) {
    this.maintenanceForm = this.fb.group({
      assetId: ['', Validators.required],
      notes: ['', [Validators.required, Validators.minLength(10)]],
      scheduledDate: ['', Validators.required],
      technician: [''],
      estimatedCost: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && !this.isOpen) {
      this.resetForm();
    }
  }

  get selectedAsset(): AssetMaintenanceSummary | undefined {
    return this.assets.find((a) => a.assetId === this.maintenanceForm.value.assetId);
  }

  get canSubmit(): boolean {
    return this.maintenanceForm.valid && !!this.maintenanceForm.value.estimatedCost;
  }

  selectType(type: string): void {
    this.selectedType = type;
  }

  selectPriority(p: 'high' | 'medium' | 'low'): void {
    this.selectedPriority = p;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.maintenanceForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (!this.canSubmit) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.maintenanceForm.value;

    const request: NewMaintenanceRequest = {
      assetId: formVal.assetId,
      maintenanceType: this.selectedType,
      scheduledDate: formVal.scheduledDate,
      technician: formVal.technician || 'Unassigned',
      priority: this.selectedPriority,
      notes: formVal.notes,
      estimatedHours: formVal.estimatedCost ? Math.ceil(formVal.estimatedCost / 120) : undefined,
    };

    this.submitRequest.emit(request);
    this.isSubmitting = false;
    this.saved = true;
  }

  logAnother(): void {
    this.maintenanceForm.reset();
    this.selectedType = 'Routine';
    this.selectedPriority = 'medium';
    this.saved = false;
  }

  closeModal(): void {
    this.resetForm();
    this.close.emit();
  }

  private resetForm(): void {
    this.maintenanceForm.reset();
    this.selectedType = 'Routine';
    this.selectedPriority = 'medium';
    this.isSubmitting = false;
    this.saved = false;
  }
}

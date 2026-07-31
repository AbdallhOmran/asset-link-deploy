import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateInspectionPayload } from '../../models/inspection.model';

@Component({
  selector: 'app-create-inspection-modal',
  templateUrl: './create-inspection-modal.component.html',
  styleUrls: ['./create-inspection-modal.component.css'],
})
export class CreateInspectionModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() assets: any[] = [];
  @Input() bookings: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submitInspection = new EventEmitter<CreateInspectionPayload>();

  inspectionForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.inspectionForm = this.fb.group({
      bookingId: ['', [Validators.required]],
      assetId: ['', [Validators.required]],
      inspectorName: ['', [Validators.required, Validators.minLength(2)]],
      taxRegister: [''],
      commercialRegister: [''],
      conditionScore: [80, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['Passed', [Validators.required]],
      notes: ['', [Validators.minLength(3)]],
      photos: [''],
      // Checklist
      brakes: [false],
      engine: [false],
      body: [false],
      tires: [false],
      lights: [false],
    });
  }

  get filteredBookings(): any[] {
    // Show only confirmed bookings (that need inspection)
    return (this.bookings || []).filter(
      (b: any) => b.status === 'Confirmed' || b.status === 'Pending'
    );
  }

  onBookingChange(): void {
    const bookingId = this.inspectionForm.get('bookingId')?.value;
    const booking = this.bookings.find((b: any) => b._id === bookingId);
    if (booking && booking.assetId) {
      const assetId = typeof booking.assetId === 'object' ? booking.assetId._id : booking.assetId;
      this.inspectionForm.patchValue({ assetId });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.inspectionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.inspectionForm.invalid) {
      this.inspectionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValues = this.inspectionForm.value;

    const photosArray = formValues.photos
      ? formValues.photos.split(',').map((p: string) => p.trim()).filter((p: string) => p)
      : [];

    const payload: CreateInspectionPayload = {
      bookingId: formValues.bookingId,
      assetId: formValues.assetId,
      inspectorName: formValues.inspectorName,
      taxRegister: formValues.taxRegister,
      commercialRegister: formValues.commercialRegister,
      conditionScore: formValues.conditionScore,
      status: formValues.status,
      notes: formValues.notes || '',
      photos: photosArray,
      checklist: {
        brakes: formValues.brakes,
        engine: formValues.engine,
        body: formValues.body,
        tires: formValues.tires,
        lights: formValues.lights,
      },
    };

    setTimeout(() => {
      this.submitInspection.emit(payload);
      this.isSubmitting = false;
      this.closeModal();
    }, 300);
  }

  closeModal(): void {
    this.inspectionForm.reset({
      conditionScore: 80,
      status: 'Passed',
      taxRegister: '',
      commercialRegister: '',
      brakes: false,
      engine: false,
      body: false,
      tires: false,
      lights: false,
    });
    this.close.emit();
  }
}

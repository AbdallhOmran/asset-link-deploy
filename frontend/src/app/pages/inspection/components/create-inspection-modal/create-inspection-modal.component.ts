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

  inspectionTypes = [
    { value: 'before_use', label: 'Before Rental' },
    { value: 'after_return', label: 'After Rental' },
  ];

  damageLevels = ['none', 'minor', 'moderate', 'severe'];

  statuses = ['Pending', 'Passed', 'Failed'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.inspectionForm = this.fb.group({
      bookingId: ['', Validators.required],
      assetId: ['', Validators.required],

      inspectorName: ['', [Validators.required, Validators.minLength(2)]],

      taxRegister: [''],
      commercialRegister: [''],

      inspectionType: ['before_use', Validators.required],

      conditionScore: [
        80,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ],
      ],

      status: ['Pending', Validators.required],

      hasDamage: [false],
      damageLevel: ['none'],
      damageCost: [0],

      notes: ['', Validators.minLength(3)],
      photos: [''],

      brakes: [false],
      engine: [false],
      body: [false],
      tires: [false],
      lights: [false],
    });

    this.inspectionForm
      .get('inspectionType')
      ?.valueChanges.subscribe(() => {
        this.onInspectionTypeChange();
      });
  }

  get filteredBookings(): any[] {
    const type = this.inspectionForm?.get('inspectionType')?.value;

    if (type === 'before_use') {
      return (this.bookings || []).filter(
        (b: any) => b.status === 'Confirmed'
      );
    }

    return (this.bookings || []).filter(
      (b: any) => b.status === 'Completed'
    );
  }

  onBookingChange(): void {
    const bookingId = this.inspectionForm.get('bookingId')?.value;

    const booking = this.bookings.find(
      (b: any) => b._id === bookingId
    );

    if (!booking) return;

    const assetId =
      typeof booking.assetId === 'object'
        ? booking.assetId._id
        : booking.assetId;

    this.inspectionForm.patchValue({
      assetId,
    });
  }

  onInspectionTypeChange(): void {
    const type = this.inspectionForm.get('inspectionType')?.value;

    // reset selected booking and asset when changing inspection type
    this.inspectionForm.patchValue({
      bookingId: '',
      assetId: '',
    });

    if (type === 'before_use') {
      this.inspectionForm.patchValue({
        hasDamage: false,
        damageLevel: 'none',
        damageCost: 0,
      });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.inspectionForm.get(fieldName);

    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched)
    );
  }

  onSubmit(): void {
    console.log("Submit Clicked");
    console.log(this.inspectionForm.valid);
console.log(this.inspectionForm.status);

Object.keys(this.inspectionForm.controls).forEach(key => {
  const control = this.inspectionForm.get(key);

  if (control?.invalid) {
    console.log(key, control.errors);
  }
});
    if (this.inspectionForm.invalid) {
      this.inspectionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValues = this.inspectionForm.value;

    const photosArray = formValues.photos
      ? formValues.photos
          .split(',')
          .map((p: string) => p.trim())
          .filter((p: string) => p)
      : [];

    const payload: CreateInspectionPayload = {
      bookingId: formValues.bookingId,
      assetId: formValues.assetId,

      inspectorName: formValues.inspectorName,

      taxRegister: formValues.taxRegister,
      commercialRegister: formValues.commercialRegister,

      inspectionType: formValues.inspectionType,

      conditionScore: formValues.conditionScore,

      status: formValues.status,

      hasDamage: formValues.hasDamage,
      damageLevel: formValues.damageLevel,
      damageCost: formValues.damageCost,

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
      bookingId: '',
      assetId: '',

      inspectorName: '',

      taxRegister: '',
      commercialRegister: '',

      inspectionType: 'before_use',

      conditionScore: 80,

      status: 'Pending',

      hasDamage: false,
      damageLevel: 'none',
      damageCost: 0,

      notes: '',
      photos: '',

      brakes: false,
      engine: false,
      body: false,
      tires: false,
      lights: false,
    });

    this.close.emit();
  }
}
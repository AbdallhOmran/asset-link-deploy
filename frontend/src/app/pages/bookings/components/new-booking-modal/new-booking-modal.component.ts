import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { AssetService } from '../../../../services/asset.service';
import { AuthService } from '../../../../services/auth.service';

type PriceType = 'Daily' | 'Weekly' | 'Monthly';

@Component({
  selector: 'app-new-booking-modal',
  templateUrl: './new-booking-modal.component.html',
})
export class NewBookingModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() preselectedAssetId?: string;
  @Output() closed = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<any>();

  currentStep = 0; // 0=Dates, 1=Renter
  isSubmitting = false;
  errorMessage = '';

  // Asset info
  selectedAsset: any = null;

  // Step 0: Dates + price type
  startDate = '';
  endDate = '';
  priceType: PriceType = 'Daily'; // matches booking.model.js priceType enum
  minDate = ''; // used as [min] on the date inputs to block past dates

  // Step 1: Renter/notes
  notes = '';

  constructor(
    private bookingService: BookingService,
    private assetService: AssetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // today's date in yyyy-MM-dd, used as the min attribute on date inputs
    this.minDate = new Date().toISOString().split('T')[0];
  }

  ngOnChanges(changes: any): void {
    if (changes.isOpen || changes.preselectedAssetId) {
      if (this.isOpen) {
        this.fetchAssetDetails();
      } else {
        this.resetForm();
      }
    }
  }

  fetchAssetDetails() {
    if (!this.preselectedAssetId) return;

    this.assetService.getAssetDetails(this.preselectedAssetId).subscribe({
      next: (res: any) => {
        this.selectedAsset = res?.data ?? res;
        // default to the first pricing plan actually available on this asset
        this.priceType = this.availablePriceTypes[0]?.value || 'Daily';
      },
      error: () => {
        this.errorMessage = 'Failed to load asset details.';
        this.selectedAsset = null;
      },
    });
  }

  // which price options actually exist on this asset (matches asset.model.js: price = { daily, weekly, monthly })
  get availablePriceTypes(): { value: PriceType; label: string; rate: number }[] {
    if (!this.selectedAsset?.price) return [];
    const options: { value: PriceType; label: string; rate: number }[] = [];
    if (this.selectedAsset.price.daily) {
      options.push({ value: 'Daily', label: 'Daily', rate: this.selectedAsset.price.daily });
    }
    if (this.selectedAsset.price.weekly) {
      options.push({ value: 'Weekly', label: 'Weekly', rate: this.selectedAsset.price.weekly });
    }
    if (this.selectedAsset.price.monthly) {
      options.push({ value: 'Monthly', label: 'Monthly', rate: this.selectedAsset.price.monthly });
    }
    return options;
  }

  get selectedRate(): number {
    const option = this.availablePriceTypes.find((o) => o.value === this.priceType);
    return option?.rate || 0;
  }

  get rentalDays(): number {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  }

  // number of billing units (days/weeks/months) based on priceType,
  // so the total is computed correctly regardless of which plan is chosen
  get billingUnits(): number {
    if (this.rentalDays === 0) return 0;
    if (this.priceType === 'Daily') return this.rentalDays;
    if (this.priceType === 'Weekly') return Math.ceil(this.rentalDays / 7);
    return Math.ceil(this.rentalDays / 30); // Monthly
  }

  get estimatedTotal(): number {
    return this.billingUnits * this.selectedRate;
  }

  nextStep() {
    this.errorMessage = '';

    if (this.currentStep === 0) {
      if (!this.startDate || !this.endDate) {
        this.errorMessage = 'Please select both start and end dates.';
        return;
      }
      // extra safety check even though the inputs already have [min]
      if (this.startDate < this.minDate) {
        this.errorMessage = 'Start date cannot be in the past.';
        return;
      }
      if (this.rentalDays <= 0) {
        this.errorMessage = 'End date must be after start date.';
        return;
      }
      if (!this.selectedAsset) {
        this.errorMessage = 'Asset information is missing.';
        return;
      }
      this.currentStep = 1;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onCancel() {
    this.resetForm();
    this.closed.emit();
  }

  onCreate() {
    this.errorMessage = '';

    if (!this.selectedAsset) {
      this.errorMessage = 'No asset selected.';
      return;
    }

    if (this.rentalDays <= 0) {
      this.errorMessage = 'Invalid date range.';
      return;
    }

    const loggedInCompany = this.authService.getCompany();
    if (!loggedInCompany?.id) {
      this.errorMessage = 'Session expired. Please log in again.';
      return;
    }

    const bookingData = {
      assetId: this.selectedAsset._id,
      companyId: loggedInCompany.id,
      ownerCompanyId: this.selectedAsset.companyId?._id || this.selectedAsset.companyId,
      startDate: this.startDate,
      endDate: this.endDate,
      priceType: this.priceType, // now uses the actually selected plan
      totalPrice: this.estimatedTotal,
      notes: this.notes,
    };

    this.isSubmitting = true;
    this.bookingService.createBooking(bookingData).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.bookingCreated.emit(res.booking);
        this.resetForm();
        this.closed.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.error || err.error?.message || 'Failed to create booking. Please try again.';
      },
    });
  }

  resetForm() {
    this.currentStep = 0;
    this.selectedAsset = null;
    this.startDate = '';
    this.endDate = '';
    this.priceType = 'Daily';
    this.notes = '';
    this.errorMessage = '';
  }
}
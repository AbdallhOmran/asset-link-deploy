import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { AssetService } from '../../../../services/asset.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-new-booking-modal',
  templateUrl: './new-booking-modal.component.html',
})
export class NewBookingModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() preselectedAssetId?: string;
  @Output() closed = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<any>();

  currentStep = 0; // 0=Dates, 1=Renter
  isSubmitting = false;
  errorMessage = '';

  // Asset Info
  assets: any[] = [];
  selectedAsset: any = null;

  // Step 0: Dates
  startDate = '';
  endDate = '';

  // Step 1: Renter
  notes = '';

  constructor(
    private bookingService: BookingService,
    private assetService: AssetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

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
        // Handle both possible wrapper structures based on API response
        this.selectedAsset = res?.data ?? res;
      },
      error: () => {
        this.errorMessage = 'Failed to load asset details.';
        this.selectedAsset = null;
      }
    });
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

  get dailyRate(): number {
    if (!this.selectedAsset || !this.selectedAsset.price) return 0;
    return this.selectedAsset.price.daily || 0;
  }

  get estimatedTotal(): number {
    return this.rentalDays * this.dailyRate;
  }

  nextStep() {
    this.errorMessage = '';

    if (this.currentStep === 0) {
      if (!this.startDate || !this.endDate) {
        this.errorMessage = 'Please select both start and end dates.';
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
      priceType: 'Daily',
      totalPrice: this.estimatedTotal,
      notes: this.notes,
    };

    this.isSubmitting = true;
    this.bookingService.createBooking(bookingData).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        // Optionally show success toast here
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
    this.notes = '';
    this.errorMessage = '';
  }
}
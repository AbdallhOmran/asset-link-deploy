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
  @Output() closed = new EventEmitter<void>();
  @Output() bookingCreated = new EventEmitter<any>();

  currentStep = 0; // 0=Asset, 1=Dates, 2=Renter
  isSubmitting = false;
  errorMessage = '';

  // Step 1: Asset
  assets: any[] = [];
  assetSearchTerm = '';
  selectedAsset: any = null;

  // Step 2: Dates
  startDate = '';
  endDate = '';

  // Step 3: Renter (booking notes; renter company itself comes from logged-in session)
  notes = '';

  constructor(
    private bookingService: BookingService,
    private assetService: AssetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets() {
    this.assetService.getAssets().subscribe({
      next: (res: any) => {
        this.assets = (res || []).filter((a: any) => a.status === 'Available');
      },
      error: () => {
        this.assets = [];
      },
    });
  }

  get filteredAssets() {
    const term = this.assetSearchTerm.trim().toLowerCase();
    if (!term) return this.assets;
    return this.assets.filter((a) => a.assetName?.toLowerCase().includes(term));
  }

  get rentalDays(): number {
    if (!this.startDate || !this.endDate) return 0;
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  get dailyRate(): number {
    return this.selectedAsset?.price?.daily || 0;
  }

  get estimatedTotal(): number {
    return this.rentalDays * this.dailyRate;
  }

  selectAsset(asset: any) {
    this.selectedAsset = asset;
  }

  nextStep() {
    this.errorMessage = '';

    if (this.currentStep === 0 && !this.selectedAsset) {
      this.errorMessage = 'Please select an asset to continue';
      return;
    }
    if (this.currentStep === 1 && (!this.startDate || !this.endDate)) {
      this.errorMessage = 'Please select both start and end dates';
      return;
    }

    if (this.currentStep < 2) this.currentStep++;
  }

  prevStep() {
    this.errorMessage = '';
    if (this.currentStep > 0) this.currentStep--;
  }

  onCancel() {
    this.resetForm();
    this.closed.emit();
  }

  onCreate() {
    this.errorMessage = '';

    const loggedInCompany = this.authService.getCompany();
    if (!loggedInCompany?.id) {
      this.errorMessage = 'Session expired. Please log in again.';
      return;
    }

    // matches booking.service.js createBooking required fields
    const payload = {
      assetId: this.selectedAsset._id,
      companyId: loggedInCompany.id, // renter = currently logged-in company
      ownerCompanyId: this.selectedAsset.companyId, // asset owner
      startDate: this.startDate,
      endDate: this.endDate,
      priceType: 'Daily',
      totalPrice: this.estimatedTotal,
      notes: this.notes,
    };

    this.isSubmitting = true;
    this.bookingService.createBooking(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.bookingCreated.emit(res);
        this.resetForm();
        this.closed.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Failed to create booking';
      },
    });
  }

  resetForm() {
    this.currentStep = 0;
    this.selectedAsset = null;
    this.assetSearchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.notes = '';
    this.errorMessage = '';
  }
}
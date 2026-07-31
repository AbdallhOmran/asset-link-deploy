import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../../services/booking.service';
import { AssetService } from '../../../../services/asset.service';
import { AuthService } from '../../../../services/auth.service';
import { WaitingListService, WaitingListDTO } from '../../../../services/waiting-list.service';

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

  currentStep = 0;
  isSubmitting = false;
  errorMessage = '';

  selectedAsset: any = null;
  waitlistCount = 0;
  notifyVia: 'email' | 'sms' | 'both' = 'email';
  isOwner = false;

  startDate = '';
  endDate = '';
  priceType: PriceType = 'Daily';
  minDate = '';

  notes = '';

  constructor(
    private bookingService: BookingService,
    private assetService: AssetService,
    private authService: AuthService,
    private waitingListService: WaitingListService
  ) {}

  ngOnInit(): void {
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

        const loggedInCompany = this.authService.getCompany();
        const assetOwnerId = this.selectedAsset?.companyId?._id || this.selectedAsset?.companyId;

        // Guard: block booking your own company's assets
        if (loggedInCompany?.id && assetOwnerId && loggedInCompany.id === assetOwnerId) {
          this.errorMessage = "You cannot book your own company's equipment.";
          this.selectedAsset = null;
          this.isOwner = true;
          return;
        } else {
          this.isOwner = false;
        }

        this.priceType = this.availablePriceTypes[0]?.value || 'Daily';

        if (this.isWaitlistMode) {
          this.waitingListService.getWaitingListByAsset(this.selectedAsset._id).subscribe({
            next: (wl) => {
              this.waitlistCount = wl.length;
            },
          });
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load asset details.';
        this.selectedAsset = null;
      },
    });
  }

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

  get billingUnits(): number {
    if (this.rentalDays === 0) return 0;
    if (this.priceType === 'Daily') return this.rentalDays;
    if (this.priceType === 'Weekly') return Math.ceil(this.rentalDays / 7);
    return Math.ceil(this.rentalDays / 30);
  }

  get estimatedTotal(): number {
    return this.billingUnits * this.selectedRate;
  }

  get isWaitlistMode(): boolean {
    return this.selectedAsset?.status === 'Booked' || this.selectedAsset?.status === 'Rented';
  }

  // Minimum rental days required for the currently selected pricing plan
  get minRequiredDays(): number {
    if (this.priceType === 'Weekly') return 7;
    if (this.priceType === 'Monthly') return 30;
    return 1; // Daily has no extra minimum beyond 1 day
  }

  get queueItems(): any[] {
    const total = this.waitlistCount + 1;
    const items = [];
    const maxVisible = 8;

    for (let i = 1; i <= maxVisible; i++) {
      if (i === total) {
        items.push({ label: 'You', isYou: true, isActive: true });
      } else if (i < total) {
        items.push({ label: i.toString(), isYou: false, isActive: true });
      } else {
        items.push({ label: i.toString(), isYou: false, isActive: false });
      }
    }
    return items;
  }

  setNotifyVia(method: 'email' | 'sms' | 'both') {
    this.notifyVia = method;
  }

  nextStep() {
    this.errorMessage = '';

    const loggedInCompany = this.authService.getCompany();
    const ownerId = this.selectedAsset?.companyId?._id || this.selectedAsset?.companyId;

    if (loggedInCompany?.id === ownerId) {
      this.errorMessage = "You cannot book your own company's equipment.";
      return;
    }

    if (this.currentStep === 0) {
      if (!this.startDate || !this.endDate) {
        this.errorMessage = 'Please select both start and end dates.';
        return;
      }
      if (this.startDate < this.minDate) {
        this.errorMessage = 'Start date cannot be in the past.';
        return;
      }
      if (this.rentalDays <= 0) {
        this.errorMessage = 'End date must be after start date.';
        return;
      }

      // Enforce minimum duration based on the selected pricing plan
      if (this.rentalDays < this.minRequiredDays) {
        if (this.priceType === 'Weekly') {
          this.errorMessage = 'Weekly plan requires a rental period of at least 7 days.';
        } else if (this.priceType === 'Monthly') {
          this.errorMessage = 'Monthly plan requires a rental period of at least 30 days.';
        }
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

    const loggedInCompany = this.authService.getCompany();
    const ownerId = this.selectedAsset?.companyId?._id || this.selectedAsset?.companyId;

    if (!loggedInCompany?.id) {
      this.errorMessage = 'Session expired. Please log in again.';
      return;
    }

    if (!this.selectedAsset) {
      this.errorMessage = 'No asset selected.';
      return;
    }

    if (loggedInCompany.id === ownerId) {
      this.errorMessage = "You cannot book your own company's equipment.";
      return;
    }

    if (this.rentalDays <= 0) {
      this.errorMessage = 'Invalid date range.';
      return;
    }

    // Re-check minimum duration before final submit (not applicable to waitlist)
    if (!this.isWaitlistMode && this.rentalDays < this.minRequiredDays) {
      if (this.priceType === 'Weekly') {
        this.errorMessage = 'Weekly plan requires a rental period of at least 7 days.';
      } else if (this.priceType === 'Monthly') {
        this.errorMessage = 'Monthly plan requires a rental period of at least 30 days.';
      }
      return;
    }

    if (this.isWaitlistMode) {
      const waitlistData: WaitingListDTO = {
        assetId: this.selectedAsset._id,
        companyId: loggedInCompany.id,
        requestedStartDate: this.startDate,
        requestedEndDate: this.endDate,
      };

      this.isSubmitting = true;
      this.waitingListService.joinWaitingList(waitlistData).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.bookingCreated.emit(res);
          this.resetForm();
          this.closed.emit();
        },
        error: (err) => {
          this.isSubmitting = false;
          const backendErr = err.error;
          this.errorMessage =
            typeof backendErr === 'string'
              ? backendErr
              : backendErr?.error || backendErr?.message || 'Failed to join waitlist. Please try again.';
        },
      });
      return;
    }

    const bookingData = {
      assetId: this.selectedAsset._id,
      companyId: loggedInCompany.id,
      ownerCompanyId: ownerId,
      startDate: this.startDate,
      endDate: this.endDate,
      priceType: this.priceType,
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

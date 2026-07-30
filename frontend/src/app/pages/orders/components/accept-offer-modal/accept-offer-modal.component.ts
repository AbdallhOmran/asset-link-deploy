import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NegotiationService, VersionData } from '../../../../services/negotiation.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-accept-offer-modal',
  templateUrl: './accept-offer-modal.component.html',
})
export class AcceptOfferModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() order: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() negotiationStarted = new EventEmitter<void>();

  isSubmitting = false;
  errorMessage = '';

  // Initial offer terms — prefilled from the booking, editable by the owner before sending
  rentPrice = 0;
  securityDeposit = 0;
  rentalDuration = 0;
  durationUnit: 'Day' | 'Week' | 'Month' = 'Day'; // matches version.model.js enum exactly
  notes = '';

  constructor(
    private negotiationService: NegotiationService,
    private authService: AuthService
  ) {}

  ngOnChanges(): void {
    if (this.isOpen && this.order) {
      this.prefillFromOrder();
    }
  }

  private prefillFromOrder(): void {
    this.errorMessage = '';
    this.rentPrice = this.order.totalPrice || 0;
    // securityDeposit isn't stored on the booking itself; the owner sets it here
    this.securityDeposit = 0;
    this.rentalDuration = this.calculateDays(this.order.startDate, this.order.endDate);
    this.durationUnit = this.mapPriceTypeToDurationUnit(this.order.priceType);
    this.notes = '';
  }

  // booking.priceType uses Daily/Weekly/Monthly, but version.model.js expects Day/Week/Month
  private mapPriceTypeToDurationUnit(priceType: string): 'Day' | 'Week' | 'Month' {
    const map: Record<string, 'Day' | 'Week' | 'Month'> = {
      Daily: 'Day',
      Weekly: 'Week',
      Monthly: 'Month',
    };
    return map[priceType] || 'Day';
  }

  private calculateDays(start: string, end: string): number {
    if (!start || !end) return 0;
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
  }

  onCancel(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.rentPrice == null || this.rentPrice <= 0) {
      this.errorMessage = 'Rent price is required';
      return;
    }
    if (this.securityDeposit == null || this.securityDeposit < 0) {
      this.errorMessage = 'Security deposit is required';
      return;
    }
    if (!this.rentalDuration || this.rentalDuration <= 0) {
      this.errorMessage = 'Rental duration is required';
      return;
    }

    const loggedInCompany = this.authService.getCompany();
    if (!loggedInCompany?.id) {
      this.errorMessage = 'Session expired. Please log in again.';
      return;
    }

    const negotiationData = {
      ownerCompany: loggedInCompany.id,
      renterCompany: this.order.companyId?._id || this.order.companyId,
      bookingId: this.order._id,
    };

    const versionData: VersionData = {
      rentPrice: this.rentPrice,
      securityDeposit: this.securityDeposit,
      rentalDuration: this.rentalDuration,
      durationUnit: this.durationUnit,
      notes: this.notes,
    };

    this.isSubmitting = true;
    this.negotiationService.createNegotiation(negotiationData, versionData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.negotiationStarted.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Failed to start negotiation';
      },
    });
  }
}
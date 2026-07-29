import { Component, OnInit } from '@angular/core';
import { NegotiationService } from 'src/app/services/negotiation.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-negotiation-room',
  templateUrl: './negotiation-room.component.html',
  styleUrls: ['./negotiation-room.component.css'],
})
export class NegotiationRoomComponent implements OnInit {
  history: any[] = [];
  currentOffer: any;
  currentBooking: any;

  negotiationId = '6a62c0649fbef2a58ffaca95';
  companyId = '6a5c47c5de4fc73f925b90e3';

  constructor(
    private negotiationService: NegotiationService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadNegotiationDetails();
  }

  get currentVersionDetails(): any {
    if (!this.currentOffer || !this.history || this.history.length === 0) {
      return null;
    }

    const currentVersionId = this.currentOffer.currentVersion?._id || this.currentOffer.currentVersion;
    const match = this.history.find((v: any) => v._id === currentVersionId);
    const version = match || this.history[this.history.length - 1];

    return {
      ...version,
      assetName: this.currentBooking?.assetId?.assetName || null,
    };
  }

  loadNegotiationDetails(): void {
    if (!this.companyId) return;

    this.negotiationService.getCurrent(this.companyId).subscribe({
      next: (res: any) => {
        if (res.success || res.data) {
          this.currentOffer = res.data || res;
          this.loadBookingDetails();
        }
      },
      error: (err: any) => console.error('Error fetching current offer:', err),
    });

    if (this.negotiationId) {
      this.negotiationService.getHistory(this.negotiationId).subscribe({
        next: (res: any) => {
          if (res.success || res.data) {
            this.history = res.data || res;
          }
        },
        error: (err: any) => console.error('Error fetching history:', err),
      });
    }
  }

  loadBookingDetails(): void {
    const bookingId = this.currentOffer?.bookingId?._id || this.currentOffer?.bookingId;
    if (!bookingId) {
      this.currentBooking = null;
      return;
    }

    this.bookingService.getBookingById(bookingId).subscribe({
      next: (res: any) => {
        this.currentBooking = res.data || res;
      },
      error: (err) => {
        console.error('Error fetching booking details:', err);
        this.currentBooking = null;
      },
    });
  }

  acceptOffer(): void {
    if (!this.currentOffer) return;

    const payload = {
      negotiationId: this.negotiationId,
      companyId: this.companyId,
    };

    this.negotiationService.acceptOffer(payload).subscribe({
      next: (res: any) => {
        alert('Term agreement accepted!');
        this.currentOffer = res.data || res;
        this.loadBookingDetails();
        this.loadNegotiationDetails();
      },
      error: (err: any) => alert('Error accepting offer'),
    });
  }

  rejectOffer(): void {
    const payload = {
      negotiationId: this.negotiationId,
      companyId: this.companyId,
    };

    this.negotiationService.rejectOffer(payload).subscribe({
      next: (res: any) => {
        alert('Offer rejected.');
        this.loadNegotiationDetails();
      },
      error: (err: any) => alert('Error rejecting offer'),
    });
  }

  submitCounterOffer(offerData: any): void {
    const payload = {
      counterBy: 'renterCompany',
      ...offerData,
    };

    this.negotiationService
      .counterOffer(this.negotiationId, payload)
      .subscribe({
        next: (res: any) => {
          alert('Counter offer sent successfully!');
          this.loadNegotiationDetails();
        },
        error: (err: any) => alert('Error sending counter offer'),
      });
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegotiationService } from 'src/app/services/negotiation.service';
import { BookingService } from 'src/app/services/booking.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-negotiation-room',
  templateUrl: './negotiation-room.component.html',
  styleUrls: ['./negotiation-room.component.css'],
})
export class NegotiationRoomComponent implements OnInit {
  history: any[] = [];
  currentOffer: any;
  currentBooking: any;

  negotiationId = '';
  bookingId = ''; 
  companyId = '';

  constructor(
    private negotiationService: NegotiationService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const company = this.authService.getCompany();
    this.companyId = company?._id || company?.id || '';

    this.route.queryParams.subscribe((params) => {
      this.bookingId = params['bookingId'] || '';
      this.negotiationId = params['negotiationId'] || params['id'] || '';

      if (this.negotiationId || this.companyId) {
        this.loadNegotiationDetails();
      }
    });
  }

  get currentVersionDetails(): any {
    if (!this.currentOffer && !this.currentBooking) {
      return null;
    }

    let version = null;
    if (this.history && this.history.length > 0) {
      const currentVersionId =
        this.currentOffer?.currentVersion?._id || this.currentOffer?.currentVersion;
      const match = this.history.find((v: any) => v._id === currentVersionId);
      version = match || this.history[this.history.length - 1];
    }

    return {
      ...(version || this.currentOffer || {}),
      assetName:
        this.currentBooking?.assetId?.assetName ||
        this.currentOffer?.assetId?.assetName ||
        null,
      assetId: this.currentBooking?.assetId || this.currentOffer?.assetId,
    };
  }

  get myRole(): 'ownerCompany' | 'renterCompany' | null {
    if (!this.currentOffer || !this.companyId) return null;
    const ownerId = this.currentOffer.ownerCompany?._id || this.currentOffer.ownerCompany;
    const renterId = this.currentOffer.renterCompany?._id || this.currentOffer.renterCompany;
    
    if (this.companyId === ownerId) return 'ownerCompany';
    if (this.companyId === renterId) return 'renterCompany';
    return null;
  }

  get canAction(): boolean {
    const version = this.currentVersionDetails;
    if (!version || !this.myRole) return false;
    return version.counterBy !== this.myRole;
  }

  loadNegotiationDetails(): void {
    if (this.companyId) {
      this.negotiationService.getCurrent(this.companyId).subscribe({
        next: (res: any) => {
          if (res.success || res.data) {
            this.currentOffer = res.data || res;
            
            if (!this.negotiationId) {
              this.negotiationId = this.currentOffer._id;
            }
            
            this.loadBookingDetails();
            this.loadHistory();
          }
        },
        error: (err: any) => console.error('Error fetching current offer:', err),
      });
    } else if (this.negotiationId || this.bookingId) {
      this.loadHistory();
    }
  }

  loadHistory(): void {
    // History must be fetched using negotiationId
    if (!this.negotiationId) return;

    this.negotiationService.getHistory(this.negotiationId).subscribe({
      next: (res: any) => {
        if (res.success || res.data) {
          this.history = res.data || res;
        }
      },
      error: (err: any) => console.error('Error fetching history:', err),
    });
  }

  loadBookingDetails(): void {
    const bId =
      this.bookingId ||
      this.currentOffer?.bookingId?._id ||
      this.currentOffer?.bookingId;

    if (!bId) {
      this.currentBooking = null;
      return;
    }

    this.bookingService.getBookingById(bId).subscribe({
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
    const bId =
      this.bookingId ||
      this.currentOffer?.bookingId?._id ||
      this.currentOffer?.bookingId ||
      this.currentBooking?._id;

    if (!bId) {
      alert('Booking ID is missing');
      return;
    }

    const payload = {
      bookingId: bId,
      negotiationId: this.negotiationId || this.currentOffer?._id,
      companyId: this.companyId,
    };

    this.negotiationService.acceptOffer(payload).subscribe({
      next: (res: any) => {
        alert('Term agreement accepted!');
        this.currentOffer = res.data || res;
        this.loadBookingDetails();
        this.loadNegotiationDetails();
      },
      error: (err: any) => {
        console.error('Error accepting offer:', err);
        alert(err.error?.message || 'Error accepting offer');
      },
    });
  }

  rejectOffer(): void {
    const bId =
      this.bookingId ||
      this.currentOffer?.bookingId?._id ||
      this.currentOffer?.bookingId ||
      this.currentBooking?._id;

    const payload = {
      bookingId: bId,
      negotiationId: this.negotiationId || this.currentOffer?._id,
      companyId: this.companyId,
    };

    this.negotiationService.rejectOffer(payload).subscribe({
      next: (res: any) => {
        alert('Offer rejected.');
        this.loadNegotiationDetails();
      },
      error: (err: any) => {
        console.error('Error rejecting offer:', err);
        alert(err.error?.message || 'Error rejecting offer');
      },
    });
  }

  submitCounterOffer(offerData: any): void {
    const bId =
      this.bookingId ||
      this.currentOffer?.bookingId?._id ||
      this.currentOffer?.bookingId ||
      this.currentBooking?._id;

    const targetId = this.negotiationId || this.currentOffer?._id || bId;

    const payload = {
      bookingId: bId,
      counterBy: this.myRole || 'renterCompany', 
      ...offerData,
    };

    this.negotiationService
      .counterOffer(targetId, payload)
      .subscribe({
        next: (res: any) => {
          alert('Counter offer sent successfully!');
          this.loadNegotiationDetails();
        },
        error: (err: any) => {
          console.error('Error sending counter offer:', err);
          alert(err.error?.message || 'Error sending counter offer');
        },
      });
  }
}
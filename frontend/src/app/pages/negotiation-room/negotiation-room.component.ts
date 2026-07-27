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

  // مؤقتًا حط أي IDs موجودة عندكم في الداتا بيز
  negotiationId = '6a62c0649fbef2a58ffaca95';
  companyId = '6a5c47c5de4fc73f925b90e3';

  constructor(
    private negotiationService: NegotiationService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    if (this.negotiationId) {
      this.loadHistory();
    }

    if (this.companyId) {
      this.loadCurrentOffer();
    }
  }

  // آخر Version موجودة في الـhistory = تفاصيل الـcurrent offer الفعلية
  // (السعر / الديبوزيت / المدة مش موجودين في الـNegotiation نفسها، موجودين في الـVersion)
  get currentVersionDetails(): any {
    if (!this.currentOffer || !this.history || this.history.length === 0) {
      return null;
    }

    const currentVersionId = this.currentOffer.currentVersion?._id || this.currentOffer.currentVersion;
    const match = this.history.find((v: any) => v._id === currentVersionId);
    const version = match || this.history[this.history.length - 1];

    // ندمج اسم الأصل جوه نفس الـobject اللي بيتبعت للـcurrent-offer widget
    return {
      ...version,
      assetName: this.currentBooking?.assetId?.assetName || null,
    };
  }

  loadHistory() {
    this.negotiationService.getHistory(this.negotiationId).subscribe({
      next: (res: any) => {
        this.history = res.data || [];
      },
      error: (err) => console.error(err),
    });
  }

  loadCurrentOffer() {
    this.negotiationService.getCurrent(this.companyId).subscribe({
      next: (res: any) => {
        this.currentOffer = res.data;
        this.loadBookingDetails();
      },
      error: (err) => console.error(err),
    });
  }

  loadBookingDetails() {
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
        console.error(err);
        this.currentBooking = null;
      },
    });
  }

  acceptOffer() {
    if (!this.currentOffer) return;

    this.negotiationService
      .acceptOffer({
        negotiationId: this.currentOffer._id,
        bookingId: this.currentOffer.bookingId,
      })
      .subscribe({
        next: () => {
          alert('Offer Accepted');
          this.loadCurrentOffer();
          this.loadHistory();
        },
        error: (err) => console.error(err),
      });
  }

  rejectOffer() {
    if (!this.currentOffer) return;

    this.negotiationService
      .rejectOffer({
        negotiationId: this.currentOffer._id,
        bookingId: this.currentOffer.bookingId,
      })
      .subscribe({
        next: () => {
          alert('Offer Rejected');
          this.loadCurrentOffer();
          this.loadHistory();
        },
        error: (err) => console.error(err),
      });
  }
}
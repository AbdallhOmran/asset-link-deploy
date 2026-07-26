import { Component, OnInit } from '@angular/core';
import { NegotiationService } from 'src/app/services/negotiation.service';

@Component({
  selector: 'app-negotiation-room',
  templateUrl: './negotiation-room.component.html',
  styleUrls: ['./negotiation-room.component.css'],
})
export class NegotiationRoomComponent implements OnInit {
  history: any[] = [];
  currentOffer: any;

  // مؤقتًا حط أي IDs موجودة عندكم في الداتا بيز
  negotiationId = '6a62c0649fbef2a58ffaca95';
  companyId = '6a5c47c5de4fc73f925b90e3';

  constructor(private negotiationService: NegotiationService) {}

  ngOnInit(): void {
    if (this.negotiationId) {
      this.loadHistory();
    }

    if (this.companyId) {
      this.loadCurrentOffer();
    }
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
      },
      error: (err) => console.error(err),
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

import { Component, OnInit } from '@angular/core';
import { NegotiationService } from '../../services/negotiation.service';

@Component({
  selector: 'app-negotiation-room',
  templateUrl: './negotiation-room.component.html',
  styleUrls: ['./negotiation-room.component.css'],
})
export class NegotiationRoomComponent implements OnInit {
  negotiationId = '6a62c0649fbef2a58ffaca95';
  companyId = '6a5c47c5de4fc73f925b90e3';

  history: any[] = [];
  currentOffer: any = null;

  constructor(private negotiationService: NegotiationService) {}

  ngOnInit(): void {
    this.loadNegotiationDetails();
  }

  loadNegotiationDetails(): void {
    if (!this.companyId) return;

    // 1. جلب العرض الحالي باستخدام companyId
    this.negotiationService.getCurrent(this.companyId).subscribe({
      next: (res: any) => {
        if (res.success || res.data) {
          this.currentOffer = res.data || res;
        }
      },
      error: (err: any) => console.error('Error fetching current offer:', err),
    });

    // 2. جلب الهيستوري باستخدام negotiationId
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

  acceptOffer(): void {
    const payload = {
      negotiationId: this.negotiationId,
      companyId: this.companyId,
    };

    this.negotiationService.acceptOffer(payload).subscribe({
      next: (res: any) => {
        alert('✅ Term agreement accepted!');
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
        alert('❌ Offer rejected.');
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
          alert('🔄 Counter offer sent successfully!');
          this.loadNegotiationDetails();
        },
        error: (err: any) => alert('Error sending counter offer'),
      });
  }
}

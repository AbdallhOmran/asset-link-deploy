import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-current-offer',
  templateUrl: './current-offer.component.html',
  styleUrls: ['./current-offer.component.css'],
})
export class CurrentOfferComponent {
  @Input() offer: any = null;
  @Input() canAction: boolean = false;
  
  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() counter = new EventEmitter<any>();

  acceptOffer() {
    this.accept.emit();
  }

  rejectOffer() {
    this.reject.emit();
  }

  // Modal State
  isCounterModalOpen = false;
  counterOfferData = {
    rentPrice: 0,
    securityDeposit: 0,
    rentalDuration: 1,
    durationUnit: 'Day',
    notes: ''
  };

  openCounterModal() {
    // Pre-fill with current offer data
    this.counterOfferData = {
      rentPrice: this.offer?.rentPrice || this.offer?.assetId?.price?.daily || 0,
      securityDeposit: this.offer?.securityDeposit || 0,
      rentalDuration: this.offer?.rentalDuration || 1,
      durationUnit: this.offer?.durationUnit || 'Day',
      notes: ''
    };
    this.isCounterModalOpen = true;
  }

  closeCounterModal() {
    this.isCounterModalOpen = false;
  }

  submitCounterOfferFromModal() {
    this.counter.emit({ ...this.counterOfferData });
    this.closeCounterModal();
  }
}
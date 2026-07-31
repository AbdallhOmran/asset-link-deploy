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

  submitCounterOffer(offerData: any) {
    this.counter.emit(offerData);
  }
}
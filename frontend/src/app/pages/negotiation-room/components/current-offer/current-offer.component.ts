import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-current-offer',
  templateUrl: './current-offer.component.html',
  styleUrls: ['./current-offer.component.css'],
})
export class CurrentOfferComponent {
  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();

  acceptOffer() {
    this.accept.emit();
  }

  rejectOffer() {
    this.reject.emit();
  }
}

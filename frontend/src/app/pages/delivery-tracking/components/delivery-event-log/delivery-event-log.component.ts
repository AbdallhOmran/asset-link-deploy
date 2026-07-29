import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delivery-event-log',
  templateUrl: './delivery-event-log.component.html',
  styleUrls: ['./delivery-event-log.component.css'],
})
export class DeliveryEventLogComponent {
  @Input() timeline: any[] = [];
  @Input() delivery: any;

  getReversedTimeline() {
    return [...this.timeline].reverse();
  }
}

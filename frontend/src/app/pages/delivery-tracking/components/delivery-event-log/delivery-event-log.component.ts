import { Component } from '@angular/core';

@Component({
  selector: 'app-delivery-event-log',
  templateUrl: './delivery-event-log.component.html',
  styleUrls: ['./delivery-event-log.component.css'],
})
export class DeliveryEventLogComponent {
  events = [
    {
      id: 1,
      title: 'Order Created',
      date: 'Jul 10, 2026 • 08:00 AM',
    },
    {
      id: 2,
      title: 'Driver Assigned',
      date: 'Jul 10, 2026 • 08:20 AM',
    },
    {
      id: 3,
      title: 'Shipment Picked Up',
      date: 'Jul 10, 2026 • 09:15 AM',
    },
    {
      id: 4,
      title: 'Currently In Transit',
      description: 'Vehicle is heading to destination.',
    },
  ];
}

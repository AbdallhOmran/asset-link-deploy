import { Component } from '@angular/core';

@Component({
  selector: 'app-delivery-progress',
  templateUrl: './delivery-progress.component.html',
  styleUrls: ['./delivery-progress.component.css'],
})
export class DeliveryProgressComponent {
  deliverySteps = [
    {
      icon: '📦',
      label: 'Preparing',
      subLabel: 'Jul 10 • 8:00 AM',
    },
    {
      icon: '🚚',
      label: 'Picked Up',
      subLabel: 'Jul 10 • 9:15 AM',
    },
    {
      icon: '📍',
      label: 'In Transit',
      subLabel: 'In progress...',
    },
    {
      icon: '✓',
      label: 'Delivered',
      subLabel: 'Est. 11:30 AM',
    },
  ];
}

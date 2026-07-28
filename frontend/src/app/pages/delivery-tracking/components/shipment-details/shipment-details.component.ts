import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shipment-details',
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.css'],
})
export class ShipmentDetailsComponent {
  @Input() delivery: any;
}

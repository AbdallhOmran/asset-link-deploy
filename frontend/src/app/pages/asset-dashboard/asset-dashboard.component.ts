import { Component } from '@angular/core';

@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css'],
})
export class AssetDashboardComponent {
  assets = [
    {
      name: 'Atlas Copco XRHS 1150',
      category: 'Industrial Air Compressor',
      price: '$560/day',
      status: 'Available',
    },
    {
      name: 'CAT 320 Excavator',
      category: 'Heavy Equipment',
      price: '$850/day',
      status: 'Rented',
    },
    {
      name: 'JLG Boom Lift',
      category: 'Lifting Equipment',
      price: '$430/day',
      status: 'Maintenance',
    },
    {
      name: 'Volvo Wheel Loader',
      category: 'Construction',
      price: '$720/day',
      status: 'Available',
    },
    {
      name: 'Forklift Toyota',
      category: 'Warehouse',
      price: '$280/day',
      status: 'Available',
    },
    {
      name: 'Diesel Generator',
      category: 'Power Equipment',
      price: '$390/day',
      status: 'Rented',
    },
  ];
}

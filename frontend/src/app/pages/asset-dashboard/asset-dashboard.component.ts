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
      company: 'PowerAssets Corp',
      code: 'PA-CMP-006',
      location: 'Chicago, IL',
      price: '$560/day',
      weekly: '$3,360/wk',
      monthly: '$11,760/mo',
      status: 'Available',
      score: 98,
      date: '15 Jul 2026',
    },
    {
      name: 'CAT 320 Excavator',
      category: 'Heavy Equipment',
      company: 'TerraEquip LLC',
      code: 'TE-EXC-001',
      location: 'Portland, OR',
      price: '$850/day',
      weekly: '$5,100/wk',
      monthly: '$17,850/mo',
      status: 'Rented',
      score: 94,
      date: '18 Jul 2026',
    },
    {
      name: 'JLG Boom Lift',
      category: 'Lifting Equipment',
      company: 'LiftWorks Inc',
      code: 'LW-LFT-004',
      location: 'Austin, TX',
      price: '$430/day',
      weekly: '$2,580/wk',
      monthly: '$9,030/mo',
      status: 'Inspection',
      score: 88,
      date: '20 Jul 2026',
    },
    {
      name: 'Volvo Wheel Loader',
      category: 'Construction',
      company: 'BuildMax',
      code: 'BM-WHL-007',
      location: 'Phoenix, AZ',
      price: '$720/day',
      weekly: '$4,320/wk',
      monthly: '$15,120/mo',
      status: 'Available',
      score: 96,
      date: '22 Jul 2026',
    },
    {
      name: 'Forklift Toyota',
      category: 'Warehouse',
      company: 'Storage Tech',
      code: 'ST-FLK-003',
      location: 'Seattle, WA',
      price: '$280/day',
      weekly: '$1,680/wk',
      monthly: '$5,880/mo',
      status: 'Maintenance',
      score: 79,
      date: '24 Jul 2026',
    },
    {
      name: 'Diesel Generator',
      category: 'Power Equipment',
      company: 'PowerAssets Corp',
      code: 'PA-GEN-008',
      location: 'Miami, FL',
      price: '$390/day',
      weekly: '$2,340/wk',
      monthly: '$8,190/mo',
      status: 'Available',
      score: 91,
      date: '27 Jul 2026',
    },
  ];

  get totalAssets(): number {
    return this.assets.length;
  }

  get availableAssets(): number {
    return this.assets.filter((asset) => asset.status === 'Available').length;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeTab: string = 'assets';

  navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assets', label: 'Assets', badge: 8 },
    { id: 'smart-matches', label: 'Smart Matches', badge: 6 },
    { id: 'bookings', label: 'Bookings', badge: 3 },
    { id: 'contracts', label: 'Contracts' },
    { id: 'negotiations', label: 'Negotiations', badge: 2 },
    { id: 'delivery', label: 'Delivery', badge: 1 },
    { id: 'payments', label: 'Payments' },
    { id: 'inspections', label: 'Inspections' },
    { id: 'maintenance', label: 'Maintenance' },
  ];

  setActive(id: string) {
    this.activeTab = id;
  }
}
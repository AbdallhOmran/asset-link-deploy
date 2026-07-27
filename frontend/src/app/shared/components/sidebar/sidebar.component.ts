import { Component } from '@angular/core';

interface NavLink {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // Quick navigation for dev/testing purposes, matches components registered in app.module.ts
  links: NavLink[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'layout-dashboard' },
    { label: 'Bookings', path: '/bookings', icon: 'calendar-days' },
    { label: 'Contracts', path: '/contracts', icon: 'file-text' },
    { label: 'Negotiation Room', path: '/negotiation-room', icon: 'message-square' },
    { label: 'Delivery Tracking', path: '/delivery-tracking', icon: 'truck' },
    { label: 'Payments & Escrow', path: '/payments', icon: 'credit-card' },
    { label: 'Company Profile', path: '/company-profile', icon: 'building-2' },
    { label: 'Login', path: '/login', icon: 'key-round' },
  ];
}
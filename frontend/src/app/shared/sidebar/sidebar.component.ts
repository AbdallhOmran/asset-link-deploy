import { Component } from '@angular/core';
import { Router } from '@angular/router';
interface SidebarItem {
  title: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private router: Router) {}

  platformItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: 'layout-dashboard',
    route: '/app/dashboard'
  },
  {
    title: 'Assets',
    icon: 'boxes',
    route: '/app/assets/add',
    badge: 8
  },
  {
    title: 'Bookings',
    icon: 'calendar-days',
    route: '/app/bookings',
    badge: 3
  },
  {
    title: 'Contracts',
    icon: 'file-text',
    route: '/app/contracts'
  },
  {
    title: 'Negotiations',
    icon: 'messages-square',
    route: '/app/negotiation-room',
    badge: 2
  },
  {
    title: 'Delivery',
    icon: 'truck',
    route: '/app/delivery-tracking',
    badge: 1
  },
  {
    title: 'Payments',
    icon: 'wallet',
    route: '/app/payments-escrow'
  },
  {
    title: 'Maintenance',
    icon: 'wrench',
    route: '/app/maintenance-schedule'
  }
];
  accountItems: SidebarItem[] = [
  {
    title: 'Company',
    icon: 'building-2',
    route: '/app/company-profile'
  }
];
logout(): void {

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/login']);

}

}
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent {

  pageTitle = 'Dashboard';

  constructor(private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        const url = this.router.url;

        if (url.includes('dashboard')) {
          this.pageTitle = 'Dashboard';
        } else if (url.includes('assets')) {
          this.pageTitle = 'Assets';
        } else if (url.includes('bookings')) {
          this.pageTitle = 'Bookings';
        } else if (url.includes('contracts')) {
          this.pageTitle = 'Contracts';
        } else if (url.includes('company-profile')) {
          this.pageTitle = 'Company';
        } else if (url.includes('payments-escrow')) {
          this.pageTitle = 'Payments';
        } else if (url.includes('delivery-tracking')) {
          this.pageTitle = 'Delivery';
        } else if (url.includes('negotiation-room')) {
          this.pageTitle = 'Negotiations';
        } else if (url.includes('maintenance-schedule')) {
          this.pageTitle = 'Maintenance';
        }

      });

  }

}
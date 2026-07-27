import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  hideSidebar = false;

  // routes where the dev sidebar should NOT appear
  private noSidebarRoutes = ['/login', '/register', '/otp'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.hideSidebar = this.noSidebarRoutes.some((route) =>
          event.urlAfterRedirects.startsWith(route)
        );
      });
  }
}
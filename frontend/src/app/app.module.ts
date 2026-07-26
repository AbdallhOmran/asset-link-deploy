import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // 👈 استيراد الـ Router
import { AppRoutingModule } from './app-routing.module'; // 👈 استيراد ملف الـ Routes

import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NotificationPopoverComponent } from './components/notification-popover/notification-popover.component';
import { InspectionsListComponent } from './components/inspections-list/inspections-list.component';
import { InspectionDetailComponent } from './components/inspection-detail/inspection-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    SearchInputComponent,
    StarRatingComponent,
    NotificationPopoverComponent,
    InspectionsListComponent,
    InspectionDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // 👈 إضافته هنا
    RouterModule      // 👈 إضافته هنا
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, CheckCircle2, Clock3 } from 'lucide-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { ButtonComponent } from './shared/components/button/button.component';
import { StepperComponent } from './shared/components/stepper/stepper.component';
import { ImageGalleryComponent } from './shared/components/image-gallery/image-gallery.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { DateRangePickerComponent } from './shared/components/date-range-picker/date-range-picker.component';
import { CompanyProfileComponent } from './pages/company/company-profile/company-profile.component';
import { ProfileHeaderComponent } from './pages/company/company-profile/components/profile-header/profile-header.component';
import { CompanyStatsComponent } from './pages/company/company-profile/components/company-stats/company-stats.component';
import { ProfileTabsComponent } from './pages/company/company-profile/components/profile-tabs/profile-tabs.component';
import { CompanyInformationComponent } from './pages/company/company-profile/components/company-information/company-information.component';
import { ContactCardComponent } from './pages/company/company-profile/components/contact-card/contact-card.component';
import { AccountStatusComponent } from './pages/company/company-profile/components/account-status/account-status.component';
import { CertificationsComponent } from './pages/company/company-profile/components/certifications/certifications.component';
import { TeamMembersComponent } from './pages/company/company-profile/components/team-members/team-members.component';
import { ListedAssetsComponent } from './pages/company/company-profile/components/listed-assets/listed-assets.component';
import { ReviewsComponent } from './pages/company/company-profile/components/reviews/reviews.component';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { PaymentsEscrowComponent } from './pages/payments-escrow/payments-escrow.component';
import { DeliveryTrackingComponent } from './pages/delivery-tracking/delivery-tracking.component';
import { DeliveryHeaderComponent } from './pages/delivery-tracking/components/delivery-header/delivery-header.component';
import { DeliveryProgressComponent } from './pages/delivery-tracking/components/delivery-progress/delivery-progress.component';
import { ShipmentDetailsComponent } from './pages/delivery-tracking/components/shipment-details/shipment-details.component';
import { DeliveryEventLogComponent } from './pages/delivery-tracking/components/delivery-event-log/delivery-event-log.component';

@NgModule({
  declarations: [
    AppComponent,
    PaymentsEscrowComponent,
    CompanyProfileComponent,
    ProfileHeaderComponent,
    CompanyStatsComponent,
    ProfileTabsComponent,
    CompanyInformationComponent,
    ContactCardComponent,
    AccountStatusComponent,
    CertificationsComponent,
    TeamMembersComponent,
    ListedAssetsComponent,
    ReviewsComponent,
    DeliveryTrackingComponent,
    DeliveryHeaderComponent,
    DeliveryProgressComponent,
    ShipmentDetailsComponent,
    DeliveryEventLogComponent,
  ],
  imports: [
  BrowserModule,
  AppRoutingModule,
  FormsModule, 
  SharedModule ,
  HttpClientModule,
  LucideAngularModule.pick({
    CheckCircle2,
    Clock3
  })
],
 providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent]
})
export class AppModule {}
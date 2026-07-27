import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { 
  LucideAngularModule, 
  CheckCircle2, 
  Clock3, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  LogOut,
  Building2, 
  Shield, 
  Image,
  BriefcaseBusiness,
  Users,
  Calendar
} from 'lucide-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { DashboardLayoutComponent } from './shared/layout/dashboard-layout/dashboard-layout.component';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NotificationPopoverComponent } from './components/notification-popover/notification-popover.component';
import { InspectionsListComponent } from './components/inspections-list/inspections-list.component';
import { InspectionDetailComponent } from './components/inspection-detail/inspection-detail.component';

import { LoginComponent } from './pages/login/login.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { PaymentsEscrowComponent } from './pages/payments-escrow/payments-escrow.component';
import { BookingsComponent } from './pages/bookings/bookings.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { EditCompanyProfileComponent } from './pages/edit-company-profile/edit-company-profile.component';
import { NegotiationRoomComponent } from './pages/negotiation-room/negotiation-room.component';
import { NegotiationHeaderComponent } from './pages/negotiation-room/components/negotiation-header/negotiation-header.component';
import { NegotiationChatComponent } from './pages/negotiation-room/components/negotiation-chat/negotiation-chat.component';
import { CurrentOfferComponent } from './pages/negotiation-room/components/current-offer/current-offer.component';
import { OfferHistoryComponent } from './pages/negotiation-room/components/offer-history/offer-history.component';
import { PartiesCardComponent } from './pages/negotiation-room/components/parties-card/parties-card.component';
import { MessageInputComponent } from './pages/negotiation-room/components/message-input/message-input.component';
import { DeliveryTrackingComponent } from './pages/delivery-tracking/delivery-tracking.component';
import { DeliveryHeaderComponent } from './pages/delivery-tracking/components/delivery-header/delivery-header.component';
import { DeliveryProgressComponent } from './pages/delivery-tracking/components/delivery-progress/delivery-progress.component';
import { ShipmentDetailsComponent } from './pages/delivery-tracking/components/shipment-details/shipment-details.component';
import { DeliveryEventLogComponent } from './pages/delivery-tracking/components/delivery-event-log/delivery-event-log.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TopbarComponent,
    SearchInputComponent,
    StarRatingComponent,
    NotificationPopoverComponent,
    InspectionsListComponent,
    InspectionDetailComponent,
    LoginComponent,
    AssetDashboardComponent,
    PaymentsEscrowComponent,
    BookingsComponent,
    ContractsComponent,
    NegotiationRoomComponent,
    NegotiationHeaderComponent,
    NegotiationChatComponent,
    CurrentOfferComponent,
    OfferHistoryComponent,
    PartiesCardComponent,
    MessageInputComponent,
    DeliveryTrackingComponent,
    DeliveryHeaderComponent,
    DeliveryProgressComponent,
    ShipmentDetailsComponent,
    DeliveryEventLogComponent,
    CompanyProfileComponent,
    DashboardLayoutComponent,
    EditCompanyProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    LucideAngularModule.pick({
      CheckCircle2,
      Clock3,
      Mail,
      Phone,
      Globe,
      MapPin,
      LogOut,
      Building2,
      Shield,
      Image,
      BriefcaseBusiness,
      Users,
      Calendar
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
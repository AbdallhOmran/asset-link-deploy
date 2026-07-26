  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { FormsModule } from '@angular/forms';
  import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
  import { LucideAngularModule,CheckCircle2, Clock3, Mail, Phone, Globe, MapPin } from 'lucide-angular';
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { SharedModule } from './shared/shared.module';
  import { AuthInterceptor } from './interceptors/auth.interceptor';

  import { LoginComponent } from './pages/login/login.component';
  import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
  import { PaymentsEscrowComponent } from './pages/payments-escrow/payments-escrow.component';
  import { BookingsComponent } from './pages/bookings/bookings.component';
  import { ContractsComponent } from './pages/contracts/contracts.component';

  import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
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
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      SharedModule,
      HttpClientModule,
      LucideAngularModule.pick({
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Globe,
  MapPin
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
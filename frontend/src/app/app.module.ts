import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LucideAngularModule, CheckCircle2, Clock3 } from 'lucide-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Pages & Components Imports
import { LoginComponent } from './pages/login/login.component';
import { AssetDashboardComponent } from './pages/asset-dashboard/asset-dashboard.component';
import { PaymentsEscrowComponent } from './pages/payments-escrow/payments-escrow.component';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AssetDashboardComponent,
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, 
    SharedModule,
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
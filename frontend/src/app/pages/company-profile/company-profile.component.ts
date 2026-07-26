import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
assets: any[] = [];
  constructor(private companyService: CompanyService) {}

  activeTab: 'overview' | 'assets' = 'overview';

  company: any = {
    companyName: '',
    companyEmail: '',
    phoneNumber: '',
    companyAddress: '',
    commercialRegistrationNumber: '',
    role: '',
    isVerified: false,

    // بيانات مؤقتة لحد ما الـ API يوفرها
    description:
      'Full-service heavy equipment rental company specializing in excavation, lifting, and site preparation machinery across the Pacific Northwest. Trusted by 120+ contractors since 2018.',

    industry: 'Construction & Infrastructure',

    website: 'terraequip.com',

    employees: '51–200 employees',

    memberSince: 'Jan 2023',

    stats: {
      assets: 8,
      bookings: 142,
      revenue: '$1.24M',
      completion: '98.6%',
      response: '< 2 hrs'
    }
  };

  
 ngOnInit(): void {
  this.getCompanyProfile();
  this.getMyAssets();
}
  getCompanyProfile(): void {
    this.companyService.getProfile().subscribe({
      next: (res: any) => {
        this.company = {
          ...this.company,
          ...res.data
        };

        console.log('Company Profile:', this.company);
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }
  getMyAssets(): void {
  this.companyService.getMyAssets().subscribe({
    next: (res: any) => {
      this.assets = res.data;
      console.log('Assets:', this.assets);
    },
    error: (err) => {
      console.error(err);
    }
  });
}
}
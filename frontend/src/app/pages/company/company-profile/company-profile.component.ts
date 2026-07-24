import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {

  activeTab = 'Overview';

  company: any = null;

  isLoading = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanyProfile();
  }

  loadCompanyProfile() {
    this.isLoading = true;

    this.companyService.getProfile().subscribe({
      next: (res: any) => {
        this.company = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onTabChanged(tab: string) {
    this.activeTab = tab;
  }
}
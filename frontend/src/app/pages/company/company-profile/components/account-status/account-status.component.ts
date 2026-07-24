import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.css']
})
export class AccountStatusComponent implements OnChanges {

  @Input() company: any;

  items: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.company) {
      this.items = [
        {
          title: 'Verification',
          status: this.company.isVerified ? 'Verified' : 'Pending',
          completed: this.company.isVerified
        },
        {
          title: 'Commercial Registration',
          status: this.company.commercialRegistrationNumber
            ? 'Completed'
            : 'Missing',
          completed: !!this.company.commercialRegistrationNumber
        },
        {
          title: 'Company Address',
          status: this.company.companyAddress
            ? 'Completed'
            : 'Missing',
          completed: !!this.company.companyAddress
        }
      ];
    }
  }
}
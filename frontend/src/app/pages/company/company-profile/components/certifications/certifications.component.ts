import { Component } from '@angular/core';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.css']
})
export class CertificationsComponent {
certifications = [
    {
      name: 'OSHA Compliance Certificate',
      issuer: 'OSHA',
      expiry: 'Expires Dec 2025',
      verified: true
    },
    {
      name: 'ISO 9001:2015 Quality Management',
      issuer: 'Bureau Veritas',
      expiry: 'Expires Mar 2026',
      verified: true
    },
    {
      name: 'General Liability Insurance',
      issuer: 'Travelers Insurance',
      expiry: 'Expires Jan 2026',
      verified: true
    },
   {
  name: 'Equipment Maintenance Certification',
  issuer: 'NCCCO',
  expiry: 'Expires Aug 2025',
  verified: false
}
  ];
}

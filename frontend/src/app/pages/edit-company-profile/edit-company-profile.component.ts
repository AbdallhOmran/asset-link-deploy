import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export type TabType =
  | 'general'
  | 'contact'
  | 'branding'
  | 'security';

@Component({
  selector: 'app-edit-company-profile',
  templateUrl: './edit-company-profile.component.html',
  styleUrls: ['./edit-company-profile.component.css']
})
export class EditCompanyProfileComponent implements OnInit {

  selectedTab: TabType = 'general';

  tabs: {
    id: TabType;
    title: string;
    icon: string;
  }[] = [
    {
      id: 'general',
      title: 'General Info',
      icon: 'building-2'
    },
    {
      id: 'contact',
      title: 'Contact Details',
      icon: 'mail'
    },
    {
      id: 'branding',
      title: 'Branding & Logo',
      icon: 'image'
    },
    {
      id: 'security',
      title: 'Security',
      icon: 'shield'
    }
  ];

  profileForm!: FormGroup;

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      // General Info
      companyName: new FormControl(''),
      displayName: new FormControl(''),
      industry: new FormControl(''),
      companySize: new FormControl(''),
      yearFounded: new FormControl(''),
      website: new FormControl(''),
      description: new FormControl(''),

      // Contact Details
      companyEmail: new FormControl(''),
      phoneNumber: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zipCode: new FormControl(''),
      country: new FormControl(''),

      // Branding
      companyLogo: new FormControl(''),
      coverImage: new FormControl(''),
      brandColor: new FormControl(''),

      // Security
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  }

  changeTab(tab: TabType): void {
    this.selectedTab = tab;
  }
}
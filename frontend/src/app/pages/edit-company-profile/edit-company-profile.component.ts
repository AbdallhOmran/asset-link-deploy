import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';

type EditSection =
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

  activeSection: EditSection = 'general';

  sections: {
    key: EditSection;
    title: string;
    icon: string;
  }[] = [
    {
      key: 'general',
      title: 'General Info',
      icon: 'building-2'
    },
    {
      key: 'contact',
      title: 'Contact Details',
      icon: 'mail'
    },
    {
      key: 'branding',
      title: 'Branding & Logo',
      icon: 'image'
    },
    {
      key: 'security',
      title: 'Security',
      icon: 'shield'
    }
  ];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({

      // General
      companyName: ['', Validators.required],
      displayName: ['', Validators.required],
      industry: ['', Validators.required],
      companySize: ['', Validators.required],
      yearFounded: [''],
      website: [''],
      description: [''],

      // Contact
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],

      // Branding
      logo: [''],
      coverImage: [''],
      brandColor: ['#2563eb'],

      // Security
      currentPassword: [''],
      newPassword: [''],
      confirmPassword: ['']

    });

    this.loadProfile();
  }

  loadProfile(): void {

    this.profileService.getProfile().subscribe({

      next: (res: any) => {

        const company = res.data;

        this.form.patchValue({

          companyName: company.companyName || '',
          displayName: company.displayName || '',
          industry: company.industry || '',
          companySize: company.companySize || '',
          yearFounded: company.yearFounded || '',
          website: company.website || '',
          description: company.description || '',

          email: company.companyEmail || '',
          phone: company.phoneNumber || '',

          street: company.companyAddress || '',
          city: company.city || '',
          state: company.state || '',
          zipCode: company.zipCode || '',
          country: company.country || '',

          logo: company.companyLogo || ''

        });

      },

      error: (err) => {
        console.error('Load Profile Error:', err);
      }

    });

  }

  saveChanges(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = {

      companyName: this.form.value.companyName,
      displayName: this.form.value.displayName,
      companyEmail: this.form.value.email,
      phoneNumber: this.form.value.phone,
      companyAddress: this.form.value.street,

      industry: this.form.value.industry,
      companySize: this.form.value.companySize,
      yearFounded: this.form.value.yearFounded,

      website: this.form.value.website,
      description: this.form.value.description,

      city: this.form.value.city,
      state: this.form.value.state,
      zipCode: this.form.value.zipCode,
      country: this.form.value.country,

      companyLogo: this.form.value.logo

    };

    this.profileService.updateProfile(body).subscribe({

      next: (res: any) => {

        console.log(res);
        alert('Profile updated successfully');

      },

      error: (err) => {

        console.error('Update Error:', err);
        alert('Failed to update profile');

      }

    });

  }

}
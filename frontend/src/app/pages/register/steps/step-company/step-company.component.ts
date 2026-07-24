import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterStateService } from '../../register-state.service';

@Component({
  selector: 'app-step-company',
  templateUrl: './step-company.component.html',
  styleUrls: ['./step-company.component.css']
})
export class StepCompanyComponent implements OnInit {
  public form!: FormGroup;

  public industries: string[] = [
    'Construction',
    'Mining & Extraction',
    'Oil & Gas',
    'Infrastructure',
    'Manufacturing',
    'Logistics & Transport',
    'Agriculture',
    'Energy & Utilities'
  ];

  public companySizes: string[] = [
    '1–10 employees',
    '11–50 employees',
    '51–200 employees',
    '201–500 employees',
    '500+ employees'
  ];

  public countries: string[] = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerState: RegisterStateService
  ) {}

  ngOnInit(): void {
    const saved = this.registerState.currentData.company;

    this.form = this.fb.group({
      companyName: [saved.companyName || '', [Validators.required, Validators.minLength(2)]],
      industry: [saved.industry || '', [Validators.required]],
      companySize: [saved.companySize || '', [Validators.required]],
      country: [saved.country || 'United States', [Validators.required]],
      website: [saved.website || '']
    });
  }

  public onNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registerState.updateCompanyInfo(this.form.value);
    this.router.navigate(['/register/step-2']);
  }
}

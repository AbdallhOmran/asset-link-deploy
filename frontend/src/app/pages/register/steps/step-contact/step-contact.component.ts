import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterStateService } from '../../register-state.service';

@Component({
  selector: 'app-step-contact',
  templateUrl: './step-contact.component.html',
  styleUrls: ['./step-contact.component.css']
})
export class StepContactComponent implements OnInit {
  public form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerState: RegisterStateService
  ) {}

  ngOnInit(): void {
    const saved = this.registerState.currentData.contact;

    this.form = this.fb.group({
      firstName: [saved.firstName || '', [Validators.required]],
      lastName: [saved.lastName || '', [Validators.required]],
      jobTitle: [saved.jobTitle || '', [Validators.required]],
      email: [saved.email || '', [Validators.required, Validators.email]],
      phone: [saved.phone || '']
    });
  }

  public onBack(): void {
    this.registerState.updateContactDetails(this.form.value);
    this.router.navigate(['/register/step-1']);
  }

  public onNext(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registerState.updateContactDetails(this.form.value);
    this.router.navigate(['/register/step-3']);
  }
}

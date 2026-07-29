import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService, AssetCategory } from '../../services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  form: FormGroup;

  isSubmitting = false;
  submitSuccess = false;
  submitError: string | null = null;
  showDiscardModal = false;

  /** List of categories added in this session (shown as chips below the form) */
  addedCategories: AssetCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      assetCategoryName: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  get nameCtrl() {
    return this.form.get('assetCategoryName')!;
  }

  isInvalid(): boolean {
    return !!(this.nameCtrl.invalid && this.nameCtrl.touched);
  }

  openDiscardModal(): void {
    this.showDiscardModal = true;
  }

  confirmDiscard(): void {
    this.showDiscardModal = false;
    this.router.navigate(['/dashboard']);
  }

  /** Save and add another — clears form so user can add a second category */
  saveAndAddAnother(): void {
    this.submit(false);
  }

  /** Save and go back to dashboard */
  save(): void {
    this.submit(true);
  }

  private submit(navigateAfter: boolean): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = false;

    this.categoryService.addCategory(this.nameCtrl.value.trim()).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.addedCategories = [...this.addedCategories, created];
        this.form.reset();

        if (navigateAfter) {
          setTimeout(() => this.router.navigate(['/assets/add']), 1200);
        } else {
          setTimeout(() => (this.submitSuccess = false), 2000);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError =
          err?.error?.message ?? err?.error ?? 'Failed to create category. Please try again.';
      },
    });
  }
}

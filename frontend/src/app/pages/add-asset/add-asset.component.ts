import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { AuthService } from '../../services/auth.service';
import { StepperStep } from '../../shared/components/stepper/stepper.component';

export interface NavSection {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css'],
})
export class AddAssetComponent implements OnInit {
  activeSection = 'basic-info';
  currentStepIndex = 0;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;
  showDiscardModal = false;

  uploadedImages: string[] = [];

  isEditMode = false;
  editAssetId: string | null = null;

  /** 4 sections — maps exactly to the asset model fields */
  navSections: NavSection[] = [
    { id: 'basic-info', label: 'Basic Information', icon: 'clipboard-list' },
    { id: 'pricing',    label: 'Pricing & Terms',   icon: 'dollar-sign'    },
    { id: 'images',     label: 'Images & Media',    icon: 'image'          },
    { id: 'location',   label: 'Location',          icon: 'map-pin'        },
  ];

  get stepperSteps(): StepperStep[] {
    return this.navSections.map(s => ({ label: s.label }));
  }

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private assetService: AssetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // 📦 Basic Info (model: assetCode, assetCategoryId, assetName, description)
      assetName:       ['', [Validators.required, Validators.minLength(2)]],
      assetCategoryId: ['', Validators.required],
      assetCode:       ['', Validators.required],
      description:     ['', [Validators.required, Validators.minLength(2)]],

      // 💰 Pricing (model: price.daily, price.weekly, price.monthly)
      priceDaily:   [null, [Validators.required, Validators.min(0)]],
      priceWeekly:  [null, Validators.min(0)],
      priceMonthly: [null, Validators.min(0)],

      // 📍 Location (model: location)
      location: [''],
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.editAssetId = id;
        this.loadAssetData(id);
      }
    });
  }

  loadAssetData(id: string): void {
    this.assetService.getAssetDetails(id).subscribe({
      next: (res: any) => {
        const asset = res.data || res;
        if (!asset) return;

        this.form.patchValue({
          assetName: asset.assetName || asset.name,
          assetCategoryId: asset.assetCategoryId?._id || asset.assetCategoryId,
          assetCode: asset.assetCode || asset.code,
          description: asset.description,
          priceDaily: asset.price?.daily || asset.price,
          priceWeekly: asset.price?.weekly,
          priceMonthly: asset.price?.monthly,
          location: asset.location
        });

        if (asset.assetImages && asset.assetImages.length > 0) {
          this.uploadedImages = [...asset.assetImages];
        }
      },
      error: (err) => console.error('Failed to load asset', err)
    });
  }

  setSection(id: string, index: number): void {
    this.activeSection = id;
    this.currentStepIndex = index;
  }

  nextSection(): void {
    if (this.currentStepIndex < this.navSections.length - 1) {
      this.currentStepIndex++;
      this.activeSection = this.navSections[this.currentStepIndex].id;
    }
  }

  prevSection(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.activeSection = this.navSections[this.currentStepIndex].id;
    }
  }

  onImagesChange(images: string[]): void {
    this.uploadedImages = images;
  }

  openDiscardModal(): void {
    this.showDiscardModal = true;
  }

  confirmDiscard(): void {
    this.showDiscardModal = false;
    this.router.navigate(['/app/dashboard']);
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.setSection('basic-info', 0);
      return;
    }

    const v = this.form.value;
    const company = this.authService.getCompany();

    /** Payload matches the asset schema exactly */
    const payload = {
      assetCode:       v.assetCode,
      companyId:       company?._id ?? company?.id ?? '',
      assetCategoryId: v.assetCategoryId,
      assetName:       v.assetName,
      description:     v.description,
      assetImages:     this.uploadedImages,
      price: {
        daily:   v.priceDaily,
        weekly:  v.priceWeekly  ?? undefined,
        monthly: v.priceMonthly ?? undefined,
      },
      location: v.location || undefined,
      // status defaults to "Available" on the backend
    };

    this.isSubmitting = true;
    this.submitError = null;

    if (this.isEditMode && this.editAssetId) {
      this.assetService.updateAsset(this.editAssetId, payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          setTimeout(() => this.router.navigate(['/app/company-profile']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError = err?.error?.message ?? 'Failed to update asset. Please try again.';
        },
      });
    } else {
      this.assetService.addAsset(payload).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          setTimeout(() => this.router.navigate(['/app/dashboard']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.submitError = err?.error?.message ?? 'Failed to register asset. Please try again.';
        },
      });
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AssetService } from '../../../../services/asset.service';

@Component({
  selector: 'app-basic-info-section',
  templateUrl: './basic-info-section.component.html',
})
export class BasicInfoSectionComponent implements OnInit {
  @Input() form!: FormGroup;

  categories: { _id: string; assetCategoryName: string }[] = [];

  constructor(private assetService: AssetService) {}

  ngOnInit(): void {
    this.assetService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res?.data ?? res ?? [];
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CategoryService, AssetCategory } from '../../../../services/category.service';

@Component({
  selector: 'app-basic-info-section',
  templateUrl: './basic-info-section.component.html',
})
export class BasicInfoSectionComponent implements OnInit {
  @Input() form!: FormGroup;

  categories: AssetCategory[] = [];
  loadingCategories = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // Refresh list when user navigates back from /assets/category/add
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadCategories());
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res?.data ?? res ?? [];
        this.loadingCategories = false;
      },
      error: () => {
        this.categories = [];
        this.loadingCategories = false;
      },
    });
  }

  goToAddCategory(): void {
    this.router.navigate(['/assets/category/add']);
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}

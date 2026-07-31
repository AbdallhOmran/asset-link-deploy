import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

/**
 * خيار الفلتر الفردي (الحالة / التصنيف)
 */
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: string;
  colorClass?: string;
}

/**
 * نطاق السعر المحجوز
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * حالة الفلاتر المحددة الكاملة
 */
export interface FilterState {
  selectedStatuses: string[];
  priceRange: PriceRange;
  searchQuery?: string;
}

/**
 * FilterPanelComponent - لوحة الفلاتر المتقدمة والشاملة
 * تدعم الفلترة بالحالة، نطاق الأسعار، والبحث مع إمكانية مسح وتحديد الفلاتر النشطة بـ Pills.
 */
@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPanelComponent implements OnInit, OnChanges {
  /** عنوان اللوحة الرئيسي */
  @Input() title = 'تصفية النتائج المتقدمة';

  /** خيارات فلاتر الحالة المتاحة */
  @Input() statusOptions: FilterOption[] = [
    { value: 'all', label: 'الكل' },
    { value: 'pending', label: 'قيد الانتظار', count: 12, colorClass: 'bg-amber-500' },
    { value: 'active', label: 'جاري الشحن', count: 8, colorClass: 'bg-blue-500' },
    { value: 'delivered', label: 'تم التسليم', count: 24, colorClass: 'bg-emerald-500' },
    { value: 'cancelled', label: 'ملغي', count: 2, colorClass: 'bg-rose-500' }
  ];

  /** وضع اختيار الفلاتر: فردي (single) أو متعدد (multi) */
  @Input() statusSelectionMode: 'single' | 'multi' = 'multi';

  /** الحد الأدنى الافتراضي للسعر */
  @Input() minPriceLimit = 0;

  /** الحد الأقصى الافتراضي للسعر */
  @Input() maxPriceLimit = 100000;

  /** خطوة تغيير السعر */
  @Input() priceStep = 500;

  /** رمز العملة */
  @Input() currencySymbol = 'ر.س';

  /** القيم الابتدائية المحددة لفلاتر الحالة */
  @Input() initialStatuses: string[] = [];

  /** القيمة الابتدائية لنطاق السعر */
  @Input() initialPriceRange?: PriceRange;

  /** إظهار زر التكييف السريع (تطبيق الفلاتر) */
  @Input() showApplyButton = true;

  /** إظهار زر مسح الكل */
  @Input() showClearButton = true;

  /** التطبيق الفوري للتغييرات بدون الانتظار لضغط زر Apply */
  @Input() instantApply = false;

  /** إظهار حقل البحث النصي */
  @Input() showSearchInput = true;

  /** نص حقل البحث */
  @Input() searchPlaceholder = 'البحث برقم الشحنة أو اسم الشركة...';

  /** الحالات التفاعلية الحالية */
  selectedStatuses: string[] = [];
  currentPriceRange: PriceRange = { min: 0, max: 100000 };
  searchQuery = '';

  /** حدث يُطلق عند تغيير الفلاتر (إما فورًا أو بعد الضغط على تطبيق) */
  @Output() filterChange = new EventEmitter<FilterState>();

  /** حدث يُطلق عند مسح كافة الفلاتر */
  @Output() resetFilters = new EventEmitter<void>();

  ngOnInit(): void {
    this.initFilterState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialStatuses'] || changes['initialPriceRange'] || changes['minPriceLimit'] || changes['maxPriceLimit']) {
      this.initFilterState();
    }
  }

  /** تهيئة حالة الفلتر الداخلية */
  private initFilterState(): void {
    this.selectedStatuses = [...(this.initialStatuses || [])];
    this.currentPriceRange = this.initialPriceRange 
      ? { ...this.initialPriceRange } 
      : { min: this.minPriceLimit, max: this.maxPriceLimit };
  }

  /** التبديل بين خيارات الحالة */
  toggleStatus(value: string): void {
    if (value === 'all') {
      this.selectedStatuses = [];
    } else if (this.statusSelectionMode === 'single') {
      this.selectedStatuses = [value];
    } else {
      const index = this.selectedStatuses.indexOf(value);
      if (index > -1) {
        this.selectedStatuses.splice(index, 1);
      } else {
        this.selectedStatuses.push(value);
      }
    }

    if (this.instantApply) {
      this.applyFilters();
    }
  }

  /** التثبت من تحديد حالة ما */
  isStatusSelected(value: string): boolean {
    if (value === 'all') {
      return this.selectedStatuses.length === 0;
    }
    return this.selectedStatuses.includes(value);
  }

  /** تحديث حقول نطاق السعر */
  onMinPriceChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.currentPriceRange.min = Math.min(val, this.currentPriceRange.max);
    if (this.instantApply) this.applyFilters();
  }

  onMaxPriceChange(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.currentPriceRange.max = Math.max(val, this.currentPriceRange.min);
    if (this.instantApply) this.applyFilters();
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    if (this.instantApply) this.applyFilters();
  }

  /** تطبيق الفلاتر وإطلاق الحدث */
  applyFilters(): void {
    const state: FilterState = {
      selectedStatuses: [...this.selectedStatuses],
      priceRange: { ...this.currentPriceRange },
      searchQuery: this.searchQuery
    };
    this.filterChange.emit(state);
  }

  /** مسح كافة الفلاتر والعودة للوضع الافتراضي */
  clearAllFilters(): void {
    this.selectedStatuses = [];
    this.currentPriceRange = { min: this.minPriceLimit, max: this.maxPriceLimit };
    this.searchQuery = '';
    this.resetFilters.emit();
    this.applyFilters();
  }

  /** إزالة حالة واحدة عبر Pill */
  removeStatusPill(value: string): void {
    this.selectedStatuses = this.selectedStatuses.filter(s => s !== value);
    if (this.instantApply) this.applyFilters();
  }

  /** إعادة ضبط نطاق السعر عبر Pill */
  resetPricePill(): void {
    this.currentPriceRange = { min: this.minPriceLimit, max: this.maxPriceLimit };
    if (this.instantApply) this.applyFilters();
  }

  /** مسح الكلمة المفتاحية عبر Pill */
  clearSearchPill(): void {
    this.searchQuery = '';
    if (this.instantApply) this.applyFilters();
  }

  /** الحصول على اسم الحالة المحددة */
  getStatusLabel(value: string): string {
    const option = this.statusOptions.find(o => o.value === value);
    return option ? option.label : value;
  }

  /** التحقق هل يوجد فلاتر نشطة حاليًا */
  get hasActiveFilters(): boolean {
    const hasStatus = this.selectedStatuses.length > 0;
    const hasCustomPrice = this.currentPriceRange.min > this.minPriceLimit || this.currentPriceRange.max < this.maxPriceLimit;
    const hasSearch = !!this.searchQuery.trim();
    return hasStatus || hasCustomPrice || hasSearch;
  }
}

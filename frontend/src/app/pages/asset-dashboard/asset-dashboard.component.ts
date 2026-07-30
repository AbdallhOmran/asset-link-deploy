import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { BookingModalService } from '../../services/booking-modal.service';

@Component({
  selector: 'app-asset-dashboard',
  templateUrl: './asset-dashboard.component.html',
  styleUrls: ['./asset-dashboard.component.css'],
})
export class AssetDashboardComponent implements OnInit {
  assets: any[] = [];
  filteredAssets: any[] = [];
  paginatedAssets: any[] = [];
  isLoading = true;

  // Filter & Category State
  activeCategory = 'All';
  searchQuery = '';
  categories: { name: string; count: number }[] = [];

  // Dropdown Filter State
  isFilterOpen = false;
  filterType = 'name';
  filterOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Asset Code', value: 'assetCode' },
    { label: 'Location', value: 'location' },
    { label: 'Status', value: 'status' }
  ];

  // Pagination State
  currentPage = 1;
  pageSize = 6;

  constructor(private router: Router, private assetService: AssetService, private bookingModalService: BookingModalService) {}

  ngOnInit(): void {
    this.fetchAssets();
  }

  fetchAssets(): void {
    this.isLoading = true;
    if (this.searchQuery.trim()) {
      const queryParams: any = {};
      queryParams[this.filterType] = this.searchQuery;
      
      this.assetService.searchAssets(queryParams).subscribe({
        next: (res: any) => {
          this.handleAssetResponse(res);
        },
        error: (err: any) => {
          console.error('Failed to search assets', err);
          this.isLoading = false;
        }
      });
    } else {
      this.assetService.getAssets().subscribe({
        next: (res: any) => {
          this.handleAssetResponse(res);
        },
        error: (err: any) => {
          console.error('Failed to load assets', err);
          this.isLoading = false;
        }
      });
    }
  }

  private handleAssetResponse(res: any): void {
    const rawAssets = Array.isArray(res) ? res : (res?.data ?? []);
    this.assets = rawAssets.map((a: any) => this.mapAssetToCard(a));
    // Default sort Newest to Oldest
    this.assets.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    this.buildCategories();
    this.applyFilters();
    this.isLoading = false;
  }

  buildCategories(): void {
    const counts: Record<string, number> = { All: this.assets.length };
    this.assets.forEach((a) => {
      const cat = a.category && a.category !== 'Uncategorized' ? a.category : 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    this.categories = Object.entries(counts).map(([name, count]) => ({ name, count }));
    // Sort categories (All first, then alphabetically)
    this.categories.sort((a, b) => {
      if (a.name === 'All') return -1;
      if (b.name === 'All') return 1;
      return a.name.localeCompare(b.name);
    });
  }

  selectCategory(catName: string): void {
    this.activeCategory = catName;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.fetchAssets();
  }

  toggleFilterDropdown(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  selectFilter(type: string): void {
    this.filterType = type;
    this.isFilterOpen = false;
    if (this.searchQuery.trim()) {
      this.fetchAssets();
    }
  }

  get currentFilterLabel(): string {
    return this.filterOptions.find(opt => opt.value === this.filterType)?.label || 'Filter';
  }

  applyFilters(): void {
    let result = [...this.assets];

    // Category Filter (Client-side over the fetched assets)
    if (this.activeCategory !== 'All') {
      result = result.filter(a => {
        const cat = a.category && a.category !== 'Uncategorized' ? a.category : 'Other';
        return cat === this.activeCategory;
      });
    }

    this.filteredAssets = result;
    this.updatePagination();
  }

  private mapAssetToCard(a: any): any {
    let img = '';
    if (a.assetImages && Array.isArray(a.assetImages) && a.assetImages.length > 0) {
      img = a.assetImages[0];
    } else if (typeof a.assetImages === 'string') {
      img = a.assetImages;
    } else if (a.images && Array.isArray(a.images) && a.images.length > 0) {
      img = a.images[0];
    } else if (typeof a.images === 'string') {
      img = a.images;
    } else if (a.image && typeof a.image === 'string') {
      img = a.image;
    }

    return {
      _id: a._id || a.id,
      name: a.assetName || 'Unnamed Asset',
      category: a.assetCategoryId?.assetCategoryName || a.category || 'Uncategorized',
      company: a.companyId?.companyName || a.company || 'No Company',
      code: a.assetCode || a.code || '—',
      location: a.location || 'Location not set',
      price: a.price?.daily ? `$${a.price.daily}/day` : (a.price ? `$${a.price}/day` : '$0/day'),
      weekly: a.price?.weekly ? `$${a.price.weekly}/wk` : '',
      monthly: a.price?.monthly ? `$${a.price.monthly}/mo` : '',
      status: a.status || 'Available',
      score: a.healthScore || a.score || 100,
      createdAt: a.createdAt,
      date: a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Available Now',
      image: img
    };
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAssets = this.filteredAssets.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredAssets.length / this.pageSize);
  }

  get showingCount(): number {
    return this.paginatedAssets.length;
  }

  goToAddAsset(): void {
    this.router.navigate(['/app/assets/add']);
  }
  
  goToAssetDetails(id: string): void {
    if (!id) return;
    this.router.navigate(['/app/assets/details', id]);
  }

  get totalAssets(): number {
    return this.assets.length;
  }

  get availableAssets(): number {
    return this.assets.filter((asset) => asset.status === 'Available').length;
  }

  bookNow(id: string): void {
    this.bookingModalService.openModal(id);
  }
}

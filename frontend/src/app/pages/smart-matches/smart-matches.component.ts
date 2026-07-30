import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { Router } from '@angular/router';
import { BookingModalService } from '../../services/booking-modal.service';

@Component({
  selector: 'app-smart-matches',
  templateUrl: './smart-matches.component.html',
  styleUrls: ['./smart-matches.component.css']
})
export class SmartMatchesComponent implements OnInit {
  assets: any[] = [];
  isLoading = true;
  error: string | null = null;
  activeTab = 'All Matches';

  tabs = ['All Matches', 'Available Now', 'Closest', 'Best Maintenance', 'Best Value'];

  constructor(private assetService: AssetService, private router: Router, private bookingModalService: BookingModalService) {}

  ngOnInit(): void {
    this.fetchMatches();
  }

  fetchMatches(): void {
    this.isLoading = true;
    this.error = null;
    
    let query: any = {};
    if (this.activeTab === 'Available Now') {
       // Filter logic or pass to backend
    }

    this.assetService.getRecommendedAssets(query).subscribe({
      next: (res: any) => {
        this.assets = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load smart matches.';
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.fetchMatches();
  }

  goToDetails(id: string): void {
    this.router.navigate(['/app/assets/details', id]);
  }

  bookNow(id: string): void {
    this.bookingModalService.openModal(id);
  }
}

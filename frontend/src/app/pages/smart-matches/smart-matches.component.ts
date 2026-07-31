import { Component, OnInit } from '@angular/core';
import { AssetService } from '../../services/asset.service';
import { Router } from '@angular/router';
import { BookingModalService } from '../../services/booking-modal.service';
import { WaitingListService } from '../../services/waiting-list.service';

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

  constructor(
    private assetService: AssetService, 
    private router: Router, 
    private bookingModalService: BookingModalService,
    private waitingListService: WaitingListService
  ) {}

  ngOnInit(): void {
    this.fetchMatches();
  }

  fetchMatches(): void {
    this.isLoading = true;
    this.error = null;
    
    let query: any = {};
    if (this.activeTab === 'Available Now') {
      // Backend does not natively have an 'onlyAvailable' flag, but if we don't pass anything it still returns both available and rented.
      // Wait, we can pass something to force it or we can just filter it on the frontend.
      // We will filter it after fetching.
    } else if (this.activeTab === 'Best Value') {
      query.priceType = 'daily';
      // Ideally backend would have a sort override, but since it sorts by score then price, it's generally best value.
    }

    this.assetService.getRecommendedAssets(query).subscribe({
      next: (res: any) => {
        let matchedAssets = res.data || [];
        
        // Client-side filtering for tabs
        if (this.activeTab === 'Available Now') {
          matchedAssets = matchedAssets.filter((a: any) => a.status === 'Available');
        } else if (this.activeTab === 'Best Maintenance') {
          matchedAssets.sort((a: any, b: any) => (b.healthScore || 0) - (a.healthScore || 0));
        }

        this.assets = matchedAssets;
        
        // Fetch waitlist counts
        this.assets.forEach(asset => {
          if (asset.status === 'Booked' || asset.status === 'Rented') {
            this.waitingListService.getWaitingListByAsset(asset._id).subscribe({
              next: (waitlist) => {
                asset.waitlistCount = waitlist.length;
              },
              error: (err) => console.error('Failed to fetch waitlist count', err)
            });
          }
        });

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

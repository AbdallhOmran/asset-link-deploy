import { Component, OnInit } from '@angular/core';
import { BookingModalService } from '../../../services/booking-modal.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  isBookingModalOpen = false;
  preselectedAssetId?: string;

  constructor(private bookingModalService: BookingModalService) {}

  ngOnInit(): void {
    this.bookingModalService.isOpen$.subscribe(isOpen => {
      this.isBookingModalOpen = isOpen;
    });

    this.bookingModalService.assetId$.subscribe(assetId => {
      this.preselectedAssetId = assetId;
    });
  }

  closeBookingModal(): void {
    this.bookingModalService.closeModal();
  }

  onBookingCreated(booking: any): void {
    // We could show a toast or notification here in the future
    this.bookingModalService.closeModal();
  }
}
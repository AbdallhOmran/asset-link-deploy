import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  isLoading = false;
  errorMessage = '';

  searchTerm = '';
  viewMode: 'list' | 'calendar' = 'list';

  columns = [
    { field: 'bookingCode', header: 'Booking ID' },
    { field: 'assetName', header: 'Asset' },
    { field: 'renterName', header: 'Renter' },
    { field: 'ownerName', header: 'Owner' },
    { field: 'totalPrice', header: 'Value' },
    { field: 'status', header: 'Status' },
  ];

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getCompanyBookings().subscribe({
      next: (companyRes: any) => {
        this.bookingService.getMyBookings().subscribe({
          next: (myRes: any) => {
            const all = [...(companyRes.bookings || []), ...(myRes.bookings || [])];
            const uniqueMap = new Map(all.map((b) => [b._id, b]));
            const merged = Array.from(uniqueMap.values());

            this.bookings = merged.map((b: any) => ({
              ...b,
              assetName: b.assetId?.assetName,
              renterName: b.companyId?.companyName,
              ownerName: b.ownerCompanyId?.companyName,
            }));

            this.applyFilter();
            this.isLoading = false;
          },
          error: (err) => this.handleError(err),
        });
      },
      error: (err) => this.handleError(err),
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredBookings = this.bookings;
      return;
    }
    this.filteredBookings = this.bookings.filter((b) =>
      [b.bookingCode, b.assetName, b.renterName, b.ownerName]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(term))
    );
  }

  toggleFilterPanel() {
    // TODO: wire up to app-filter-panel component once its API is confirmed
    console.log('Filter panel toggled');
  }

  handleError(err: any) {
    this.isLoading = false;
    this.errorMessage = err.error?.message || 'Failed to load bookings';
  }

  onBookingAction(booking: any) {
    console.log('View booking:', booking);
  }
}
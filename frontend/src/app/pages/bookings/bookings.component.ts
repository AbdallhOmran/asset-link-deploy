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
  isModalOpen = false; // ✅ new

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
    this.filteredBookings = !term
      ? this.bookings
      : this.bookings.filter((b) =>
          [b.bookingCode, b.assetName, b.renterName, b.ownerName]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(term))
        );
  }

  toggleFilterPanel() {
    console.log('Filter panel toggled');
  }

  handleError(err: any) {
    this.isLoading = false;
    this.errorMessage = err.error?.message || 'Failed to load bookings';
  }

  onBookingAction(booking: any) {
    console.log('View booking:', booking);
  }

  // ✅ new: modal handlers
  openNewBookingModal() {
    this.isModalOpen = true;
  }

  closeNewBookingModal() {
    this.isModalOpen = false;
  }

  onBookingCreated(newBooking: any) {
    // add it to the top of the table immediately, no full reload needed
    const enriched = {
      ...newBooking,
      assetName: newBooking.assetId?.assetName,
      renterName: newBooking.companyId?.companyName,
      ownerName: newBooking.ownerCompanyId?.companyName,
    };
    this.bookings = [enriched, ...this.bookings];
    this.applyFilter();
  }
}
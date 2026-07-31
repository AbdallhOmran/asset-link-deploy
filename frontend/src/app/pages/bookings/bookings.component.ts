import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookings: any[];
}

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

  // ===== Calendar view state =====
  calendarMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];

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
            this.buildCalendar();
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

  selectedBooking: any = null;

  onBookingAction(booking: any) {
    this.selectedBooking = booking;
  }

  closeModal() {
    this.selectedBooking = null;
  }

  // ✅ actually switches the view now (used with *ngIf in the template)
  setViewMode(mode: 'list' | 'calendar') {
    this.viewMode = mode;
    if (mode === 'calendar') {
      this.buildCalendar();
    }
  }

  // ===== Calendar logic =====

  get calendarMonthLabel(): string {
    return this.calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  prevMonth() {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() - 1, 1);
    this.buildCalendar();
  }

  nextMonth() {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + 1, 1);
    this.buildCalendar();
  }

  private buildCalendar() {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // start the grid from the Sunday before (or on) the 1st of the month
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    // end the grid on the Saturday after (or on) the last day of the month
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: CalendarDay[] = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const dayDate = new Date(cursor);
      days.push({
        date: dayDate,
        isCurrentMonth: dayDate.getMonth() === month,
        bookings: this.bookings.filter((b) => this.isDateWithinBooking(dayDate, b)),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    this.calendarDays = days;
  }

  private isDateWithinBooking(date: Date, booking: any): boolean {
    if (!booking.startDate || !booking.endDate) return false;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    // normalize to compare dates only, ignoring time
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return d >= s && d <= e;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }
}
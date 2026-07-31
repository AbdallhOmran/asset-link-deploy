import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NegotiationService } from '../../services/negotiation.service';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  negotiations: any[];
}

@Component({
  selector: 'app-negotiations',
  templateUrl: './negotiations.component.html',
})
export class NegotiationsComponent implements OnInit {
  companyId: string = '';
  myRole: 'ownerCompany' | 'renterCompany' = 'renterCompany';
  
  negotiations: any[] = [];
  filteredNegotiations: any[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  viewMode: 'list' | 'calendar' = 'list';

  // ===== Calendar view state =====
  calendarMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];

  columns = [
    { field: 'bookingCode', header: 'Negotiation ID' },
    { field: 'assetName', header: 'Asset' },
    { field: 'renterName', header: 'Renter' },
    { field: 'ownerName', header: 'Owner' },
    { field: 'totalPrice', header: 'Value' },
    { field: 'status', header: 'Status' },
  ];

  constructor(
    private negotiationService: NegotiationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      this.companyId = user.companyId;
      this.myRole = user.role === 'owner' ? 'ownerCompany' : 'renterCompany';
    }

    if (this.companyId) {
      this.loadNegotiations();
    }
  }

  loadNegotiations() {
    this.isLoading = true;
    this.errorMessage = '';

    this.negotiationService.getNegotiation(this.companyId).subscribe({
      next: (res: any) => {
        const rawNegotiations = res.data || res;
        this.negotiations = (Array.isArray(rawNegotiations) ? rawNegotiations : []).map((b: any) => ({
          ...b,
          assetName: b.assetId?.assetName,
          renterName: b.renterCompany?.companyName,
          ownerName: b.ownerCompany?.companyName,
          bookingCode: b.bookingId?.bookingCode || b._id
        }));

        this.applyFilter();
        this.buildCalendar();
        this.isLoading = false;
      },
      error: (err) => this.handleError(err),
    });
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredNegotiations = !term
      ? this.negotiations
      : this.negotiations.filter((b) =>
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
    this.errorMessage = err.error?.message || 'Failed to load negotiations';
  }

  onNegotiationAction(negotiation: any) {
    this.router.navigate(['/app/negotiation-room'], {
      queryParams: { negotiationId: negotiation._id }
    });
  }

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
        negotiations: this.negotiations.filter((n) => this.isDateWithinBooking(dayDate, n.bookingId)),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    this.calendarDays = days;
  }

  private isDateWithinBooking(date: Date, booking: any): boolean {
    if (!booking || !booking.startDate || !booking.endDate) return false;
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
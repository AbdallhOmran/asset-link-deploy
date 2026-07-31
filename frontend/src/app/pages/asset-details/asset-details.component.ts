import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetService } from '../../services/asset.service';
import { BookingModalService } from '../../services/booking-modal.service';
import { WaitingListService } from '../../services/waiting-list.service';
import { AuthService } from '../../services/auth.service';
import { TimelineStage } from '../../shared/components/timeline/timeline.component';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css'],
})
export class AssetDetailsComponent implements OnInit {
  assetId = '';
  asset: any = null;
  isLoading = true;
  error: string | null = null;
  showContactModal = false;

  /** Active tab index driven by shared app-tabs */
  activeTab = 0;
  tabs = ['Overview', 'Rental History', 'Maintenance', 'Specifications'];

  waitlistCount = 0;
  waitlistItems: any[] = [];
  isOwner = false;
  isWaitlistLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assetService: AssetService,
    private bookingModalService: BookingModalService,
    private waitingListService: WaitingListService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.assetId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.assetId) {
      this.load();
    } else {
      this.error = 'Invalid asset ID.';
      this.isLoading = false;
    }
  }

  load(): void {
    this.isLoading = true;
    this.error = null;
    this.assetService.getAssetDetails(this.assetId).subscribe({
      next: (res: any) => {
        this.asset = res?.data ?? res;
        this.isLoading = false;
        
        const currentCompany = this.authService.getCompany();
        const currentCompanyId = currentCompany?.id || currentCompany?._id;
        const assetCompanyId = this.asset?.companyId?._id || this.asset?.companyId;
        
        this.isOwner = !!(currentCompanyId && assetCompanyId && currentCompanyId === assetCompanyId);
        
        if (this.isOwner && !this.tabs.includes('Waitlist')) {
          this.tabs.push('Waitlist');
        }

        this.loadBookings();
        this.fetchWaitlist();
      },
      error: (err) => {
        this.error = err?.error?.message ?? 'Failed to load asset details.';
        this.isLoading = false;
      },
    });
  }

  fetchWaitlist(): void {
    this.isWaitlistLoading = true;
    this.waitingListService.getWaitingListByAsset(this.assetId).subscribe({
      next: (res) => {
        this.waitlistItems = res || [];
        this.waitlistCount = this.waitlistItems.length;
        this.isWaitlistLoading = false;
      },
      error: (err) => {
        console.error('Failed to load waitlist', err);
        this.isWaitlistLoading = false;
      }
    });
  }

  removeWaitlistItem(id: string): void {
    if (!confirm('Are you sure you want to remove this request from the waitlist?')) return;
    
    this.waitingListService.removeFromWaitingList(id).subscribe({
      next: () => {
        this.fetchWaitlist(); // Refresh list after removal
      },
      error: (err) => {
        console.error('Failed to remove waitlist item', err);
        alert('Failed to remove from waitlist.');
      }
    });
  }

  notifyFirstWaitlist(): void {
    if (!confirm('Notify the first company in the queue?')) return;
    
    this.waitingListService.notifyFirstWaitingCompany(this.assetId).subscribe({
      next: () => {
        alert('First company in the queue has been successfully notified!');
        this.fetchWaitlist(); // Refresh list to see updated status
      },
      error: (err) => {
        console.error('Failed to notify company', err);
        alert('Failed to notify company.');
      }
    });
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  get images(): string[] {
    return this.asset?.assetImages ?? [];
  }

  get assetCode(): string {
    return this.asset?.assetCode ?? '—';
  }

  get assetName(): string {
    return this.asset?.assetName ?? 'Asset Details';
  }

  get description(): string {
    return this.asset?.description ?? '—';
  }

  get location(): string {
    return this.asset?.location ?? '—';
  }

  get status(): string {
    return this.asset?.status ?? 'Available';
  }

  get isAvailable(): boolean {
    return this.status === 'Available';
  }

  get isRentedOrBooked(): boolean {
    return this.status === 'Booked' || this.status === 'Rented';
  }

  get buttonText(): string {
    if (this.isRentedOrBooked) {
      return 'Join Waitlist';
    }
    return this.isAvailable ? 'Book this Asset' : 'Unavailable';
  }

  bookNow(): void {
    if (this.assetId) {
      this.bookingModalService.openModal(this.assetId);
    }
  }

  toggleContactModal(): void {
    this.showContactModal = !this.showContactModal;
  }

  get categoryName(): string {
    return this.asset?.assetCategoryId?.assetCategoryName
      ?? this.asset?.category
      ?? '—';
  }

  get companyName(): string {
    return this.asset?.companyId?.companyName
      ?? this.asset?.company
      ?? '—';
  }

  get priceDaily(): number | null {
    return this.asset?.price?.daily ?? null;
  }

  get priceWeekly(): number | null {
    return this.asset?.price?.weekly ?? null;
  }

  get priceMonthly(): number | null {
    return this.asset?.price?.monthly ?? null;
  }

  get healthScore(): number {
    return this.asset?.healthScore ?? 0;
  }

  /** Rental history entries mapped to shared app-timeline stages */
  get rentalStages(): TimelineStage[] {
    const rentals: any[] = this.asset?.rentalHistory ?? [];
    return rentals.map((r, i) => ({
      id: r._id ?? i,
      title: r.renterName ?? `Rental #${i + 1}`,
      subtitle: r.status ?? '',
      date: r.startDate
        ? new Date(r.startDate).toLocaleDateString()
        : '',
      status: r.status === 'completed' ? 'completed' : 'active',
    }));
  }

  /** stat-card data — values from model */
  get statCards() {
    return [
      {
        title: 'Total Rentals',
        value: this.asset?.rentalHistory?.length || this.activeBookings?.length || 0,
        subtitle: 'completed'
      },
      {
        title: 'Hours Operated',
        value: this.asset?.usageHours || this.asset?.hoursOperated || 0,
        subtitle: 'lifetime hrs'
      },
      {
        title: 'Waitlist Queue',
        value: this.waitlistCount,
        subtitle: 'companies waiting'
      },
    ];
  }

  // ─── Dynamic Availability Calendar ───────────────────────────────────────

  activeBookings: any[] = [];
  currentMonthDate: Date = new Date();
  calendarDays: { date: Date, dayNum: number, isBooked: boolean, isPast: boolean, isOtherMonth: boolean }[] = [];
  monthName: string = '';

  loadBookings(): void {
    this.assetService.getAssetBookings(this.assetId).subscribe({
      next: (res: any) => {
        this.activeBookings = Array.isArray(res) ? res : (res.data || []);
        this.generateCalendar();
      },
      error: (err) => {
        console.error('Failed to load active bookings', err);
        this.generateCalendar();
      }
    });
  }

  generateCalendar(): void {
    const year = this.currentMonthDate.getFullYear();
    const month = this.currentMonthDate.getMonth();
    this.monthName = this.currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    this.calendarDays = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Padding for previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDayOfWeek; i++) {
      const d = new Date(year, month - 1, prevMonthLastDay - startingDayOfWeek + 1 + i);
      this.calendarDays.push(this.createCalendarDay(d, true, today));
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      this.calendarDays.push(this.createCalendarDay(d, false, today));
    }

    // Padding for next month to complete rows
    const remaining = 7 - (this.calendarDays.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        this.calendarDays.push(this.createCalendarDay(d, true, today));
      }
    }
  }

  createCalendarDay(d: Date, isOtherMonth: boolean, today: Date) {
    const isPast = d < today;
    
    let isBooked = false;
    for (const b of this.activeBookings) {
      const start = new Date(b.startDate);
      start.setHours(0,0,0,0);
      const end = new Date(b.endDate);
      end.setHours(23,59,59,999);
      if (d >= start && d <= end) {
        isBooked = true;
        break;
      }
    }

    return {
      date: d,
      dayNum: d.getDate(),
      isBooked: isBooked,
      isPast: isPast,
      isOtherMonth: isOtherMonth
    };
  }

  nextMonth(): void {
    this.currentMonthDate.setMonth(this.currentMonthDate.getMonth() + 1);
    this.generateCalendar();
  }

  prevMonth(): void {
    const today = new Date();
    // Prevent navigating before the current actual month
    if (this.currentMonthDate.getFullYear() === today.getFullYear() && 
        this.currentMonthDate.getMonth() === today.getMonth()) {
      return;
    }
    this.currentMonthDate.setMonth(this.currentMonthDate.getMonth() - 1);
    this.generateCalendar();
  }

  get canGoPrevMonth(): boolean {
    const today = new Date();
    return this.currentMonthDate.getFullYear() > today.getFullYear() || 
           (this.currentMonthDate.getFullYear() === today.getFullYear() && this.currentMonthDate.getMonth() > today.getMonth());
  }

  goBack(): void {
    this.router.navigate(['/app/dashboard']);
  }

  goToEdit(): void {
    this.router.navigate(['/app/assets/edit', this.assetId]);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}

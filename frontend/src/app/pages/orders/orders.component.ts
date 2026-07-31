import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  pendingOrders: any[] = [];
  isLoading = false;
  errorMessage = '';
  processingId: string | null = null;
  isAcceptModalOpen = false;
  selectedOrder: any = null;

  constructor(
    private bookingService: BookingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookingService.getCompanyBookings().subscribe({
      next: (res: any) => {
        const bookings = res.bookings || [];
        this.pendingOrders = bookings
          .filter((b: any) => b.status === 'Pending')
          .map((b: any) => ({
            ...b,
            assetName: b.assetId?.assetName,
            renterName: b.companyId?.companyName,
          }));
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to load orders';
      },
    });
  }

  openAcceptModal(order: any): void {
    this.selectedOrder = order;
    this.isAcceptModalOpen = true;
  }

  closeAcceptModal(): void {
    this.isAcceptModalOpen = false;
    this.selectedOrder = null;
  }

  onNegotiationStarted(res?: any): void {
    const bookingId = this.selectedOrder?._id;

    if (this.selectedOrder) {
      this.pendingOrders = this.pendingOrders.filter(
        (o) => o._id !== bookingId,
      );
    }

    this.closeAcceptModal();

    const negotiationObj =
      res?.data?.negotiation || res?.negotiation || res?.data || res;
    const negotiationId =
      negotiationObj?._id ||
      negotiationObj?.id ||
      (typeof negotiationObj === 'string' ? negotiationObj : null);

    const queryParams: any = {};
    if (negotiationId) {
      queryParams.id = negotiationId;
      queryParams.negotiationId = negotiationId;
    }
    if (bookingId) {
      queryParams.bookingId = bookingId;
    }

    this.router.navigate(['/app/negotiation-room'], { queryParams });
  }

  onOrderRejected(bookingId: string): void {
    this.pendingOrders = this.pendingOrders.filter((o) => o._id !== bookingId);
  }

  rejectOrder(order: any): void {
    this.processingId = order._id;
    this.bookingService
      .updateStatus(order._id, { status: 'Rejected' })
      .subscribe({
        next: () => {
          this.processingId = null;
          this.onOrderRejected(order._id);
        },
        error: (err) => {
          this.processingId = null;
          this.errorMessage =
            err.error?.message || err.error?.error || 'Failed to reject order';
        },
      });
  }
}

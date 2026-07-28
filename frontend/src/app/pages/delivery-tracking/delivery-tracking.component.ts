import { Component, OnInit } from '@angular/core';
import { DeliveryService } from '../../services/delivery.service';

@Component({
  selector: 'app-delivery-tracking',
  templateUrl: './delivery-tracking.component.html',
  styleUrls: ['./delivery-tracking.component.css'],
})
export class DeliveryTrackingComponent implements OnInit {
  deliveries: any[] = [];
  selectedDelivery: any = null;
  timeline: any[] = [];

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit(): void {
    this.loadDeliveryHistory();
  }

  loadDeliveryHistory(): void {
    this.deliveryService.getDeliveryHistory().subscribe({
      next: (response) => {
        this.deliveries = response;
        if (this.deliveries.length > 0) {
          if (this.selectedDelivery) {
            // البحث عن الشحنة المحددة حالياً للثبات عليها بعد التحديث
            const current = this.deliveries.find(
              (d) => d._id === this.selectedDelivery._id,
            );
            this.selectDelivery(current || this.deliveries[0]);
          } else {
            // اختيار أول شحنة فقط في أول مرة تفتح فيها الشاشة
            this.selectDelivery(this.deliveries[0]);
          }
        } else {
          this.selectedDelivery = null;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  selectDelivery(delivery: any): void {
    this.selectedDelivery = delivery;
    this.loadTimeline(delivery._id);
  }

  loadTimeline(id: string): void {
    this.deliveryService.getDeliveryTimeline(id).subscribe({
      next: (response) => {
        this.timeline = response;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateNextStatus(): void {
    if (!this.selectedDelivery) return;
    const statuses = ['Preparing', 'Picked Up', 'In Transit', 'Delivered'];
    const currentIndex = statuses.indexOf(this.selectedDelivery.status);

    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1];
      this.deliveryService
        .updateDeliveryStatus(this.selectedDelivery._id, nextStatus)
        .subscribe({
          next: () => {
            this.loadDeliveryHistory();
          },
          error: (err) => console.error(err),
        });
    }
  }

  getNextStatusText(): string {
    if (!this.selectedDelivery) return '';
    const statuses = ['Preparing', 'Picked Up', 'In Transit', 'Delivered'];
    const currentIndex = statuses.indexOf(this.selectedDelivery.status);
    return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : '';
  }
}

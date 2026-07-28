import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-delivery-progress',
  templateUrl: './delivery-progress.component.html',
  styleUrls: ['./delivery-progress.component.css'],
})
export class DeliveryProgressComponent implements OnChanges {
  @Input() delivery: any;
  @Input() timeline: any[] = [];

  deliverySteps: any[] = [];
  currentStep = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeline'] || changes['delivery']) {
      this.buildSteps();
    }
  }

  buildSteps(): void {
    const fixedStatuses = ['Preparing', 'Picked Up', 'In Transit', 'Delivered'];

    const icons: any = {
      Preparing: '📦',
      'Picked Up': '🚚',
      'In Transit': '📍',
      Delivered: '✓',
    };

    this.deliverySteps = fixedStatuses.map((statusName) => {
      const historyItem = (this.timeline || [])
        .slice()
        .reverse()
        .find((item: any) => item.status === statusName);

      let subText = '--';

      if (historyItem && historyItem.changedAt) {
        const dateObj = new Date(historyItem.changedAt);
        const formattedDate = dateObj.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const formattedTime = dateObj.toLocaleString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        subText = `${formattedDate} • ${formattedTime}`;
      }

      return {
        icon: icons[statusName] || '📦',
        label: statusName,
        subLabel: subText,
      };
    });

    if (this.delivery?.status) {
      const index = fixedStatuses.indexOf(this.delivery.status);
      if (this.delivery.status === 'Delivered') {
        this.currentStep = 4;
      } else {
        this.currentStep = index >= 0 ? index : 0;
      }
    }
  }
}

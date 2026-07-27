import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';

  @Input() company = '';
  @Input() code = '';
  @Input() location = '';

  @Input() price = '';
  @Input() weekly = '';
  @Input() monthly = '';

  @Input() date = '';
  @Input() status = 'Available';

  @Input() score = 98;

  @Input() bordered = true;

  get isAvailable(): boolean {
    return this.status === 'Available';
  }

  get priceValue(): string {
    return this.price.split('/')[0];
  }

  get priceUnit(): string {
    return this.price.includes('/') ? '/' + this.price.split('/')[1] : '';
  }

  get statusClass(): string {
    switch (this.status) {
      case 'Available':
        return 'bg-green-100 text-green-700';

      case 'Rented':
        return 'bg-blue-100 text-blue-700';

      case 'Inspection':
        return 'bg-yellow-100 text-yellow-700';

      case 'Maintenance':
        return 'bg-orange-100 text-orange-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  get bookButtonClass(): string {
    return this.isAvailable
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-slate-300 text-slate-600 cursor-not-allowed';
  }

  get buttonText(): string {
    return this.isAvailable ? 'Book Now' : 'Unavailable';
  }
}

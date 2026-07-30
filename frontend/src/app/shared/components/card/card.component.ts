import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() image = '';

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

  @Output() bookClick = new EventEmitter<void>();

  onBookClick(event: any) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    this.bookClick.emit();
  }

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

  get categoryIcon(): string {
    const cat = (this.subtitle || '').toLowerCase();
    if (cat.includes('excavator')) return 'tractor'; // or construction
    if (cat.includes('crane')) return 'hook';
    if (cat.includes('forklift')) return 'forklift'; // fallback to box or truck
    if (cat.includes('bulldozer')) return 'truck';
    if (cat.includes('compressor')) return 'wind';
    if (cat.includes('generator')) return 'zap';
    if (cat.includes('aerial')) return 'arrow-up-circle';
    return 'box';
  }

  get categoryColorClass(): string {
    const cat = (this.subtitle || '').toLowerCase();
    if (cat.includes('excavator')) return 'text-orange-400';
    if (cat.includes('crane')) return 'text-blue-400';
    if (cat.includes('forklift')) return 'text-yellow-400';
    if (cat.includes('bulldozer')) return 'text-amber-500';
    if (cat.includes('compressor')) return 'text-purple-400';
    if (cat.includes('generator')) return 'text-emerald-400';
    if (cat.includes('aerial')) return 'text-cyan-400';
    return 'text-indigo-400';
  }

  get categoryBgClass(): string {
    const cat = (this.subtitle || '').toLowerCase();
    if (cat.includes('excavator')) return 'bg-orange-500/10';
    if (cat.includes('crane')) return 'bg-blue-500/10';
    if (cat.includes('forklift')) return 'bg-yellow-500/10';
    if (cat.includes('bulldozer')) return 'bg-amber-500/10';
    if (cat.includes('compressor')) return 'bg-purple-500/10';
    if (cat.includes('generator')) return 'bg-emerald-500/10';
    if (cat.includes('aerial')) return 'bg-cyan-500/10';
    return 'bg-indigo-500/10';
  }
}

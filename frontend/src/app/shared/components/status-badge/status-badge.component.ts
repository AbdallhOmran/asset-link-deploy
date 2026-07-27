import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html'
})
export class StatusBadgeComponent {
  @Input() status: string = '';

  get statusClasses(): string {
    const s = this.status.toLowerCase();
    if (s === 'confirmed' || s === 'completed' || s === 'active') {
      return 'bg-green-100 text-green-800';
    }
    if (s === 'pending' || s === 'in progress' || s=== 'In Escrow') {
      return 'bg-orange-100 text-orange-800';
    }
    if (s === 'failed' || s === 'danger' || s === 'expired') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-slate-100 text-slate-800'; 
  }
}
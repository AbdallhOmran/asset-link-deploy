import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl border transition-all duration-150"
      [ngClass]="badgeStyle.classes"
    >
      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="badgeStyle.dotClass"></span>
      {{ badgeStyle.label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input() status: string = 'current';

  get badgeStyle(): { label: string; classes: string; dotClass: string } {
    switch (this.status?.toLowerCase()) {
      case 'current':
        return {
          label: 'Maintenance Current',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500'
        };
      case 'upcoming':
        return {
          label: 'Service Due Soon',
          classes: 'bg-amber-50 text-amber-700 border-amber-200',
          dotClass: 'bg-amber-500'
        };
      case 'in-progress':
        return {
          label: 'In Maintenance',
          classes: 'bg-blue-50 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-500 animate-pulse'
        };
      case 'overdue':
        return {
          label: 'Maintenance Overdue',
          classes: 'bg-red-50 text-red-700 border-red-200',
          dotClass: 'bg-red-500 animate-ping'
        };
      case 'completed':
        return {
          label: 'Completed',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500'
        };
      case 'scheduled':
        return {
          label: 'Scheduled',
          classes: 'bg-slate-100 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-500'
        };
      default:
        return {
          label: (this.status || '').toUpperCase(),
          classes: 'bg-slate-50 text-slate-600 border-slate-200',
          dotClass: 'bg-slate-400'
        };
    }
  }
}

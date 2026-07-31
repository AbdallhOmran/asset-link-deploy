import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }

  get classes(): string {
    const base =
      'items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-white text-text border border-border hover:bg-page',
      success: 'bg-success text-white hover:bg-success/90',
      danger: 'bg-white text-danger border border-danger hover:bg-danger-bg',
      ghost: 'bg-transparent text-primary hover:underline hover:bg-primary/5',
    };

    const display = this.fullWidth ? 'w-full flex' : 'inline-flex';

    return `${base} ${display} ${variants[this.variant]}`;
  }
}
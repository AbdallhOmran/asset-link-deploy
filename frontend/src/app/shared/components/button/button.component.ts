import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  // NEW: makes the button span the full width of its container,
  // matching the Figma design where buttons match input field width
  @Input() fullWidth = false;
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  get classes(): string {
    const base =
      'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-white text-text border border-border hover:bg-page',
      success: 'bg-success text-white hover:bg-success/90',
      danger: 'bg-white text-danger border border-danger hover:bg-danger-bg',
    };

    // NEW: 'w-full' + 'flex' (instead of inline-flex) makes it stretch
    // to the full width of the parent, e.g. matching a form's input width
    const width = this.fullWidth ? 'w-full flex' : 'inline-flex';

    return `${base} ${width} ${variants[this.variant]}`;
  }
}
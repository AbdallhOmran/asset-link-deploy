import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Continue';
  @Input() showCancelButton = true;
 @Input() showConfirmButton = true;
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() icon = '📄';
  @Output() closed = new EventEmitter<void>()
  @Output() cancel = new EventEmitter<void>();
@Output() confirm = new EventEmitter<void>();

get modalWidth(): string {
    switch (this.size) {
      case 'sm':
        return 'max-w-md';

      case 'md':
        return 'max-w-2xl';

      case 'lg':
        return 'max-w-3xl';

      case 'xl':
        return 'max-w-5xl';

      default:
        return 'max-w-3xl';
    }
  }
 closeModal(): void {
  this.isOpen = false;
  this.closed.emit();
}
  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.closeModal();
    }
  }
onCancel(): void {
  this.closeModal();
  this.cancel.emit();
}

onConfirm(): void {
  this.confirm.emit();
}
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.closeModal();
    }
  }
}

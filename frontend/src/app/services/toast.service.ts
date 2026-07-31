import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  show(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    this.toastSubject.next({ type, message });
  }

  showSuccess(message: string) {
    this.show('success', message);
  }

  showError(message: string) {
    this.show('error', message);
  }

  showWarning(message: string) {
    this.show('warning', message);
  }

  showInfo(message: string) {
    this.show('info', message);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {

  // 1. تعريف المتغيرات الناقصة
  isOpen: boolean = false;
  unreadCount: number = 2; // قيمة افتراضية للبدء
  notifications = [
    { id: 1, title: 'إشعار جديد', isRead: false },
    { id: 2, title: 'تم تحديث البيانات', isRead: false }
  ];

  // 2. تعريف الدوال الناقصة
  togglePopover(): void {
    this.isOpen = !this.isOpen;
  }

  markAsRead(notif: any): void {
    if (!notif.isRead) {
      notif.isRead = true;
      if (this.unreadCount > 0) {
        this.unreadCount--;
      }
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.unreadCount = 0;
  }

}
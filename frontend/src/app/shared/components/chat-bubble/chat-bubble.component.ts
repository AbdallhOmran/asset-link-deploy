import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * أنواع مرسل الرسالة
 */
export type ChatMessageSender = 'me' | 'other' | 'system';

/**
 * أنواع محتوى فقاعة المحادثة
 */
export type ChatMessageType = 'text' | 'offer';

/**
 * حالات عرض السعر
 */
export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired';

/**
 * تفاصيل عرض السعر المرفق بالرسالة
 */
export interface PriceOffer {
  id: string;
  amount: number;
  currency?: string;
  unit?: string;
  title?: string;
  details?: string;
  status: OfferStatus;
  canAction?: boolean;
}

/**
 * نموذج بيانات رسالة المحادثة
 */
export interface ChatMessage {
  id: string;
  sender: ChatMessageSender;
  senderName?: string;
  avatarUrl?: string;
  type: ChatMessageType;
  content?: string;
  offer?: PriceOffer;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

/**
 * حدث التفاعل مع عرض السعر
 */
export interface OfferActionEvent {
  action: 'accept' | 'reject' | 'counter';
  message: ChatMessage;
  offer: PriceOffer;
}

/**
 * ChatBubbleComponent - مكون فقاعات المحادثة والتفاوض
 * يعرض الرسائل النصية وعروض الأسعار التفاعلية مع دعم RTL واستجابة كاملة للشاشات.
 */
@Component({
  selector: 'app-chat-bubble',
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBubbleComponent {
  /** قائمة الرسائل المعروضة في المحادثة */
  @Input() messages: ChatMessage[] = [];

  /** إظهار صورة المستخدم والاسم افتراضيًا */
  @Input() showAvatar = true;

  /** إظهار حالة قراءة الرسالة (تم الإرسال / الاستلام / القراءة) */
  @Input() showStatus = true;

  /** نص زر قبول عرض السعر */
  @Input() acceptButtonText = 'قبول العرض';

  /** نص زر رفض عرض السعر */
  @Input() rejectButtonText = 'رفض العرض';

  /** نص زر تقديم عرض مضاد */
  @Input() counterButtonText = 'عرض مضاد';

  /** حدث عند النقر على أحد أزرار عرض السعر (قبول / رفض / عرض مضاد) */
  @Output() offerAction = new EventEmitter<OfferActionEvent>();

  /** حدث عند ضغط أزرار قبول العرض مباشرة */
  @Output() offerAccepted = new EventEmitter<ChatMessage>();

  /** حدث عند ضغط زر رفض العرض */
  @Output() offerRejected = new EventEmitter<ChatMessage>();

  /** حدث عند طلب تقديم عرض مضاد */
  @Output() counterOfferRequested = new EventEmitter<ChatMessage>();

  /** حدث عند النقر على الفقاعة ككل */
  @Output() messageClicked = new EventEmitter<ChatMessage>();

  /** التعامل مع إجراءات عرض السعر */
  onAcceptOffer(message: ChatMessage, event: Event): void {
    event.stopPropagation();
    if (!message.offer) return;
    this.offerAction.emit({ action: 'accept', message, offer: message.offer });
    this.offerAccepted.emit(message);
  }

  onRejectOffer(message: ChatMessage, event: Event): void {
    event.stopPropagation();
    if (!message.offer) return;
    this.offerAction.emit({ action: 'reject', message, offer: message.offer });
    this.offerRejected.emit(message);
  }

  onCounterOffer(message: ChatMessage, event: Event): void {
    event.stopPropagation();
    if (!message.offer) return;
    this.offerAction.emit({ action: 'counter', message, offer: message.offer });
    this.counterOfferRequested.emit(message);
  }

  onMessageClick(message: ChatMessage): void {
    this.messageClicked.emit(message);
  }

  /** الحصول على تسمية وتنسيق حالة عرض السعر */
  getOfferStatusBadge(status: OfferStatus): { label: string; bgClass: string; textClass: string } {
    switch (status) {
      case 'accepted':
        return { label: 'تم القبول', bgClass: 'bg-emerald-100 dark:bg-emerald-950/60', textClass: 'text-emerald-700 dark:text-emerald-400' };
      case 'rejected':
        return { label: 'مرفوض', bgClass: 'bg-rose-100 dark:bg-rose-950/60', textClass: 'text-rose-700 dark:text-rose-400' };
      case 'countered':
        return { label: 'تم تقديم عرض مضاد', bgClass: 'bg-amber-100 dark:bg-amber-950/60', textClass: 'text-amber-700 dark:text-amber-400' };
      case 'expired':
        return { label: 'منتهي الصلاحية', bgClass: 'bg-slate-100 dark:bg-slate-800', textClass: 'text-slate-600 dark:text-slate-400' };
      case 'pending':
      default:
        return { label: 'قيد الانتظار', bgClass: 'bg-blue-100 dark:bg-blue-950/60', textClass: 'text-blue-700 dark:text-blue-400' };
    }
  }
}

import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * حالة المرحلة في الخط الزمني
 */
export type TimelineStageStatus = 'completed' | 'active' | 'upcoming';

/**
 * اتجاه عرض الخط الزمني
 */
export type TimelineOrientation = 'horizontal' | 'vertical' | 'responsive';

/**
 * نموذج بيانات المرحلة الواحدة في الخط الزمني
 */
export interface TimelineStage {
  id: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  date?: string;
  icon?: string;
  status?: TimelineStageStatus;
  customData?: any;
}

/**
 * TimelineComponent - مكون الخط الزمني التفاعلي لمراحل الشحن والتسليم
 * يتكيف تلقائيًا على جميع الشاشات ويدعم RTL مع إمكانيات تخصيص عالية.
 */
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
  /** قائمة مراحل الخط الزمني */
  @Input() stages: TimelineStage[] = [];

  /** مؤشر المرحلة الحالية النشطة (0-indexed) */
  @Input() activeIndex = 0;

  /** اتجاه العرض: أفقي، رأسي، أو تفاعلي متكيف مع حجم الشاشة */
  @Input() orientation: TimelineOrientation = 'responsive';

  /** السماح بالضغط والتفاعل مع المراحل */
  @Input() isInteractive = true;

  /** إظهار التاريخ والوقت أسفل/بجانب العنوان */
  @Input() showDates = true;

  /** إظهار الوصف التفصيلي للمرحلة */
  @Input() showDescriptions = true;

  /** عنوان الخط الزمني (اختياري) */
  @Input() title?: string;

  /** حدث يُطلق عند اختيار مرحلة محددة */
  @Output() stageSelected = new EventEmitter<{ stage: TimelineStage; index: number }>();

  /** حساب حالة المرحلة بناءً على الـ activeIndex أو الـ status المعطى في النموج */
  getStageStatus(stage: TimelineStage, index: number): TimelineStageStatus {
    if (stage.status) {
      return stage.status;
    }
    if (index < this.activeIndex) {
      return 'completed';
    } else if (index === this.activeIndex) {
      return 'active';
    }
    return 'upcoming';
  }

  /** اختيار مرحلة عند الضغط */
  selectStage(stage: TimelineStage, index: number): void {
    if (!this.isInteractive) return;
    this.stageSelected.emit({ stage, index });
  }

  /** نسبة الإنجاز المئوية للخط الزمني */
  get completionPercentage(): number {
    if (!this.stages || this.stages.length <= 1) return 0;
    const completedCount = this.stages.filter((s, i) => this.getStageStatus(s, i) === 'completed').length;
    const hasActive = this.stages.some((s, i) => this.getStageStatus(s, i) === 'active');
    const addedProgress = hasActive ? 0.5 : 0;
    return Math.min(100, Math.round(((completedCount + addedProgress) / (this.stages.length - 1)) * 100));
  }
}

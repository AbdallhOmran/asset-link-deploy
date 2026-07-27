import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  CalendarDays,
  FileText,
  MessageSquare,
  Truck,
  CreditCard,
  Building2,
  KeyRound,
} from 'lucide-angular';

import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { ButtonComponent } from './components/button/button.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { CardComponent } from './components/card/card.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ScoreWidgetComponent } from './components/score-widget/score-widget.component';
import { QrCodeWidgetComponent } from './components/qr-code-widget/qr-code-widget.component';
// import { ChatBubbleComponent } from './components/chat-bubble/chat-bubble.component';
import { TimelineComponent } from './components/timeline/timeline.component';
// import { FilterPanelComponent } from './components/filter-panel/filter-panel.component';
import { ModalComponent } from './components/modal/modal.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { DataTableComponent } from './components/data-table/data-table.component'; 
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { FileDropzoneComponent } from './components/file-dropzone/file-dropzone.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent,
    CardComponent,
    TabsComponent,
    StatCardComponent,
    ScoreWidgetComponent,
    QrCodeWidgetComponent,
    // ChatBubbleComponent,
    TimelineComponent,
    // FilterPanelComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent,
    DataTableComponent, 
    // AuthLayoutComponent,
    AuthLayoutComponent,
    StatusBadgeComponent,
    FileDropzoneComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LucideAngularModule.pick({
      LayoutDashboard,
      CalendarDays,
      FileText,
      MessageSquare,
      Truck,
      CreditCard,
      Building2,
      KeyRound,
    }),
  ],
  exports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ButtonComponent,
    StepperComponent,
    ImageGalleryComponent,
    CardComponent,
    TabsComponent,
    StatCardComponent,
    ScoreWidgetComponent,
    QrCodeWidgetComponent,
    // ChatBubbleComponent,
    TimelineComponent,
    // FilterPanelComponent,
    ModalComponent,
    PaginationComponent,
    DateRangePickerComponent,
    DataTableComponent, 
    // AuthLayoutComponent,
    AuthLayoutComponent,
    StatusBadgeComponent,
    FileDropzoneComponent,
    SidebarComponent
  ],
})
export class SharedModule {}
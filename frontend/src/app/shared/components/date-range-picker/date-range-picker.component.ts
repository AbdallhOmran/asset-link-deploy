import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent {
 @Input() startLabel = 'Start Date';
  @Input() endLabel = 'End Date';
  @Input() required = false;
  @Input() startDate = '';
  @Input() endDate = '';
  @Output() rangeChange = new EventEmitter<{
    start: string;
    end: string;
  }>();

  errorMessage = '';

  onStartDateChange(): void {

    if (this.endDate && this.startDate > this.endDate) {
      this.endDate = '';
    }

    this.validate();

  }

  onEndDateChange(): void {

    this.validate();

  }

  validate(): void {

    this.errorMessage = '';

    if (this.required) {

      if (!this.startDate || !this.endDate) {
        this.errorMessage = 'Both dates are required.';
        return;
      }

    }

    if (this.startDate && this.endDate) {

      if (this.endDate < this.startDate) {

        this.errorMessage =
          'End date must be after start date.';

        return;

      }

    }

    this.rangeChange.emit({
      start: this.startDate,
      end: this.endDate
    });

  }
}

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  QueryList,
  ViewChildren,
  forwardRef,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtpInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  @Input() length: number = 6;
  @Input() isInvalid: boolean = false;
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() completed = new EventEmitter<string>();

  @ViewChildren('otpInput') inputElements!: QueryList<ElementRef<HTMLInputElement>>;

  public digits: string[] = [];
  public activeIndex: number = 0;
  public Math = Math;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.initDigits();
  }

  ngOnChanges(): void {
    if (this.digits.length !== this.length) {
      this.initDigits();
    }
  }

  private initDigits(): void {
    this.digits = Array(this.length).fill('');
  }

  // --- ControlValueAccessor methods ---
  writeValue(value: string): void {
    if (value !== undefined && value !== null) {
      const valStr = String(value);
      this.digits = Array(this.length)
        .fill('')
        .map((_, i) => valStr[i] || '');
    } else {
      this.initDigits();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // --- UI Event Handlers ---
  onFocus(index: number): void {
    this.activeIndex = index;
    this.onTouched();
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let val = input.value;

    // Sanitize non-digits
    val = val.replace(/\D/g, '');

    if (val.length > 0) {
      // Take last entered character if multiple characters arrived
      const char = val.slice(-1);
      this.digits[index] = char;
      input.value = char;

      this.emitValue();

      // Auto-advance to next input
      if (index < this.length - 1) {
        this.focusInput(index + 1);
      }
    } else {
      this.digits[index] = '';
      this.emitValue();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (this.disabled) return;

    if (event.key === 'Backspace') {
      if (!this.digits[index] && index > 0) {
        // Current slot empty, clear previous slot and focus it
        this.digits[index - 1] = '';
        this.emitValue();
        this.focusInput(index - 1);
      } else {
        this.digits[index] = '';
        this.emitValue();
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (index > 0) {
        this.focusInput(index - 1);
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (index < this.length - 1) {
        this.focusInput(index + 1);
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    if (this.disabled) return;

    const pastedData = event.clipboardData?.getData('text') || '';
    const cleanDigits = pastedData.replace(/\D/g, '').slice(0, this.length);

    if (cleanDigits.length > 0) {
      for (let i = 0; i < this.length; i++) {
        this.digits[i] = cleanDigits[i] || '';
      }
      this.emitValue();

      // Focus slot after the last filled digit
      const targetIndex = Math.min(cleanDigits.length, this.length - 1);
      this.focusInput(targetIndex);
    }
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const inputsArr = this.inputElements.toArray();
      if (inputsArr[index]) {
        inputsArr[index].nativeElement.focus();
        inputsArr[index].nativeElement.select();
        this.activeIndex = index;
      }
    }, 0);
  }

  private emitValue(): void {
    const fullCode = this.digits.join('');
    this.onChange(fullCode);
    this.valueChange.emit(fullCode);

    if (fullCode.length === this.length) {
      this.completed.emit(fullCode);
    }
  }
}

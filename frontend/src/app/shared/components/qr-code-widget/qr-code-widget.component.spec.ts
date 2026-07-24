import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeWidgetComponent } from './qr-code-widget.component';

describe('QrCodeWidgetComponent', () => {
  let component: QrCodeWidgetComponent;
  let fixture: ComponentFixture<QrCodeWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QrCodeWidgetComponent]
    });
    fixture = TestBed.createComponent(QrCodeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

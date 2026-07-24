import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryEventLogComponent } from './delivery-event-log.component';

describe('DeliveryEventLogComponent', () => {
  let component: DeliveryEventLogComponent;
  let fixture: ComponentFixture<DeliveryEventLogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryEventLogComponent]
    });
    fixture = TestBed.createComponent(DeliveryEventLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryHeaderComponent } from './delivery-header.component';

describe('DeliveryHeaderComponent', () => {
  let component: DeliveryHeaderComponent;
  let fixture: ComponentFixture<DeliveryHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryHeaderComponent]
    });
    fixture = TestBed.createComponent(DeliveryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

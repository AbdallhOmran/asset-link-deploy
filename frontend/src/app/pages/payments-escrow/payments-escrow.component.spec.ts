import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsEscrowComponent } from './payments-escrow.component';

describe('PaymentsEscrowComponent', () => {
  let component: PaymentsEscrowComponent;
  let fixture: ComponentFixture<PaymentsEscrowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsEscrowComponent]
    });
    fixture = TestBed.createComponent(PaymentsEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

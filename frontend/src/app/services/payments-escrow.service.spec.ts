import { TestBed } from '@angular/core/testing';

import { PaymentsEscrowService } from './payments-escrow.service';

describe('PaymentsEscrowService', () => {
  let service: PaymentsEscrowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentsEscrowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

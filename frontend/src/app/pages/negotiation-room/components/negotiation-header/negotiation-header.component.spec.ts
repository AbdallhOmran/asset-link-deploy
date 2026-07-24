import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationHeaderComponent } from './negotiation-header.component';

describe('NegotiationHeaderComponent', () => {
  let component: NegotiationHeaderComponent;
  let fixture: ComponentFixture<NegotiationHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NegotiationHeaderComponent]
    });
    fixture = TestBed.createComponent(NegotiationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

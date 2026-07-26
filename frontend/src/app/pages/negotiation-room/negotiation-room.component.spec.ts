import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationRoomComponent } from './negotiation-room.component';

describe('NegotiationRoomComponent', () => {
  let component: NegotiationRoomComponent;
  let fixture: ComponentFixture<NegotiationRoomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NegotiationRoomComponent]
    });
    fixture = TestBed.createComponent(NegotiationRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

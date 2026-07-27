import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationChatComponent } from './negotiation-chat.component';

describe('NegotiationChatComponent', () => {
  let component: NegotiationChatComponent;
  let fixture: ComponentFixture<NegotiationChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NegotiationChatComponent]
    });
    fixture = TestBed.createComponent(NegotiationChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

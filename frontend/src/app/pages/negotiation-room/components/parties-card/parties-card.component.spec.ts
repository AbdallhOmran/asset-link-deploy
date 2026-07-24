import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartiesCardComponent } from './parties-card.component';

describe('PartiesCardComponent', () => {
  let component: PartiesCardComponent;
  let fixture: ComponentFixture<PartiesCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartiesCardComponent]
    });
    fixture = TestBed.createComponent(PartiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreWidgetComponent } from './score-widget.component';

describe('ScoreWidgetComponent', () => {
  let component: ScoreWidgetComponent;
  let fixture: ComponentFixture<ScoreWidgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoreWidgetComponent]
    });
    fixture = TestBed.createComponent(ScoreWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

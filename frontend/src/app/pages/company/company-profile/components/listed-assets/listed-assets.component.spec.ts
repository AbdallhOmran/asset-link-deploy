import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedAssetsComponent } from './listed-assets.component';

describe('ListedAssetsComponent', () => {
  let component: ListedAssetsComponent;
  let fixture: ComponentFixture<ListedAssetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListedAssetsComponent]
    });
    fixture = TestBed.createComponent(ListedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

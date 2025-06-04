import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateComponent_Admin } from './rate.component';

describe('RateComponent_Admin', () => {
  let component: RateComponent_Admin;
  let fixture: ComponentFixture<RateComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

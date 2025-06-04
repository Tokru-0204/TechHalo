import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionCodeComponent_Admin } from './promotion-code.component';

describe('PromotionCodeComponent_Admin', () => {
  let component: PromotionCodeComponent_Admin;
  let fixture: ComponentFixture<PromotionCodeComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionCodeComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionCodeComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

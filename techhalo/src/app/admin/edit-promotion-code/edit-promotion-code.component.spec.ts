import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPromotionCodeComponent_Admin } from './edit-promotion-code.component';

describe('EditPromotionCodeComponent_Admin', () => {
  let component: EditPromotionCodeComponent_Admin;
  let fixture: ComponentFixture<EditPromotionCodeComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPromotionCodeComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPromotionCodeComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromotionCodeComponent_Admin } from './add-promotion-code.component';

describe('AddProductComponent_Admin', () => {
  let component: AddPromotionCodeComponent_Admin;
  let fixture: ComponentFixture<AddPromotionCodeComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPromotionCodeComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromotionCodeComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

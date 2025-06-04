import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromotionProductsComponent_Admin } from './add-promotion-products.component';

describe('AddProductComponent_Admin', () => {
  let component: AddPromotionProductsComponent_Admin;
  let fixture: ComponentFixture<AddPromotionProductsComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPromotionProductsComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromotionProductsComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

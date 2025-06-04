import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent_Admin } from './product.component';

describe('ProductComponent_Admin', () => {
  let component: ProductComponent_Admin;
  let fixture: ComponentFixture<ProductComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

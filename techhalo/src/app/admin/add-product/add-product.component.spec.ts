import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponent_Admin } from './add-product.component';

describe('AddProductComponent_Admin', () => {
  let component: AddProductComponent_Admin;
  let fixture: ComponentFixture<AddProductComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

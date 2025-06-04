import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductComponent_Admin } from './edit-product.component';

describe('EditProductComponent_Admin', () => {
  let component: EditProductComponent_Admin;
  let fixture: ComponentFixture<EditProductComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

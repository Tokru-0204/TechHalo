import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplierComponent_Admin } from './edit-supplier.component';

describe('', () => {
  let component: EditSupplierComponent_Admin;
  let fixture: ComponentFixture<EditSupplierComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSupplierComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupplierComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

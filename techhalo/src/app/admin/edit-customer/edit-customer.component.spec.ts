import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerComponent_Admin } from './edit-customer.component';

describe('EditCustomerComponent_Admin', () => {
  let component: EditCustomerComponent_Admin;
  let fixture: ComponentFixture<EditCustomerComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCustomerComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCustomerComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerComponent_Admin } from './add-customer.component';

describe('AddCustomerComponent_Admin', () => {
  let component: AddCustomerComponent_Admin;
  let fixture: ComponentFixture<AddCustomerComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCustomerComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

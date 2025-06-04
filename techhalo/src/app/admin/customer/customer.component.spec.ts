import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerComponent_Admin } from './customer.component';

describe('CustomerComponent_Admin', () => {
  let component: CustomerComponent_Admin;
  let fixture: ComponentFixture<CustomerComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

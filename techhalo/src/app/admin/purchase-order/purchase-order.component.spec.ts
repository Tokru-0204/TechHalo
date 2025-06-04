import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderComponent_Admin } from './purchase-order.component';

describe('PurchaseOrderComponent_Admin', () => {
  let component: PurchaseOrderComponent_Admin;
  let fixture: ComponentFixture<PurchaseOrderComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

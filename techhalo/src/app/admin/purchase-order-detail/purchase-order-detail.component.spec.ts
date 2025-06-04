import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderDetailComponent_Admin } from './purchase-order-detail.component';

describe('PurchaseOrderDetailComponent_Admin', () => {
  let component: PurchaseOrderDetailComponent_Admin;
  let fixture: ComponentFixture<PurchaseOrderDetailComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderDetailComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrderDetailComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

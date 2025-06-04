import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent_Admin } from './order-detail.component';

describe('OrderDetailComponent_Admin', () => {
  let component: OrderDetailComponent_Admin;
  let fixture: ComponentFixture<OrderDetailComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDetailComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

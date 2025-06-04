import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent_Admin } from './order.component';

describe('OrderComponent_Admin', () => {
  let component: OrderComponent_Admin;
  let fixture: ComponentFixture<OrderComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

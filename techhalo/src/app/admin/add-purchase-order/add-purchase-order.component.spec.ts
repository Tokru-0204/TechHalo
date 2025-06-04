import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPurchaseOrderComponent_Admin } from "./add-purchase-order.component";

describe('AddPurchaseOrderComponent_Admin', () => {
  let component: AddPurchaseOrderComponent_Admin;
  let fixture: ComponentFixture<AddPurchaseOrderComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseOrderComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPurchaseOrderComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
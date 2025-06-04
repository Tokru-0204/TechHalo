import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddSupplierComponent_Admin } from "./add-supplier.component";

describe('AddSupplierComponent_Admin', () => {
  let component: AddSupplierComponent_Admin;
  let fixture: ComponentFixture<AddSupplierComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
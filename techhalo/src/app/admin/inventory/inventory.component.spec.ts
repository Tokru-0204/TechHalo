import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryComponent_Admin } from './inventory.component';

describe('InventoryComponent_Admin', () => {
  let component: InventoryComponent_Admin;
  let fixture: ComponentFixture<InventoryComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

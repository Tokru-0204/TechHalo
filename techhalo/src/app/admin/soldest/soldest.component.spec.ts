import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldestComponent_Admin } from './soldest.component';

describe('SoldestComponent_Admin', () => {
  let component: SoldestComponent_Admin;
  let fixture: ComponentFixture<SoldestComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoldestComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldestComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

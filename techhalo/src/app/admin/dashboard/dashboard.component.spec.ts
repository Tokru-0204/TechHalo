import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent_Admin } from './dashboard.component';

describe('DashboardComponent_Admin', () => {
  let component: DashboardComponent_Admin;
  let fixture: ComponentFixture<DashboardComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

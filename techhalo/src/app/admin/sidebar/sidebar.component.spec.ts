import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent_Admin } from './sidebar.component';

describe('SidebarComponent_Admin', () => {
  let component: SidebarComponent_Admin;
  let fixture: ComponentFixture<SidebarComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

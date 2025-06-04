import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent_Admin } from './header.component';

describe('HeaderComponent_Admin', () => {
  let component: HeaderComponent_Admin;
  let fixture: ComponentFixture<HeaderComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

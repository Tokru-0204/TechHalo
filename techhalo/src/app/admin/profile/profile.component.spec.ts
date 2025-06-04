import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent_Admin } from './profile.component';

describe('ProfileComponent_Admin', () => {
  let component: ProfileComponent_Admin;
  let fixture: ComponentFixture<ProfileComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

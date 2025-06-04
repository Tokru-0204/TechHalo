import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent_Admin } from './footer.component';

describe('FooterComponent_Admin', () => {
  let component: FooterComponent_Admin;
  let fixture: ComponentFixture<FooterComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

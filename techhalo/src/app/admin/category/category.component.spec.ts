import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryComponent_Admin } from './category.component';

describe('CategoryComponent_Admin', () => {
  let component: CategoryComponent_Admin;
  let fixture: ComponentFixture<CategoryComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

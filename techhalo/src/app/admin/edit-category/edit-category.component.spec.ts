import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryComponent_Admin } from './edit-category.component';

describe('EditCategoryComponent_Admin', () => {
  let component: EditCategoryComponent_Admin;
  let fixture: ComponentFixture<EditCategoryComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCategoryComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

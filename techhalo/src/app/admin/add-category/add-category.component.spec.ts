import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoryComponent_Admin } from './add-category.component';

describe('AddCategoryComponent_Admin', () => {
  let component: AddCategoryComponent_Admin;
  let fixture: ComponentFixture<AddCategoryComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCategoryComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoryComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

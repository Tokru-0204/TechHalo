import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalCategoryComponent_Admin } from './statistical-category.component';

describe('StatisticalCategoryComponent_Admin', () => {
  let component: StatisticalCategoryComponent_Admin;
  let fixture: ComponentFixture<StatisticalCategoryComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticalCategoryComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticalCategoryComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPromotionUsersComponent_Admin } from './add-promotion-users.component';

describe('AddProductComponent_Admin', () => {
  let component: AddPromotionUsersComponent_Admin;
  let fixture: ComponentFixture<AddPromotionUsersComponent_Admin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPromotionUsersComponent_Admin ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPromotionUsersComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

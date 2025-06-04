import { TestBed } from '@angular/core/testing';
import { SupplierComponent_Admin } from './supplier.component';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SupplierComponent_Admin', () => {
  let component: SupplierComponent_Admin;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupplierComponent_Admin],
      imports: [
        HttpClientTestingModule, // Nếu có dùng HttpClient
      ],
      providers: [
        {
          provide: ToastrService, // Thêm mock provider cho ToastrService
          useValue: {
            success: jasmine.createSpy('success'), // Mock hàm success
            error: jasmine.createSpy('error'), // Mock hàm error
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Nếu có các phần tử chưa được định nghĩa
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(SupplierComponent_Admin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

  import { Component, EventEmitter, Output } from '@angular/core';
  import { FormControl, FormGroup, Validators } from '@angular/forms';
  import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
  import { ToastrService } from 'ngx-toastr';
  import { PromotionCodeService } from '../../services_admin/promotion-code.service';
  import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

  // Validator cho giá trị tối thiểu
  export function minOrderValueValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value <= 0) {
        return { 'minOrderValueInvalid': 'Giá trị tối thiểu phải lớn hơn 0' }; // Lỗi nếu giá trị nhỏ hơn hoặc bằng 0
      }
      return null; // Không có lỗi nếu giá trị hợp lệ
    };
  }
  export function discountValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const type = control.root?.get('type')?.value;  // Lấy giá trị của 'type'
      const discount = control.value;

      if (type === 'percentage') {
        if (discount < 0 || discount > 100) {
          return { 'percentageRange': 'Giảm giá phải nằm trong khoảng từ 0 đến 100%' };
        }
      } else if (type === 'fixed') {
        if (discount <= 0) {
          return { 'fixedAmount': 'Giảm giá phải lớn hơn 0 VNĐ' };
        }
      }

      return null;
    };
  }
  // Validator cho maxUses, kiểm tra số lần sử dụng phải lớn hơn 0
  export function maxUsesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value <= 0) {
        return { 'maxUsesInvalid': 'Số lần sử dụng phải lớn hơn 0' };
      }
      return null;
    };
  }

  // Validator cho ngày kết thúc, phải sau ngày bắt đầu
  export function endDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.root?.get('startDate')?.value;
      const endDate = control.value;
      if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        return { 'endDateInvalid': 'Ngày kết thúc phải sau ngày bắt đầu' };
      }
      return null;
    };
  }
  @Component({
    selector: 'app-add-promotion-code',
    templateUrl: './add-promotion-code.component.html',
    styleUrls: ['./add-promotion-code.component.css']
  })
  export class AddPromotionCodeComponent_Admin {

    @Output() saveFinish = new EventEmitter<any>();

    postForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('percentage', [Validators.required]), 
      discount: new FormControl('', [Validators.required, Validators.min(0), discountValidator()]),  // Áp dụng validator
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(new Date(), [Validators.required, endDateValidator()]), 
      minOrderValue: new FormControl('', [Validators.required, minOrderValueValidator()]),  // Áp dụng minOrderValueValidator
      maxUses: new FormControl('', [Validators.required, maxUsesValidator()]),  // Áp dụng maxUsesValidator
      isActive: new FormControl(true)
    });

    constructor(
      private modalService: NgbModal,
      private promotionCodeService: PromotionCodeService,
      private toastr: ToastrService
    ) {}

    open(content: any) {
      this.modalService.open(content, { centered: true, size: 'lg' });
    }
    // Khi người dùng rời khỏi trường input, gọi markAsTouched
    onBlur(controlName: string) {
      const control = this.postForm.get(controlName);
      if (control) {
        control.markAsTouched();
      }
    }
    save() {
      if (this.postForm.valid) {
        this.promotionCodeService.create(this.postForm.value).subscribe(() => {
          this.toastr.success('Thêm mã khuyến mãi thành công!', 'Hệ thống');
          this.modalService.dismissAll();
          this.saveFinish.emit();
        }, () => {
          this.toastr.error('Thêm mã khuyến mãi thất bại!', 'Hệ thống');
        });
      }
    }
  }

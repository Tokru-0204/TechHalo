import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PromotionCode } from '../../common/promotions';
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
  selector: 'app-edit-promotion-code',
  templateUrl: './edit-promotion-code.component.html',
  styleUrls: ['./edit-promotion-code.component.css']
})
export class EditPromotionCodeComponent_Admin implements OnInit {

  @Input() id!: number;
  @Output() editFinish = new EventEmitter<any>();

  promotionCodeForm: FormGroup;
  promotionCode!: PromotionCode;

  constructor(
    private modalService: NgbModal,
    private promotionCodeService: PromotionCodeService,
    private toastr: ToastrService
  ) {
    this.promotionCodeForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      discount: new FormControl('', [Validators.required, Validators.min(0), discountValidator()]),  // Áp dụng validator
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(new Date(), [Validators.required, endDateValidator()]), 
      minOrderValue: new FormControl('', [Validators.required, minOrderValueValidator()]),  // Áp dụng minOrderValueValidator
      maxUses: new FormControl('', [Validators.required, maxUsesValidator()]),  // Áp dụng maxUsesValidator
      isActive: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.loadPromotionCode();
  }

  loadPromotionCode() {
    this.promotionCodeService.getOne(this.id).subscribe(data => {
      this.promotionCode = data;
      this.promotionCodeForm.patchValue(this.promotionCode);
    });
  }
  // Khi người dùng rời khỏi trường input, gọi markAsTouched
  onBlur(controlName: string) {
    const control = this.promotionCodeForm.get(controlName);
    if (control) {
      control.markAsTouched();
    }
  }

  update() {
    if (this.promotionCodeForm.valid) {
      this.promotionCodeService.update(this.id, this.promotionCodeForm.value).subscribe(() => {
        this.toastr.success('Cập nhật mã khuyến mãi thành công!', 'Hệ thống');
        this.modalService.dismissAll();
        this.editFinish.emit();
      }, () => {
        this.toastr.error('Cập nhật thất bại!', 'Hệ thống');
      });
    }
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}

import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/common/Customer';
import { CustomerService } from 'src/app/services/customer.service';
import { UploadService } from 'src/app/services/upload.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  customer!: Customer;
  selectedFile!: File;
  defaultImageUrl: string = 'https://res.cloudinary.com/veggie-shop/image/upload/v1633795994/users/mnoryxp056ohm0b4gcrj.png';
  image: string = this.defaultImageUrl;

  profileForm: FormGroup;

  @Output() profileUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private route: ActivatedRoute // Sử dụng ActivatedRoute để lấy userId từ URL
  ) {
    // Khởi tạo form với các trường cần thiết
    this.profileForm = new FormGroup({
      'userId': new FormControl(0),
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.minLength(6), Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'phone': new FormControl(null, [Validators.pattern('(0)[0-9]{9}'), Validators.required]),
      'gender': new FormControl(true),
      'registerDate': new FormControl(new Date()),
      'status': new FormControl(1),
      'token': new FormControl(null),
    });
  }

  ngOnInit(): void {
    // Lấy userId từ URL nếu không có giá trị truyền vào
    const userId = this.route.snapshot.paramMap.get('userId');
    if (userId) {
      this.loadCustomerData(+userId);
    } else {
      this.toastr.error('Không tìm thấy ID người dùng!', 'Hệ thống');
    }
  }

  loadCustomerData(userId: number) {
    this.customerService.getOne(userId).subscribe(
      (data) => {
        this.customer = data as Customer;
        this.profileForm.patchValue({
          'userId': this.customer.userId,
          'email': this.customer.email,
          'name': this.customer.name,
          'password': this.customer.password,
          'address': this.customer.address,
          'phone': this.customer.phone,
          'gender': this.customer.gender,
          'registerDate': this.customer.registerDate,
          'status': this.customer.status,
          'token': this.customer.token,
        });
        this.image = this.customer.image || this.defaultImageUrl;
      },
      (error) => {
        this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
        console.error('Chi tiết lỗi:', error);
      }
    );
  }

  updateProfile() {
    if (this.profileForm.valid) {
      const updatedCustomer = { ...this.profileForm.value, image: this.image };

      this.customerService.update(this.profileForm.get('userId')!.value, updatedCustomer).subscribe(
        () => {
          this.toastr.success('Cập nhật thành công!', 'Hệ thống');
          this.profileUpdated.emit('done');
          this.modalService.dismissAll();
        },
        (error) => {
          this.toastr.error('Lỗi cập nhật thông tin!', 'Hệ thống');
          console.error('Chi tiết lỗi:', error);
        }
      );
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
    }
  }

  openEditModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadCustomer(file).subscribe(
        (response) => {
          if (response && response.secure_url) {
            this.image = response.secure_url;
          }
        },
        (error) => {
          this.toastr.error('Lỗi tải lên hình ảnh!', 'Hệ thống');
          console.error('Chi tiết lỗi:', error);
        }
      );
    }
  }
}

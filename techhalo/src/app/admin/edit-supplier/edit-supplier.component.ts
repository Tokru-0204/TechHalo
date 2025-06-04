import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from '../../common/Supplier';
import { SupplierService } from '../../services_admin/supplier.service';
import { UploadService } from '../../services_admin/upload.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html',
  styleUrls: ['./edit-supplier.component.css']
})
export class EditSupplierComponent_Admin implements OnInit {
  postForm!: FormGroup; // Form chỉnh sửa nhà cung cấp
  supplier!: Supplier; // Nhà cung cấp hiện tại
  image: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg'; // Ảnh mặc định
  suppliers!: Supplier[]; // Danh sách nhà cung cấp
  @Input() id = 0; // Nhận ID nhà cung cấp từ component cha
  @Output() editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private supplierService: SupplierService,
    private uploadService: UploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm(); // Khởi tạo form rỗng
    this.getSupplier(); // Lấy dữ liệu nhà cung cấp
    this.loadSuppliers(); // Lấy danh sách nhà cung cấp để kiểm tra tên
  }

  // Khởi tạo form với các trường cần thiết
  private initializeForm(): void {
    this.postForm = new FormGroup({
      supplierId: new FormControl(0), // ID nhà cung cấp, mặc định là 0
      name: new FormControl(null, [Validators.required, Validators.minLength(2)]), // Tên nhà cung cấp
      address: new FormControl(null, [Validators.required, Validators.minLength(2)]), // Địa chỉ
      email: new FormControl(null, [Validators.required, Validators.email]), // Email
      phone: new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10,11}$')]), // Số điện thoại
      image: new FormControl(this.image), // Ảnh đại diện
      create_at: new FormControl(null) // Ngày tạo
    });
  }

  // Lấy thông tin nhà cung cấp theo ID
  getSupplier(): void {
    this.supplierService.getOne(this.id).subscribe(
      (data) => {
        this.supplier = data as Supplier;
        this.image = this.supplier.image || this.image; // Cập nhật ảnh hoặc giữ ảnh mặc định
        this.postForm.patchValue({
          supplierId: this.supplier.supplierId,
          name: this.supplier.name,
          address: this.supplier.address,
          email: this.supplier.email,
          phone: this.supplier.phone,
          image: this.image,
          create_at: this.supplier.create_at
        });
      },
      (error) => {
        this.modalService.dismissAll();
        this.toastr.error('Lỗi! Không tìm thấy nhà cung cấp. ' + error, 'Hệ thống');
      }
    );
  }
    // Lấy tất cả nhà cung cấp để kiểm tra tên
    loadSuppliers(): void {
      this.supplierService.getAll().subscribe(
        (data) => {
          this.suppliers = <Supplier[]>data; // Giả sử dữ liệu trả về là một mảng các Supplier
        },
        (error) => {
          this.toastr.error('Lỗi khi tải nhà cung cấp!', 'Hệ thống');
        }
      );
    }
  
    // Kiểm tra xem tên nhà cung cấp đã tồn tại chưa
    isSupplierNameExist(name: string): boolean {
      return this.suppliers.some(supplier => supplier.name.toLowerCase() === name.toLowerCase() && supplier.supplierId !== this.id);
    }

  // Cập nhật thông tin nhà cung cấp
  update(): void {
    if (this.postForm.valid) {
      const supplierData = this.postForm.value;

      // Kiểm tra tên nhà cung cấp có tồn tại hay không
      if (this.isSupplierNameExist(supplierData.name)) {
        this.toastr.warning('Tên nhà cung cấp này đã tồn tại!', 'Thông báo');
        return;
      }

      // Gửi yêu cầu cập nhật nhà cung cấp
      this.supplierService.put(this.id, supplierData).subscribe(
        () => {
          this.modalService.dismissAll();
          this.toastr.success('Cập nhật thành công!', 'Hệ thống');
          this.editFinish.emit('done'); // Emit sự kiện để thông báo cập nhật hoàn tất
        },
        (error) => {
          this.toastr.error('Cập nhật thất bại! ' + error, 'Hệ thống');
        }
      );
    } else {
      this.toastr.error('Vui lòng kiểm tra lại thông tin!', 'Hệ thống');
    }
  }
  // Phương thức tải lên ảnh
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadService.uploadProduct(file).subscribe(
      (response) => {
        if (response && response.secure_url) {
          this.image = response.secure_url; // Cập nhật URL ảnh
          this.postForm.patchValue({ image: this.image }); // Gán URL vào form
        }
      },
      (error) => {
        this.toastr.error('Lỗi khi tải lên hình ảnh!', 'Hệ thống');
      }
    );
  }

  // Mở modal chỉnh sửa
  open(content: TemplateRef<any>): void {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}

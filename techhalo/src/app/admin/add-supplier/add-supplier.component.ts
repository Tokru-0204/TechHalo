import { Component, EventEmitter, OnInit, Output, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Supplier } from "src/app/common/Supplier";
import { SupplierService } from "src/app/services_admin/supplier.service";
import { UploadService } from "src/app/services_admin/upload.service";

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent_Admin implements OnInit {

  suppliers!: Supplier[]; // Danh sách nhà cung cấp
  postForm!: FormGroup; // Form thêm mới nhà cung cấp
  urls: string[] = []; // Danh sách URL ảnh tải lên
  image: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730081981/techhalo/pzjqsq33ethm4dsgxde8.jpg'; // Ảnh mặc định

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private supplierService: SupplierService,
    private uploadService: UploadService,
    private toastr: ToastrService
  ) {
    // Khởi tạo form
    this.initializeForm();
  }

  ngOnInit(): void {
    // Lấy tất cả nhà cung cấp khi component khởi tạo
    this.loadSuppliers();
  }

  // Phương thức khởi tạo hoặc làm mới form
  private initializeForm(): void {
    this.postForm = new FormGroup({
      'supplierId': new FormControl(0), // ID nhà cung cấp, mặc định là 0
      'image': new FormControl(this.image), // Ảnh đại diện
      'name': new FormControl(null, [Validators.required, Validators.minLength(2)]), // Tên nhà cung cấp
      'address': new FormControl(null, [Validators.required, Validators.minLength(2)]), // Địa chỉ
      'email': new FormControl(null, [Validators.required, Validators.email]), // Email
      'phone': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]{10,11}$')]), // Số điện thoại
      'create_at': new FormControl(new Date().toISOString().split('T')[0]) // Ngày tạo (mặc định là ngày hiện tại)
    });
  }

  // Mở modal
  open(content: TemplateRef<any>): void {
    this.initializeForm(); // Khởi tạo form
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  // Lưu thông tin nhà cung cấp
  save(): void {
    if (this.postForm.valid) {
      const supplierData = this.postForm.value;

      // Kiểm tra tên nhà cung cấp có tồn tại hay không
      if (this.isSupplierNameExist(supplierData.name)) {
        this.toastr.warning('Tên nhà cung cấp này đã tồn tại!', 'Thông báo');
        return;
      }

      // Gửi yêu cầu lưu nhà cung cấp
      this.supplierService.post(supplierData).subscribe(
        () => {
          this.modalService.dismissAll();
          this.toastr.success('Thêm nhà cung cấp thành công!', 'Hệ thống');
          this.saveFinish.emit('done'); // Emit sự kiện lưu thành công
          this.initializeForm(); // Làm mới form sau khi thêm thành công
          this.loadSuppliers(); // Lấy lại danh sách nhà cung cấp mới
        },
        (error) => {
          this.toastr.error('Thêm nhà cung cấp thất bại!', 'Hệ thống');
          console.error(error);
        }
      );
    } else {
      this.toastr.error('Vui lòng kiểm tra lại thông tin!', 'Hệ thống');
    }
  }

  // Lấy tất cả nhà cung cấp
  loadSuppliers(): void {
    this.supplierService.getAll().subscribe(
      (data) => {
        // Giả sử dữ liệu từ API là một mảng các Supplier
        this.suppliers = <Supplier[]>data; // Ép kiểu dữ liệu về Supplier[]
      },
      error => {
        this.toastr.error('Lỗi khi tải nhà cung cấp!', 'Hệ thống');
      }
    );
  }

  // Kiểm tra xem tên nhà cung cấp đã tồn tại chưa
  isSupplierNameExist(name: string): boolean {
    return this.suppliers.some(supplier => supplier.name.toLowerCase() === name.toLowerCase());
  }

  // Phương thức tải lên ảnh
  onFileSelect(event: any): void {
    const file = event.target.files[0]; // Lấy file người dùng chọn
    if (!file) return;

    // Kiểm tra xem file có phải là hình ảnh không
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Vui lòng chọn một file hình ảnh!', 'Hệ thống');
      return;
    }

    // Gửi file tới UploadService để tải lên
    this.uploadService.uploadProduct(file).subscribe(
      (response) => {
        if (response && response.secure_url) {
          this.image = response.secure_url; // Cập nhật URL ảnh
          this.postForm.patchValue({ image: this.image }); // Gán giá trị ảnh vào form
          this.urls.push(this.image); // Lưu URL vào danh sách
        }
      },
      (error) => {
        this.toastr.error('Lỗi khi tải lên hình ảnh!', 'Hệ thống');
        console.error(error);
      }
    );
  }

}

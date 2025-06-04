import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services_admin/category.service';
import Swal from 'sweetalert2';
import { Category } from '../../common/Category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent_Admin implements OnInit {

  postForm: FormGroup;

  categories: Category[] = []; // Danh sách các danh mục đã có

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private toastr: ToastrService) {
    this.postForm = new FormGroup({
      'categoryId': new FormControl(0),
      'categoryName': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'status': new FormControl(true)
    })
  }
  // Gọi service để lấy danh sách các danh mục
   loadCategories() {
    this.categoryService.getAll().subscribe(
      (data) => {
        // Giả sử dữ liệu từ API là một mảng các Category
        this.categories = <Category[]>data; // Ép kiểu dữ liệu về Category[]
      },
      error => {
        this.toastr.error('Lỗi khi tải danh mục!', 'Hệ thống');
      }
    );
  }

  // Kiểm tra xem tên danh mục có tồn tại không
  isCategoryNameExist(name: string): boolean {
    return this.categories.some(category => category.categoryName.toLowerCase() === name.toLowerCase());
  }
  ngOnInit(): void {
    this.loadCategories(); // Gọi ngay khi component được khởi tạo
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

    save() {
    if (this.postForm.valid) {
      const categoryName = this.postForm.value.categoryName;

      // Kiểm tra xem tên danh mục đã tồn tại chưa
      if (this.isCategoryNameExist(categoryName)) {
        this.toastr.warning('Tên danh mục này đã tồn tại!', 'Thông báo');
        return;
      }

      // Nếu không tồn tại, thực hiện thêm mới danh mục
      this.categoryService.post(this.postForm.value).subscribe(data => {
        this.modalService.dismissAll();
        this.toastr.success('Thêm thành công!', 'Hệ thống');
        this.saveFinish.emit('done');
        this.loadCategories(); // Lấy lại danh mục mới sau khi thêm
      }, error => {
        this.toastr.error('Thêm thất bại!', 'Hệ thống');
      });

      // Reset form
      this.postForm.reset({
        categoryId: 0,
        categoryName: null,
        status: true
      });
    } else {
      this.toastr.error('Thông tin không hợp lệ!', 'Hệ thống');
    }
  }

}

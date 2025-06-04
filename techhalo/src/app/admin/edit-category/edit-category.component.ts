import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../common/Category';
import { CategoryService } from '../../services_admin/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent_Admin implements OnInit {

  postForm: FormGroup;
  category!: Category;

  @Input() id = 0; // ID danh mục để lấy thông tin
  @Output() editFinish: EventEmitter<any> = new EventEmitter<any>();

  categories: Category[] = []; // Danh sách các danh mục đã có

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.postForm = new FormGroup({
      'categoryId': new FormControl(0),
      'categoryName': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'status': new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Tải danh sách danh mục khi khởi tạo component
    this.getCategory(); // Lấy thông tin danh mục cần chỉnh sửa
  }

  // Gọi API để lấy danh mục hiện tại
  getCategory() {
    this.categoryService.getOne(this.id).subscribe(
      (data) => {
        this.category = data as Category;
        // Cập nhật giá trị form với thông tin danh mục
        this.postForm = new FormGroup({
          'categoryId': new FormControl(this.category.categoryId),
          'categoryName': new FormControl(this.category.categoryName, [Validators.required, Validators.minLength(2)]),
          'status': new FormControl(this.category.status)
        });
      },
      (error) => {
        this.modalService.dismissAll();
        this.toastr.error('Lỗi! Không tìm thấy danh mục', 'Hệ thống');
      }
    );
  }

  // Lấy danh sách tất cả các danh mục
  loadCategories() {
    this.categoryService.getAll().subscribe(
      (data) => {
        this.categories = <Category[]>data; // Ép kiểu dữ liệu về Category[]
      },
      (error) => {
        this.toastr.error('Lỗi khi tải danh mục!', 'Hệ thống');
      }
    );
  }

  // Kiểm tra xem tên danh mục đã tồn tại chưa
  isCategoryNameExist(name: string): boolean {
    return this.categories.some(category => category.categoryName.toLowerCase() === name.toLowerCase() && category.categoryId !== this.id);
  }

  // Cập nhật danh mục
  update() {
    if (this.postForm.valid) {
      const categoryName = this.postForm.value.categoryName;

      // Kiểm tra xem tên danh mục đã tồn tại chưa
      if (this.isCategoryNameExist(categoryName)) {
        this.toastr.warning('Tên danh mục này đã tồn tại!', 'Thông báo');
        return;
      }

      // Nếu không tồn tại, thực hiện cập nhật danh mục
      this.categoryService.put(this.id, this.postForm.value).subscribe(
        (data) => {
          this.modalService.dismissAll();
          this.toastr.success('Cập nhật thành công!', 'Hệ thống');
          this.editFinish.emit('done');
        },
        (error) => {
          this.toastr.error('Cập nhật thất bại!', 'Hệ thống');
        }
      );
    } else {
      this.toastr.error('Thông tin không hợp lệ!', 'Hệ thống');
    }
  }

  // Mở modal chỉnh sửa
  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
}

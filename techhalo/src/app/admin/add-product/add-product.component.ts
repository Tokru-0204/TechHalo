import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../common/Category';
import { Product } from '../../common/Product';
import { CategoryService } from '../../services_admin/category.service';
import { ProductService } from '../../services_admin/product.service';
import { UploadService } from '../../services_admin/upload.service';
import { SupplierService } from 'src/app/services_admin/supplier.service';
import { PurchaseOrderService } from 'src/app/services_admin/purchase-order.service';
import { PurchaseOrderDetailsService } from 'src/app/services_admin/purchase-order-detail.service';
import { Supplier } from '../../common/Supplier';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent_Admin implements OnInit {

  product!: Product;

  selectedFiles: File[] = [];
  urls: string[] = [];
  purchaseOrderDetail: any = null; // Thông tin giá gốc
  quantityPurchaseOrderDetail: any = null; // Thông tin số lượng gốc


  // Declare image variables
  image: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730081981/techhalo/pzjqsq33ethm4dsgxde8.jpg';
  image2: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730081981/techhalo/pzjqsq33ethm4dsgxde8.jpg';
  image3: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730081981/techhalo/pzjqsq33ethm4dsgxde8.jpg';
  image4: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730081981/techhalo/pzjqsq33ethm4dsgxde8.jpg';
  image5: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730081981/techhalo/pzjqsq33ethm4dsgxde8.jpg';

  postForm: FormGroup;
  categories!: Category[];
  suppliers!: Supplier[];

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private purchaseOrderDetailsService: PurchaseOrderDetailsService,
    private toastr: ToastrService,

    private uploadService: UploadService) {
    this.postForm = new FormGroup({

      'productId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      // 'quantity': new FormControl(0, [Validators.min(0), Validators.required]),
      // 'originalPrice': new FormControl(null, [Validators.required]),
      // 'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      'supplierId': new FormControl(0),
      'categoryId': new FormControl(0),
      'status': new FormControl(1),
      'sold': new FormControl(0),
    })
  }

  ngOnInit(): void {
    this.getCategories();
    this.getSuppliers();
  }

  
  // Lấy thông tin giá gốc (từ PurchaseOrderDetail)
  loadPurchaseOrderDetail(productId: number) {
    this.purchaseOrderDetailsService.getPrice(productId).subscribe(data => {
      this.purchaseOrderDetail = data;
    });
  }

  // Lấy thông tin số lượng gốc (từ PurchaseOrderDetail)
  loadQuantityPurchaseOrderDetail(productId: number) {
    this.purchaseOrderDetailsService.getQuantity(productId).subscribe(data => {
      this.quantityPurchaseOrderDetail = data;
    });
  }

  save() {
    if (this.postForm.valid && this.urls.length === 5) {
      this.product = this.postForm.value;
      
      this.product.supplier = new Supplier(this.postForm.value.supplierId, '');
      this.product.category = new Category(this.postForm.value.categoryId, '');
      this.product.price = 0.0;
      this.product.quantity = 0;
      this.product.image = this.urls[0];
      this.product.image2 = this.urls[1];
      this.product.image3 = this.urls[2];
      this.product.image4 = this.urls[3];
      this.product.image5 = this.urls[4];
      console.log(this.product);
      this.productService.save(this.product).subscribe(data => {
        this.toastr.success('Thêm thành công!', 'Hệ thống');
        this.saveFinish.emit('done');
      })

    } else {
      this.toastr.error('Thêm thất bại! Bạn cần upload 5 hình.', 'Hệ thống');
    }
    this.resetForm();
    this.modalService.dismissAll();
  }

  resetForm() {
    this.postForm.reset({
      'productId': 0,
      'name': null,
      // 'quantity': this.product.quantity,
      //  'originalPrice': this.product.price,
      // 'price': null,
      'discount': null,
      'description': null,
      'enteredDate': new Date(),
      'supplierId': 1,
      'categoryId': 1,
      'status': 1,
      'sold': 0,
    });
    this.urls = [];
    this.image = '';
    this.image2 = '';
    this.image3 = '';
    this.image4 = '';
    this.image5 = '';
  }

  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  getSuppliers() {
    this.supplierService.getAllSup().subscribe(data => {
      this.suppliers = data as Supplier[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  onFileSelect(event: any, imageIndex: number) {
    const file = event.target.files[0];
    if (!file) return;
  
    this.uploadService.uploadProduct(file).subscribe(response => {
      if (response && response.secure_url) {
        switch (imageIndex) {
          case 1:
            this.image = response.secure_url;
            this.urls[0] = response.secure_url;
            break;
          case 2:
            this.image2 = response.secure_url;
            this.urls[1] = response.secure_url;
            break;
          case 3:
            this.image3 = response.secure_url;
            this.urls[2] = response.secure_url;
            break;
          case 4:
            this.image4 = response.secure_url;
            this.urls[3] = response.secure_url;
            break;
          case 5:
            this.image5 = response.secure_url;
            this.urls[4] = response.secure_url;
            break;
        }
      }
    }, error => {
      this.toastr.error('Lỗi khi tải lên hình ảnh.', 'Hệ thống');
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
}

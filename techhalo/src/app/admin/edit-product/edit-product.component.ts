import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../common/Category';
import { Product } from '../../common/Product';
import { CategoryService } from '../../services_admin/category.service';
import { ProductService } from '../../services_admin/product.service';
import { UploadService } from '../../services_admin/upload.service';
import { PurchaseOrderDetail } from 'src/app/common/PurchaseOrderDetail';
import { PurchaseOrderDetailsService } from 'src/app/services_admin/purchase-order-detail.service';
import { Supplier } from 'src/app/common/Supplier';
import { SupplierService } from 'src/app/services_admin/supplier.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent_Admin implements OnInit {

  product!: Product;

  selectedFiles: File[] = [];
  urls: string[] = [];
  // purchaseOrderDetail: any = null; 
  suppliers!: Supplier[];
  pushaseOrderDetail!: PurchaseOrderDetail[];


  // Declare image variables
  image: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg';
  image2: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg';
  image3: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg';
  image4: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg';
  image5: string = 'https://res.cloudinary.com/techhalo/image/upload/v1730101458/ry8qchrwe6iizswfcagi.jpg';
 
  postForm: FormGroup;
  categories!: Category[];

  priceOld: number = 0;

  isEditable = false; 
  
  @Input() id!: number;
  @Output() editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService, 
    private productService: ProductService, 
    private toastr: ToastrService, 
    private uploadService: UploadService,
    private supplierService: SupplierService,
    private purchaseOrderDetailService: PurchaseOrderDetailsService
  ) {
    this.postForm = new FormGroup({
      'productId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      'categoryId': new FormControl(1),
      'status': new FormControl(1),
      'sold': new FormControl(0),
      'supplierId': new FormControl(1)  // Initialize with the default supplier ID
    });
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProduct();
    this.getSuppliers();
  }



  getPurchaseOrderDetail(productId: number) {
    this.purchaseOrderDetailService.getAll().subscribe(data => {
      this.pushaseOrderDetail = data as PurchaseOrderDetail[];
  
      // Lọc ra giá của sản phẩm theo productId
      const productDetail = this.pushaseOrderDetail.find(item => item.product.productId === productId);
      if (productDetail) {
        // Gán giá trị price từ purchaseOrderDetail vào product
        this.priceOld = productDetail.price;
      }
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu chi tiết đơn hàng!', 'Hệ thống');
    });
  }
  
  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm F5!', 'Hệ thống');
    });
  }
  
  getSuppliers() {
    this.supplierService.getAllSup().subscribe(data => {
      this.suppliers = data as Supplier[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm F5!', 'Hệ thống');
    });
  }

  update() {
    if(this.postForm.valid) {
      this.product = this.postForm.value;
      
      // Set the supplier for the product based on the selected supplier ID from the form
      this.product.supplier = new Supplier(this.postForm.value.supplierId, '');

      // Assign image URLs
      this.product.category = new Category(this.postForm.value.categoryId, '');

     

      this.product.image = this.urls[0];
      this.product.image2 = this.urls[1];
      this.product.image3 = this.urls[2];
      this.product.image4 = this.urls[3];
      this.product.image5 = this.urls[4];
      
      this.productService.update(this.product, this.id).subscribe(data => {
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
        this.editFinish.emit('done');
      });
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
    }
    this.modalService.dismissAll();
  }
  getProduct() {
    console.log(this.id);
    this.productService.getOne(this.id).subscribe(data => {
      this.product = data as Product;
      
      // Tìm giá từ purchaseOrderDetail dựa trên productId
      this.getPurchaseOrderDetail(this.product.productId);
  
      // Initialize the form with the product data
      this.postForm = new FormGroup({
        'productId': new FormControl(this.product.productId),
        'name': new FormControl(this.product.name, [Validators.minLength(4), Validators.required]),
        'supplierId': new FormControl(this.product.supplier.supplierId),
        'quantity': new FormControl(this.product.quantity, [Validators.min(1), Validators.required]),
        'price': new FormControl(this.product.price, [Validators.required, Validators.min(1000)]),
        'discount': new FormControl(this.product.discount, [Validators.required, Validators.min(0), Validators.max(100)]),
        'description': new FormControl(this.product.description, Validators.required),
        'enteredDate': new FormControl(this.product.enteredDate),
        'categoryId': new FormControl(this.product.category.categoryId),
        'status': new FormControl(1),
        'sold': new FormControl(this.product.sold),
        'codeProduct': new FormControl(this.product.codeProduct)
      });
  
      // Set initial URLs for images
      this.urls = [
        this.product.image || '',
        this.product.image2 || '',
        this.product.image3 || '',
        this.product.image4 || '',
        this.product.image5 || '',
      ];
  
      // Set individual image variables for preview purposes
      this.image = this.urls[0];
      this.image2 = this.urls[1];
      this.image3 = this.urls[2];
      this.image4 = this.urls[3];
      this.image5 = this.urls[4];

    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu!', 'Hệ thống');
    });
  }

  onFileSelect(event: any, imageIndex: number) {
    const file = event.target.files[0];
    if (!file) return;
    
    this.uploadService.uploadProduct(file).subscribe(response => {
      if (response && response.secure_url) {
        // Update the image URL at the specified index
        this.urls[imageIndex - 1] = response.secure_url;
        
        // Set image variables to reflect the updated URL for preview purposes
        switch (imageIndex) {
          case 1:
            this.image = response.secure_url;
            break;
          case 2:
            this.image2 = response.secure_url;
            break;
          case 3:
            this.image3 = response.secure_url;
            break;
          case 4:
            this.image4 = response.secure_url;
            break;
          case 5:
            this.image5 = response.secure_url;
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

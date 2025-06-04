import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Supplier } from 'src/app/common/Supplier';
import { Category } from 'src/app/common/Category';
import { Product } from 'src/app/common/Product';
import { PurchaseOrderDetail } from 'src/app/common/PurchaseOrderDetail';
import { PurchaseOrderService } from 'src/app/services_admin/purchase-order.service';
import { SupplierService } from 'src/app/services_admin/supplier.service';
import { ProductService } from 'src/app/services_admin/product.service';
import { PurchaseOrder } from 'src/app/common/PurchaseOrder';
import { PurchaseOrderDetailsService } from 'src/app/services_admin/purchase-order-detail.service';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.css']
})
export class AddPurchaseOrderComponent_Admin implements OnInit {

  postForm!: FormGroup;
  purchaseOrderDetail!: PurchaseOrderDetail;
  products!: Product[]; // Danh sách sản phẩm
  suppliers!: Supplier[]; // Danh sách nhà cung cấp
  categories!: Category[]; // Danh sách danh mục
  purchaseOrders!: PurchaseOrder[]; // Danh sách đơn hàng nhập
  totalAmount: number = 0; // Tổng số tiền
  selectedSupplierId: number = 0; // ID nhà cung cấp được chọn

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public modalService: NgbModal,
    private purchaseOrderDetailsService: PurchaseOrderDetailsService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm(); 
    this.loadSuppliers(); 
    this.getPurchaseOrders(); 
    this.getProductBySupplier(this.selectedSupplierId);
  }

  private initializeForm(): void {
    this.postForm = new FormGroup({
      'supplierId': new FormControl(0),// Nhà cung cấp
      'purchaseOrderId': new FormControl(0),
      'productId': new FormControl(0),
      'quantity': new FormControl(null, [Validators.required, Validators.min(1)]), // Số lượng
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]), // Giá
      'totalMoney': new FormControl({ value: 0, disabled: true }), // Tổng tiền
      'create_at': new FormControl(new Date().toISOString().split('T')[0], [Validators.required]), // Ngày tạo
      'update_at': new FormControl(new Date().toISOString().split('T')[0]) // Ngày cập nhật
    });
  }

  private loadSuppliers(): void {
    this.supplierService.getAllSup().subscribe(
      (suppliers: Supplier[]) => {
        this.suppliers = suppliers;
      },
      error => {
        this.toastr.error('Lỗi khi tải nhà cung cấp!', 'Hệ thống');
        console.error(error);
      }
    );
  }

  private getPurchaseOrders(): void {
    this.purchaseOrderService.getAllPurchaseOrders().subscribe(
      (purchaseOrders: PurchaseOrder[]) => {
        this.purchaseOrders = purchaseOrders;
      },
      error => {
        this.toastr.error('Lỗi khi tải đơn hàng nhập!', 'Hệ thống');
        console.error(error);
      }
    );
  }

  save(): void {
    if (this.postForm.invalid) {
      this.toastr.warning('Vui lòng điền đầy đủ thông tin!', 'Hệ thống');
      return;
    }
  
    const { productId, supplierId, quantity, price } = this.postForm.value;
    console.log(this.postForm.value);
    // Gọi service để tạo chi tiết đơn hàng
    this.purchaseOrderDetailsService.create(productId, supplierId, quantity, price).subscribe(
      () => {
        this.toastr.success('Thêm chi tiết đơn hàng thành công!', 'Hệ thống');
        this.saveFinish.emit();
        this.products = [];
        this.resetForm();
      },
      error => {
        this.toastr.error('Lỗi khi thêm chi tiết đơn hàng!', 'Hệ thống');
        console.error(error);
      }
    );
  
  }
  
  
  resetForm(): void {
    this.postForm.reset({
      'purchaseOrderId': 0,
      'productId': 0,
      'supplierId': 0,
      'quantity': null,
      'price': null,
      'totalMoney': 0,
      'create_at': new Date().toISOString().split('T')[0],
      'update_at': new Date().toISOString().split('T')[0]
    });
  }


  // find product by supplier
getProductBySupplier(supplierId: number) {
  this.productService.getProductsByCompany(supplierId).subscribe(data => {
    this.products = data as Product[];
  }, error => {
    this.toastr.error('Lỗi khi tải sản phẩm!', 'Hệ thống');
    console.error(error);
  });
  console.log("dfdfdf",this.products);
}
onSupplierChange(event: Event): void {
  const selectedSupplierId = (event.target as HTMLSelectElement).value;
  this.selectedSupplierId = Number(selectedSupplierId);
  if (selectedSupplierId) {
    this.getProductBySupplier(Number(selectedSupplierId));
  }
}


//   getProducts() {
//     this.productService.getAllProducts().subscribe(data => {
//       this.products = data as Product[];
//     }, error => {
//       this.toastr.error('Lỗi khi tải sản phẩm!', 'Hệ thống');
//       console.error(error);
//   })
// }

  calculateTotal(): number {
    const quantity = this.postForm.get('quantity')?.value || 0;
    const price = this.postForm.get('price')?.value || 0;
    return quantity * price;
  }
  

  open(content: TemplateRef<any>): void {
    this.modalService.open(content, { centered: true });
  }

  closeModal(): void {
    this.modalService.dismissAll();
    this.resetForm();
  }
  
}

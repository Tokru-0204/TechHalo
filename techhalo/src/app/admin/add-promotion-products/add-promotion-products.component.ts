import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PromotionCodeService } from '../../services_admin/promotion-code.service';
import { ProductService } from '../../services_admin/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-promotion-products',
  templateUrl: './add-promotion-products.component.html',
  styleUrls: ['./add-promotion-products.component.css']
})
export class AddPromotionProductsComponent_Admin implements OnInit {
  @Input() promotionCodeId!: number;
  @Output() saveFinish = new EventEmitter<void>();
  
  addProductsForm: FormGroup;
  applyType = '';
  categories: any[] = [];
  suppliers: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  appliedDiscountProducts: any[] = [];
  
  constructor(
    public activeModal: NgbActiveModal,
    private promotionCodeService: PromotionCodeService,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    this.addProductsForm = new FormGroup({
      applyType: new FormControl('', Validators.required),
      categoryId: new FormControl(''),
      supplierId: new FormControl(''),
      productIds: new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.loadOptions();
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
    });
    if (this.promotionCodeId) {
      this.loadDiscountedProducts(this.promotionCodeId);
    }
  }

  loadDiscountedProducts(promotionCodeId: number) {
    this.promotionCodeService.getProductsByPromotionCode(promotionCodeId).subscribe(products => {
      this.appliedDiscountProducts = products;
      this.filteredProducts = this.filteredProducts.filter(product => 
        !products.some(p => p.productId === product.productId)
      );
      this.products = this.products.filter(product => 
        !products.some(p => p.productId === product.productId)
      );
    });
  }

  loadOptions() {
    this.productService.getCategories().subscribe(data => {
      this.categories = data;
    });

    this.productService.getSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }

  onApplyTypeChange() {
    this.applyType = this.addProductsForm.get('applyType')?.value || '';
    this.addProductsForm.patchValue({ categoryId: '', company: '', productIds: [] });
    this.filteredProducts = [];

    if (this.applyType === 'category') {
      const selectedCategoryId = this.addProductsForm.get('categoryId')?.value;
      if (selectedCategoryId) {
        this.loadProductsByCategory(selectedCategoryId);
      }
    } else if (this.applyType === 'supplier') {
      const selectedSupplierId = this.addProductsForm.get('supplierId')?.value;
      if (selectedSupplierId) {
        this.loadProductsByCompany(selectedSupplierId);
      }
    } else if (this.applyType === 'specific') {
      if (this.promotionCodeId) {
        this.productService.getAvailableProductsNotInPromotion(this.promotionCodeId).subscribe(products => {
          this.products = products;
          this.filteredProducts = products;
        });
      }
    }
  }

  onCategoryChange(event: Event): void {
    const selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.addProductsForm.patchValue({ categoryId: selectedCategoryId });
    if (selectedCategoryId) {
      this.loadProductsByCategory(Number(selectedCategoryId));
    }
  }

  onSupplierChange(event: Event): void {
    const selectedSupplierId = (event.target as HTMLSelectElement).value;
    this.addProductsForm.patchValue({ supplierId: selectedSupplierId });
    if (selectedSupplierId) {
      this.loadProductsByCompany(Number(selectedSupplierId));
    }
  }

  loadProductsByCategory(categoryId: number) {
    if (this.promotionCodeId) {
      this.productService.getAvailableProductsByCategory(categoryId, this.promotionCodeId).subscribe(products => {
        this.products = products;
        this.filteredProducts = products;
  
        const productIds = products.map(product => product.productId);
        this.addProductsForm.patchValue({ productIds });
      });
    }
  }
  

  loadProductsByCompany(supplierId: number) {
    if (this.promotionCodeId) {
    this.productService.getAvailableProductsByCompany(supplierId, this.promotionCodeId).subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
  
      const productIds = products.map(product => product.productId);
      this.addProductsForm.patchValue({ productIds });
    });
  }
}
  

  onSearchProducts(event: Event): void {
    const input = (event.target as HTMLInputElement).value || '';
    this.searchProducts(input);
  }

  searchProducts(query: string) {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  isProductSelected(productId: number): boolean {
    const selectedProductIds = this.addProductsForm.get('productIds')?.value || [];
    return selectedProductIds.includes(productId);
  }

  toggleProductSelection(productId: number) {
    const selectedProductIds = this.addProductsForm.get('productIds')?.value || [];
    const index = selectedProductIds.indexOf(productId);
    if (index > -1) {
      selectedProductIds.splice(index, 1);
    } else {
      selectedProductIds.push(productId);
    }
    this.addProductsForm.patchValue({ productIds: selectedProductIds });
    console.log('Selected Product IDs:', selectedProductIds);
  }

  applyProducts() {
    const applyType = this.addProductsForm.get('applyType')?.value;
    if (applyType === 'all') {
      this.applyAllProducts();
    } else if (applyType === 'category') {
      const categoryId = this.addProductsForm.get('categoryId')?.value;
      if (categoryId) {
        this.applyByCategory(Number(categoryId));
      } else {
        this.toastr.warning("Vui lòng chọn một loại sản phẩm.");
      }
    } else if (applyType === 'supplier') {
      const supplierId = this.addProductsForm.get('supplierId')?.value;
      if (supplierId) {
        this.applyByCompany(Number(supplierId));
      } else {
        this.toastr.warning("Hãy chọn một nhà cung cấp.");
      }
    } else if (applyType === 'specific') {
      const productIds = this.addProductsForm.get('productIds')?.value;
      if (productIds && productIds.length > 0) {
        this.applySpecificProducts(productIds);
      } else {
        this.toastr.warning("Vui lòng chọn ít nhất một sản phẩm.");
      }
    } else {
      this.toastr.warning("Vui lòng chọn một loại áp dụng.");
    }
  }

  applyAllProducts() {
    this.productService.getAllProducts().subscribe(products => {
        const allProductIds = products.map(product => product.productId);
        this.promotionCodeService.applyPromotionCodeToAllProducts(this.promotionCodeId, allProductIds)
            .subscribe(() => {
                this.toastr.success("Tất cả các sản phẩm được áp dụng khuyến mãi thành công.");
  
                this.loadDiscountedProducts(this.promotionCodeId);  

                this.filteredProducts = this.filteredProducts.filter(product => 
                  !allProductIds.includes(product.productId)
                );

                this.products = this.products.filter(product => 
                  !allProductIds.includes(product.productId)
                );

                this.saveFinish.emit(); 
            }, error => {
                this.toastr.error("Lỗi áp dụng toàn bộ sản phẩm vào khuyến mãi: " + error.message);
            });
    });
  }


  applyByCategory(categoryId: number) {
    const { productIds } = this.addProductsForm.value;
    const requestBody = productIds.length > 0 ? productIds : [];
    console.log(requestBody);

    this.promotionCodeService.applyProductsByCategory(this.promotionCodeId, requestBody)
      .subscribe(() => {
        this.toastr.success("Sản phẩm được áp dụng khuyến mãi thành công theo loại sản phẩm.");

        this.loadDiscountedProducts(this.promotionCodeId); 

        this.saveFinish.emit();  
      }, error => {
        this.toastr.error("Lỗi khi áp dụng sản phẩm theo loại sản phẩm: " + error.message);
      });
  }


  applyByCompany(supplierId: number) {
    // const productIds = this.addProductsForm.get('productIds')?.value || [];
    const { productIds } = this.addProductsForm.value;
    const requestBody = productIds.length > 0 ? productIds : [];
    console.log(requestBody);

    this.promotionCodeService.applyProductsByCompany(this.promotionCodeId, productIds)
      .subscribe(() => {
        this.toastr.success("Hãng sản xuất áp dụng thành công vào chương trình khuyến mãi.");
        
        this.loadDiscountedProducts(this.promotionCodeId); 

        this.saveFinish.emit();  

      }, error => {
        this.toastr.error("Lỗi áp dụng sản phẩm vào nhà cung cấp : " + error.message);
      });
  }


applySpecificProducts(productIds: number[]) {
  this.promotionCodeService.applySpecificProductsToPromotion(this.promotionCodeId, productIds)
    .subscribe(() => {
      this.toastr.success("Sản phẩm cụ thể được áp dụng khuyến mãi thành công.");
      
      this.loadDiscountedProducts(this.promotionCodeId); 

      this.saveFinish.emit(); 
    }, error => {
      this.toastr.error("Lỗi áp dụng sản phẩm cụ thể vào khuyến mãi: " + error.message);
    });
}

  removeProductFromPromotion(productId: number) {
    this.promotionCodeService.removeProductFromPromotion(this.promotionCodeId, productId)
      .subscribe(() => {
        this.appliedDiscountProducts = this.appliedDiscountProducts.filter(p => p.productId !== productId);
        this.toastr.success("Sản phẩm đã bị loại khỏi chương trình khuyến mãi.");
      }, error => {
        this.toastr.error("Không thể xóa sản phẩm khỏi chương trình khuyến mãi.");
      });
  }
  

  close() {
    this.activeModal.dismiss('cancelled');
  }
}

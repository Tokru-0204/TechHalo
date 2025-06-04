import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Cart } from '../../common/Cart';
import { CartDetail } from '../../common/CartDetail';
import { CartService } from '../../services/cart.service';
import { SessionService } from '../../services/session.service';
import { PromotionCodeService } from '../../services/promotions.service'; // Import the service
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyPromotionCartComponent } from '../apply-promotion-cart/apply-promotion-cart.component';
import { PromotionCode } from 'src/app/common/promotions'; // Import the PromotionCode interface
import { ChangeDetectorRef } from '@angular/core';
import { Product } from '../../common/Product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart!: Cart;
  cartDetail!: CartDetail;
  cartDetails!: CartDetail[];
  products!: Product[];

  discount!: number;
  amount!: number;
  amountReal!: number;
  discountCart!: number;
  originalAmount!: number;
  originalDiscount!: number;

  availablePromotions: any[] = [];  


  appliedPromotions: PromotionCode[] = []; 
  // usedPromotionIds: number[] = [];
  sharedPromotionIds: number[] = [];
  private navigatedFromCart = false;

  constructor(
    private cartService: CartService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService,
    private promotionService: PromotionCodeService, 
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    //
    // Lấy thông tin mã giảm giá đã áp dụng từ sessionStorage
     const storedPromotions = sessionStorage.getItem('appliedPromotions');
     this.appliedPromotions = storedPromotions ? JSON.parse(storedPromotions) : [];

    if (sessionStorage.getItem('isProductAdded') === 'true') {
        sessionStorage.removeItem('storedDiscount');
        sessionStorage.removeItem('storedDiscountCart');
        sessionStorage.removeItem('storedAmount');
        sessionStorage.removeItem('storedAmountReal');
        sessionStorage.removeItem('isProductAdded');  // Xóa cờ sau khi reset xong

        this.resetCartTotals(); // Reset the cart totals to avoid carrying over old values
        this.getAllItem(); // Reload cart items from the database
    } else {
        this.discount = parseFloat(sessionStorage.getItem('storedDiscount') || '0');
        this.discountCart = parseFloat(sessionStorage.getItem('storedDiscountCart') || '0');
        this.amount = parseFloat(sessionStorage.getItem('storedAmount') || '0');
        this.amountReal = parseFloat(sessionStorage.getItem('storedAmountReal') || '0');
    }
    
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.discount = 0;
    this.amount = 0;
    this.amountReal = 0;
    this.getAllItem();
    this.getUserPromotions(); 
  }
  ngOnDestroy(): void {
    if (!this.navigatedFromCart) {
      sessionStorage.removeItem('appliedPromotions');
      sessionStorage.removeItem('storedDiscount');
      sessionStorage.removeItem('storedDiscountCart');
      sessionStorage.removeItem('storedAmount');
      sessionStorage.removeItem('storedAmountReal');
      this.removeAllPromotions();
    }
  }

  resetCartTotals() {
    this.amountReal = 0;    
    this.amount = 0;        
    this.discountCart = 0;  
    this.discount = 0;      
    this.originalDiscount = 0;
  }

  getAllItem() {
    this.resetCartTotals();
    let email = this.sessionService.getUser();
    this.cartService.getCart(email).subscribe(data => {
      this.cart = data as Cart;
      this.cartService.getAllDetail(this.cart.cartId).subscribe(data => {


       



        this.cartDetails = data as CartDetail[];
        this.cartService.setLength(this.cartDetails.length);

        this.cartDetails.forEach(item => {
          let name = item.product.name.trim();
        
          // Tìm dấu '/' trong tên sản phẩm
          let firstSlashIndex = name.indexOf('/');
        
          // Nếu tìm thấy dấu '/' trong tên sản phẩm
          if (firstSlashIndex !== -1) {
            // Lấy phần trước dấu '/'
            let normalPart = name.substring(0, firstSlashIndex).trim();
        
            // Tìm dấu cách cuối cùng trong phần normalPart
            const lastSpaceIndex = normalPart.lastIndexOf(' ');
        
            // Cập nhật lại phần normalPart sau khi tìm dấu cách cuối cùng
            normalPart = name.substring(0, lastSpaceIndex).trim();
        
            // Phần styledPart là phần còn lại sau dấu cách cuối cùng
            let styledPart = name.substring(lastSpaceIndex).trim();
        
            // Cập nhật lại tên sản phẩm
            item.product.name = normalPart;
            item.product.styledPart = styledPart;
          } else {
            // Nếu không có dấu '/', chỉ có một phần normalPart
            item.product.name = name;
            item.product.styledPart = '';
          }
        
        });
     
        this.cartDetails.forEach(item => {
          this.amountReal += item.product.price * item.quantity;
          console.log('Cartasdasdsadasda:',item.product.price, item.discountProductCart);
          const itemDiscountedPrice = (item.product.price)  * (1 - item.product.discount / 100) ;
          console.log('taaaaaa',itemDiscountedPrice);
          this.amount += itemDiscountedPrice * item.quantity - item.discountProductCart;  
        });
        this.discount = this.amountReal - this.amount;  // Set amount to original total initially
     
        console.log('Cart details:1111111', this.amount, this.amountReal, this.discountCart, this.discount);

        this.applyStoredPromotions();

      sessionStorage.setItem('storedDiscount', JSON.stringify(this.discount));
      sessionStorage.setItem('storedDiscountCart', JSON.stringify(this.discountCart));
      sessionStorage.setItem('storedAmount', JSON.stringify(this.amount));
      sessionStorage.setItem('storedAmountReal', JSON.stringify(this.amountReal));
      this.originalDiscount = this.discount + this.discountCart;
        console.log('Cart details:', this.amount, this.amountReal, this.discountCart, this.discount, this.originalDiscount);
      });
    });
    
  }

  getUserPromotions() {
    let email = this.sessionService.getUser();
    this.promotionService.getUserPromotions(email).subscribe(promotions => {
      this.availablePromotions = promotions;
      console.log('Available promotions:', promotions); 
    }, error => {
      this.toastr.error('Lỗi khi lấy mã giảm giá', 'Hệ thống');
    });
  }

  update(id: number, quantity: number) {
    if (quantity < 1) {
      this.delete(id);
    } else {
      this.cartService.getOneDetail(id).subscribe(data => {
        this.cartDetail = data as CartDetail;
        this.cartDetail.quantity = quantity;
        this.cartDetail.price = (this.cartDetail.product.price * (1 - this.cartDetail.product.discount / 100)) * quantity;
        this.cartService.updateDetail(this.cartDetail).subscribe(data => {
          this.getAllItem(); 
        }, error => {
          this.toastr.error('Lỗi!' + error.status, 'Hệ thống');
        });
      }, error => {
        this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
      });
    }
  }

  delete(id: number) {
    Swal.fire({
      title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Xoá'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteDetail(id).subscribe(data => {
          this.toastr.success('Xoá thành công!', 'Hệ thống');
          this.getAllItem(); 
        }, error => {
          this.toastr.error('Xoá thất bại! ' + error.status, 'Hệ thống');
        });
      }
    });
  }

  openPromotionDialog() {
  // Lọc các promotion có form_of_application là 'All'
  const allPromotions = this.availablePromotions.filter(promotion => promotion.formOfApplication === 'All');
  console.log('All promotions:', allPromotions);

  const modalRef = this.modalService.open(ApplyPromotionCartComponent, { centered: true, size: 'lg' });
  modalRef.componentInstance.amount = this.amount; 
  modalRef.componentInstance.availablePromotions = allPromotions; // Mảng lọc chỉ chứa form_of_application = 'All'

  modalRef.componentInstance.applyPromotion.subscribe((promotion: PromotionCode) => {  
    this.applyPromotion(promotion);
  });
  }

  applyPromotion(promotion: PromotionCode) {
    if (!this.appliedPromotions.some(p => p.code === promotion.code)) {
      this.appliedPromotions.push(promotion);
      sessionStorage.setItem('appliedPromotions', JSON.stringify(this.appliedPromotions)); 
      this.applyDiscount(promotion);
    } else {
      this.toastr.warning('Mã giảm giá đã được áp dụng.', 'Hệ thống');
    }
  }
  applyDiscount(promotion: PromotionCode) {
    let discountAmount = 0;
    console.log('Applying promotion:fsdfa', this.discount);
    if (promotion.type === 'percentage') {
      discountAmount = (promotion.discount / 100) * this.amount;
    } else if (promotion.type === 'fixed') {
      discountAmount = promotion.discount;
    }
    this.discountCart += discountAmount; 
    this.amount -= discountAmount; 
    let discountAmountReal = this.discount + this.discountCart;
    //Lưu ID của mã dùng chung
    if (!this.sharedPromotionIds.includes(promotion.promotionCodeId)) {
        this.sharedPromotionIds.push(promotion.promotionCodeId);
    }

    // Lưu thông tin vào sessionStorage
    sessionStorage.setItem('sharedPromotionIds', JSON.stringify(this.sharedPromotionIds));
     sessionStorage.setItem('storedDiscount', JSON.stringify(this.discount));
     sessionStorage.setItem('storedDiscountCart', JSON.stringify(this.discountCart));
     sessionStorage.setItem('storedAmount', JSON.stringify(this.amount));
     sessionStorage.setItem('storedAmountReal', JSON.stringify(this.amountReal));
     this.originalDiscount = this.discount + this.discountCart;
    console.log('Discount after applying:fsdfsd', this.discount, this.discountCart, this.amount);
    this.cdRef.detectChanges();
  }
  
  removePromotion(code: string) {
    const index = this.appliedPromotions.findIndex(p => p.code === code);
    
    if (index > -1) {
      const removedPromotion = this.appliedPromotions.splice(index, 1)[0];

     // Xóa ID của mã dùng chung
     this.sharedPromotionIds = this.sharedPromotionIds.filter(id => id !== removedPromotion.promotionCodeId);
      
      // Reset discountCart and recalculate based on remaining applied promotions
      this.discountCart = 0;
      this.amount = this.amountReal - this.discount; // Reset to base amount after product discounts
      
      this.appliedPromotions.forEach(promotion => {
        if (promotion.type === 'percentage') {
          this.discountCart += (promotion.discount / 100) * this.amount;
        } else if (promotion.type === 'fixed') {
          this.discountCart += promotion.discount;
        }
      });

      // Calculate final amount after all promotions
      this.amount -= this.discountCart;
      console.log('Discount after removing:', this.discount, this.discountCart, this.amount);

      // Save updated values in session storage
      sessionStorage.setItem('appliedPromotions', JSON.stringify(this.appliedPromotions));
      sessionStorage.setItem('storedDiscount', JSON.stringify(this.discount));
      sessionStorage.setItem('storedDiscountCart', JSON.stringify(this.discountCart));
      sessionStorage.setItem('storedAmount', JSON.stringify(this.amount));
      this.originalDiscount = this.discount + this.discountCart;
      this.toastr.info(`Mã giảm giá "${removedPromotion.code}" đã được xoá.`, 'Thông báo');
        // Cập nhật sessionStorage
        sessionStorage.setItem('sharedPromotionIds', JSON.stringify(this.sharedPromotionIds));
      this.cdRef.detectChanges();
    }
}

  
  applyStoredPromotions() {
    this.discount = this.amountReal - this.amount;
    console.log('Discount before reapplying:', this.discount);
    this.discountCart = 0;
    this.appliedPromotions.forEach(promotion => {
      this.applyDiscount(promotion);
    });
  }

  onCheckoutClick() {
    this.navigatedFromCart = true;
    sessionStorage.setItem('sharedPromotionIds', JSON.stringify(this.sharedPromotionIds));
    
    sessionStorage.setItem('checkoutAmount', JSON.stringify(this.amount));
    sessionStorage.setItem('checkoutDiscount', JSON.stringify(this.discount));
    sessionStorage.setItem('checkoutDiscountCart', JSON.stringify(this.discountCart));
    sessionStorage.setItem('checkoutAmountReal', JSON.stringify(this.amountReal));

  }
  /// Sản phẩm
  openProductPromotionDialog(item: CartDetail) {
  
    this.promotionService.getPromotionsByProductId(item.product.productId).subscribe({
    next: (productPromotionIds) => {
      // Lọc availablePromotions thêm điều kiện nếu mã ID có trong productPromotionIds
      const allPromotions = this.availablePromotions.filter(promotion =>
        promotion.formOfApplication === 'Specific' &&
        productPromotionIds.includes(promotion.promotionCodeId) // Điều kiện đặc biệt từ API
      );
      console.log('All promotions:', allPromotions);
      

    const modalRef = this.modalService.open(ApplyPromotionCartComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.amount = item.price; // Gửi giá trị của sản phẩm sang
    modalRef.componentInstance.availablePromotions = allPromotions;

    modalRef.componentInstance.applyPromotion.subscribe((promotion: PromotionCode) => {
        this.applyPromotionToItem(item, promotion);
    });
  },
  error: (err) => {
    console.error('Lỗi khi lấy mã khuyến mãi từ API:', err);
  }
});
  }
    applyPromotionToItem(item: CartDetail, promotion: PromotionCode) {
      let discountAmount = 0;
      // Tính toán giảm giá
      if (promotion.type === 'percentage') {
          discountAmount = (promotion.discount / 100) * (item.product.price * (1-(item.product.discount / 100)));
      } else if (promotion.type === 'fixed') {
          discountAmount = promotion.discount;
      }

      // Cập nhật thông tin giảm giá
      item.discountProductCart = discountAmount;
      // item.price -= discountAmount;
      item.promotionCode = promotion;

      // Gọi API cập nhật giỏ hàng
      this.cartService.updateDetail(item).subscribe(() => {
          this.getAllItem(); // Reload lại giỏ hàng
          // this.toastr.success('Mã giảm giá đã được áp dụng.', 'Thông báo');
      }, error => {
          this.toastr.error('Không thể áp dụng mã giảm giá.', 'Lỗi');
      });

     
    }

    removePromotionFromItem(item: CartDetail) {
      const promotionCodeId = item.promotionCode?.promotionCodeId; // Lấy ID mã giảm giá
      item.discountProductCart = 0;
      item.promotionCode = null; // Xóa mã giảm giá

      // Gọi API để cập nhật
      this.cartService.updateDetail(item).subscribe(() => {
          this.getAllItem(); // Reload lại giỏ hàng
          this.toastr.info('Mã giảm giá đã được xóa.', 'Thông báo');
      }, error => {
          this.toastr.error('Không thể xóa mã giảm giá.', 'Lỗi');
      });
  }
  

  removeAllPromotions() {
    // Duyệt qua tất cả các sản phẩm trong giỏ hàng
    this.cartDetails.forEach((item) => {
        item.promotionCode = null; // Xóa mã giảm giá
        item.discountProductCart = 0; // Reset giảm giá
        // Gọi API để cập nhật giỏ hàng
        this.cartService.updateDetail(item).subscribe(
            () => {
                console.log(`Mã giảm giá của sản phẩm ${item.product.name} đã được xóa.`);
            },
            (error) => {
                console.error(`Lỗi khi xóa mã giảm giá cho sản phẩm ${item.product.name}:`, error);
            }
        );
    });

    // Sau khi xóa, cập nhật lại tổng tiền
    // this.updateTotal();
}

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PromotionCodeService } from 'src/app/services/promotions.service';
import { PromotionCode } from 'src/app/common/promotions';
import { CartService } from 'src/app/services/cart.service';  // Inject CartService

@Component({
  selector: 'app-apply-promotion-cart',
  templateUrl: './apply-promotion-cart.component.html',
  styleUrls: ['./apply-promotion-cart.component.css']
})
export class ApplyPromotionCartComponent implements OnInit {
  
  @Input() availablePromotions: PromotionCode[] = [];  
  
  //lay amount tu cart
  @Input() amount!: number;
  @Output() applyPromotion = new EventEmitter<PromotionCode>();  
  invalidPromotionId: number | null = null;  // Track invalid promotion
  appliedPromotions: PromotionCode[] = []; // Track applied promotions

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private promotionService: PromotionCodeService,
    private cartService: CartService
    
  ) {}

  ngOnInit(): void {
    const storedPromotions = sessionStorage.getItem('appliedPromotions');
    this.appliedPromotions = storedPromotions ? JSON.parse(storedPromotions) : [];
  }

  formatDate(date: string | Date): string {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;  // getMonth() is zero-based
    const year = formattedDate.getFullYear();
    
    const monthNames = ['th1', 'th2', 'th3', 'th4', 'th5', 'th6', 'th7', 'th8', 'th9', 'th10', 'th11', 'th12'];  // Vietnamese month names
    
    return `${day} ${monthNames[month - 1]} ${year}`;
  }

  isPromotionApplied(promotion: PromotionCode): boolean {
    return this.appliedPromotions.some(p => p.promotionCodeId === promotion.promotionCodeId);
  }
  
  isPromotionValid(promotion: PromotionCode): boolean {
    const today = new Date();
    const minOrderValue = promotion.minOrderValue;
    const currentUses = promotion.currentUses;
    const maxUses = promotion.maxUses;
   
    const amount = this.amount;
    console.log(amount);
   
    if (new Date(promotion.endDate) < today) {
        this.toastr.error("Mã giảm giá đã hết hạn!", "Lỗi");
        this.invalidPromotionId = promotion.promotionCodeId; 
        return false;
    }

    if (amount < minOrderValue) {
        this.toastr.error("Số tiền đơn hàng chưa đạt yêu cầu tối thiểu!", "Lỗi");
        this.invalidPromotionId = promotion.promotionCodeId;  
        return false;
    }
    if (currentUses >= maxUses) {
        this.toastr.warning("Số lần sử dụng mã giảm giá đã hết!", "Lỗi");
        this.invalidPromotionId = promotion.promotionCodeId;  
        return false;  
    }

    this.invalidPromotionId = null;
    return true; 
}

 
  onApplyPromotion(promotion: PromotionCode) {
    if (this.isPromotionValid(promotion)) {
      console.log(promotion);
      this.appliedPromotions.push(promotion); // Add to applied promotions
      sessionStorage.setItem('appliedPromotionCode', promotion.code); 
      sessionStorage.setItem('appliedPromotionId', promotion.promotionCodeId.toString());
      sessionStorage.setItem('appliedPromotionId', promotion.discount.toString()); 
      this.applyPromotion.emit(promotion);  
      this.modalService.dismissAll();
      this.toastr.success('Mã giảm giá đã được áp dụng!', 'Hệ thống');
    }
  }

  onClose() {
    this.modalService.dismissAll();
  }
}

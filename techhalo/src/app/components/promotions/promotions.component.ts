// src/app/components/promotions/promotions.component.ts

import { Component, OnInit } from '@angular/core';
import { PromotionCodeService } from '../../services/promotions.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css']
})
export class PromotionsComponent implements OnInit {

  promotionCodes: any[] = [];
  selectedPromotionCode: any = null;  // Selected promotion code

  constructor(
    private promotionCodeService: PromotionCodeService,
    private toastr: ToastrService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.loadPromotionCodes();
  }
  formatDate(date: string | Date): string {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate();
    const month = formattedDate.getMonth() + 1;  // getMonth() is zero-based
    const year = formattedDate.getFullYear();
    
    const monthNames = ['th1', 'th2', 'th3', 'th4', 'th5', 'th6', 'th7', 'th8', 'th9', 'th10', 'th11', 'th12'];  // Vietnamese month names
    
    return `${day} ${monthNames[month - 1]} ${year}`;
  }

  // Load promotion codes from the backend
  loadPromotionCodes() {
    this.promotionCodeService.getPromotionCodes().subscribe(
      (data) => {
        this.promotionCodes = data;
        this.checkUserAppliedPromotions();  // Check and mark saved promotions
      },
      (error) => {
        this.toastr.error("Không thể tải mã khuyến mãi.");
      }
    );
  }
  // Kiểm tra mã khuyến mãi đã hết hạn hoặc hết số lượng
  isExpiredOrOutOfStock(code: any): boolean {
    const currentDate = new Date();
    const endDate = new Date(code.endDate);

    // Kiểm tra nếu ngày hiện tại vượt qua ngày hết hạn hoặc số lượng còn lại < 1
    return endDate < currentDate || (code.maxUses - code.currentUses) < 1;
  }
  // Check if the logged-in user has already applied for any promotions
  checkUserAppliedPromotions() {
    const email = this.sessionService.getUser();  // Get email from session
    if (email) {
      // Get all promotions the user has applied for
      this.promotionCodeService.getUsersAppliedForPromotion(email).subscribe(
        (appliedPromotions: any[]) => {
          this.promotionCodes.forEach((promotion) => {
            // If the user has applied for the promotion, mark it as saved
            console.log(appliedPromotions);
            if (appliedPromotions.includes(promotion.promotionCodeId)) {
              promotion.saved = true;
            }
          });
        },
        (error) => {
          this.toastr.error('Lỗi kiểm tra khuyến mãi được áp dụng.');
        }
      );
    }
  }

  // Apply promotion to user and prevent form submission (page reload)
  applyPromotion(code: any, event: Event) {
    event.preventDefault();  // Prevent page reload and form submission

    const email = this.sessionService.getUser();  // Get email from session
    if (email) {
      this.promotionCodeService.savePromotionToUser(code.promotionCodeId, email).subscribe(
        (response: any) => {
          this.toastr.success('Khuyến mãi được lưu thành công!');
          code.saved = true;  // Mark it as saved (so the button text changes to "Đã lưu")
        },
        (error: any) => {
          this.toastr.error('Không thể lưu khuyến mãi.');
        }
      );
    } else {
      this.router.navigate(['/sign-form']); // Redirect to login if not logged in
    }
  }
}

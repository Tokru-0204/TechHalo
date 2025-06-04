import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromotionCodeService {

  private baseUrl = 'http://localhost:8080/api/promotionCodes'; // Đảm bảo URL chính xác

  constructor(private http: HttpClient) { }

  // Lấy danh sách mã khuyến mãi đang hoạt động
  getPromotionCodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`); 
  }

  // Get users who applied for a specific promotion based on email
  getUsersAppliedForPromotion(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/applied-promotions?email=${email}`);
  }
  

  savePromotionToUser(promotionCodeId: number, email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/save-promotion-to-user/${promotionCodeId}`, email);
  }

  getUserPromotions(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user-promotions?email=${email}`);
  }

   // Lấy mã khuyến mãi dựa trên mã giảm giá (code)
   getPromotionByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/code/${code}`);
  }

   // Xóa các mã giảm giá đã sử dụng và cập nhật current_uses
   removeUsedPromotions(email: string, promotionCodeIds: number[]): Observable<any> {
    const body = {
      email: email,
      promotionCodeIds: promotionCodeIds
    };
    return this.http.post<any>(`${this.baseUrl}/remove-used-promotions`, body);
  } 

  // Lấy danh sách mã khuyến mãi áp dụng cho sản phẩm
  getPromotionsByProductId(productId: number): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/product/${productId}`);
  }
}

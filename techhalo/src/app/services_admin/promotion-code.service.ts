// src/app/services/promotion-code.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { PromotionCode } from '../common/promotions';
import { catchError } from 'rxjs/operators';
import { Product } from '../common/Product';
import { User } from '../common/User';


@Injectable({
  providedIn: 'root'
})
export class PromotionCodeService {
  private baseUrl = 'http://localhost:8080/api/promotionCodes';

  constructor(private httpClient: HttpClient) {}

  // Lấy một mã khuyến mãi
  getOne(id: number): Observable<PromotionCode> {
    return this.httpClient.get<PromotionCode>(`${this.baseUrl}/${id}`);
  }

  // Tạo mới mã khuyến mãi
  create(promotionCode: PromotionCode): Observable<PromotionCode> {
    return this.httpClient.post<PromotionCode>(this.baseUrl, promotionCode);
  }

  // Update Promotion Code
  update(id: number, promotionCode: PromotionCode): Observable<PromotionCode> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.put<PromotionCode>(`${this.baseUrl}/${id}`, promotionCode, { headers });
  }

 // Lấy tất cả mã khuyến mãi đang hoạt động
  getAllActive(): Observable<PromotionCode[]> {
    return this.httpClient.get<PromotionCode[]>(this.baseUrl);
  }

  // Cập nhật trạng thái isActive về false
  deactivate(id: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${id}`, { isActive: false });
  }

  applyPromotionCodeToAllProducts(promotionCodeId: number, productIds: number[]): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${promotionCodeId}/apply-all-products`, productIds);
  }
  

  applyProductsByCategory(promotionCodeId: number, productIds: number[]): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${promotionCodeId}/apply-products-by-category`, productIds);
  }

  applyProductsByCompany(promotionCodeId: number, productIds: number[]): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${promotionCodeId}/apply-products-by-company`, productIds);
  }

  applySpecificProductsToPromotion(promotionCodeId: number, productIds: number[]): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${promotionCodeId}/apply-specific-products`, productIds);
  }

  getProductsByPromotionCode(promotionCodeId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/${promotionCodeId}/products`);
  }

  //User
  applyPromotionCodeToAllUsers(promotionCodeId: number): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${promotionCodeId}/apply-all-users`, {});
  }

  applyPromotionCodeToUsers(promotionCodeId: number, userIds: number[]): Observable<void> {
    return this.httpClient.post<void>(`${this.baseUrl}/${promotionCodeId}/apply-users`, userIds);
  }
  // Method to get users associated with a specific promotion code
  getUsersByPromotionCode(promotionCodeId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}/${promotionCodeId}/users`);
  }
  removeProductFromPromotion(promotionCodeId: number, productId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${promotionCodeId}/remove-product/${productId}`);
  }
  removeUserFromPromotion(promotionCodeId: number, userId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${promotionCodeId}/remove-user/${userId}`);
  }

}

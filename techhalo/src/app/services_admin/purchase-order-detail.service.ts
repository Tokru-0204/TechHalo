import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrderDetail } from '../common/PurchaseOrderDetail';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderDetailsService {
  private baseUrl = 'http://localhost:8080/api/purchase-order-details';

  constructor(private httpClient: HttpClient) {}

  // Lấy tất cả chi tiết đơn hàng
  getAll(): Observable<PurchaseOrderDetail[]> {
    return this.httpClient.get<PurchaseOrderDetail[]>(`${this.baseUrl}`);
  }

  getAllBySuplierId(supplierId: number): Observable<PurchaseOrderDetail[]> {
    return this.httpClient.get<PurchaseOrderDetail[]>(`${this.baseUrl}/supplier/${supplierId}`);
  }
  getPurchaseOrderDetailById(purchaseOrderDetailId: number): Observable<PurchaseOrderDetail>{
    return this.httpClient.get<PurchaseOrderDetail>(`${this.baseUrl}/${purchaseOrderDetailId}`);
  }
  
  // Lấy giá gốc theo productId
  getPrice(productId: number): Observable<PurchaseOrderDetail> {
    return this.httpClient.get<PurchaseOrderDetail>(`${this.baseUrl}/${productId}`);
  }

  // Lấy số lượng gốc theo productId
  getQuantity(productId: number): Observable<PurchaseOrderDetail> {
    return this.httpClient.get<PurchaseOrderDetail>(`${this.baseUrl}/${productId}`);
  }

  // Lấy chi tiết đơn hàng theo ID
  getById(id: number): Observable<PurchaseOrderDetail> {
    return this.httpClient.get<PurchaseOrderDetail>(`${this.baseUrl}/${id}`);
  }

  create(productId: number, supplierId: number, quantity: number, price: number): Observable<any> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('supplierId', supplierId.toString())
      .set('quantity', quantity.toString())
      .set('price', price.toString());
  
    return this.httpClient.post(`${this.baseUrl}`, null, { params });
  }
  

  // Cập nhật chi tiết đơn hàng
  update(id: number, purchaseOrderDetail: PurchaseOrderDetail): Observable<PurchaseOrderDetail> {
    return this.httpClient.put<PurchaseOrderDetail>(`${this.baseUrl}/${id}`, purchaseOrderDetail);
  }

  // Xóa chi tiết đơn hàng
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
  

  
}

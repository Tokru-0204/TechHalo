import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseOrder } from '../common/PurchaseOrder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  url = "http://localhost:8080/api/purchase-orders";
  constructor(private httpClient: HttpClient) { }
  
  getAll() {
    return this.httpClient.get(this.url);
  }
  addProductsToPurchaseOrder(purchaseOrderId: number, productIds: number[], quantity: number) {
    return this.httpClient.post(this.url + '/' + purchaseOrderId + '/products', { productIds, quantity });
  }

  getAllPurchaseOrders(): Observable<PurchaseOrder[]>{
    return this.httpClient.get<PurchaseOrder[]>(this.url);
  }

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  post(purchaseOrder: PurchaseOrder) {
    return this.httpClient.post(this.url, purchaseOrder);
  }

  put(id: number, purchaseOrder: PurchaseOrder) {
    return this.httpClient.put(this.url + '/' + id, purchaseOrder);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }
}

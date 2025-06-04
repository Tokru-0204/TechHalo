import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  url = "http://localhost:8080/api/orders";

  urlOrderDetail = "http://localhost:8080/api/orderDetail";

  constructor(private httpClient: HttpClient) { }

  get() {
    return this.httpClient.get(this.url);
  }

  getById(id:number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  getByOrder(id:number) {
    return this.httpClient.get(this.urlOrderDetail+'/order/'+id);
  }

  // Hủy đơn hàng
  cancel(id: number) {
    return this.httpClient.get(`${this.url}/cancel/${id}`);
  }

  // Xác nhận giao đơn hàng
  deliver(id: number) {
    return this.httpClient.get(`${this.url}/deliver/${id}`);
  }

  // Xác nhận thanh toán thành công
  confirm(id: number) {
    return this.httpClient.get(`${this.url}/confirm/${id}`);
  }

  // Đánh dấu đơn hàng đã giao thành công
  delivered(id: number) {
    return this.httpClient.get(`${this.url}/delivered/${id}`);
  }

  // Xác nhận đơn hàng
  confirmOrder(id: number) {
    return this.httpClient.get(`${this.url}/confirmOrder/${id}`);
  }
}

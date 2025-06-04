import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/Product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(this.url);
  }

  getLasted() {
    return this.httpClient.get(this.url+'/latest');
  }

  getBestSeller() {
    return this.httpClient.get(this.url+'/bestseller');
  }

  getRated() {
    return this.httpClient.get(this.url+'/rated');
  }

  getOne(id: number) {
    return this.httpClient.get(this.url+'/'+id);
  }

  getByCategory(id: number) {
    return this.httpClient.get(this.url+'/category/'+id);
  }

  getSuggest(categoryId: number, productId: number) {
    return this.httpClient.get(this.url+'/suggest/'+categoryId+"/"+productId);
  }

  getByKeyword(keyword: string, currentProductId: number) {
    // Tạo các tham số truy vấn
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('currentProductId', currentProductId.toString()); // Gửi ID sản phẩm hiện tại
  
    return this.httpClient.get(this.url + '/search', { params });
  }
  getProductsByCompany(supplierId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/supplier-product/${supplierId}`);
  }
  
}

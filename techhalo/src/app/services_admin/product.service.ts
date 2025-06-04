import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/Product';
import { Category } from '../common/Category';
import { map } from 'rxjs/operators'; // Import the map operator
import { Supplier } from '../common/Supplier';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = "http://localhost:8080/api/products";

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(this.url);
  }

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`http://localhost:8080/api/categories`);
  }
  getSuppliers(): Observable<Supplier[]> {
    return this.httpClient.get<Supplier[]>(`http://localhost:8080/api/suppliers`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/category-product/${categoryId}`);
  }
  getAvailableProductsByCategory(categoryId: number, promotionCodeId: number): Observable<Product[]> {
    const url = `${this.url}/category-product/${categoryId}/${promotionCodeId}`;
    return this.httpClient.get<Product[]>(url);
  }
  getProductsByCompany(supplierId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/supplier-product/${supplierId}`);
  }

  getAvailableProductsByCompany(supplierId: number, promotionCodeId: number): Observable<Product[]> {
    const url = `${this.url}/supplier-product/${supplierId}/${promotionCodeId}`;
    return this.httpClient.get<Product[]>(url);
  }

 //Gộp

  updateStatus(productId: number, status: boolean): Observable<void> {
    const url = `${this.url}/${productId}/status`;
    return this.httpClient.put<void>(url, { status });
  }

   // Lấy danh sách tất cả sản phẩm satus = 1 và cả = 0 
   getAllProduct() {
    return this.httpClient.get(this.url + '/allproduct');
  }
  

  getAvailableProductsNotInPromotion(promotionCodeId: number): Observable<Product[]> {
    const url = `${this.url}/available-products/${promotionCodeId}`;
    return this.httpClient.get<Product[]>(url);
  }






  getAll() {
    return this.httpClient.get(this.url);
  }
  

  getOne(id: number) {
    return this.httpClient.get(this.url + '/' + id);
  }

  getBestSeller() {
    return this.httpClient.get(this.url + '/bestseller-admin');
  }

  save(product: Product) {
    return this.httpClient.post(this.url, product);
  }

  update(product: Product, id: number) {
    return this.httpClient.put(this.url + '/' + id, product);
  }

  delete(id: number) {
    return this.httpClient.delete(this.url + '/' + id);
  }

  
}

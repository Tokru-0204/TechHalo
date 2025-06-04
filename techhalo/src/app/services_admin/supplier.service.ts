import { HttpClient } from "@angular/common/http";
import { Supplier } from "../common/Supplier";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SupplierService{
    url = "http://localhost:8080/api/suppliers";
    constructor(private httpClient: HttpClient) { }
    
    getAll() {
      return this.httpClient.get(this.url);
    }
    
    getAllSup(): Observable<Supplier[]> {
      return this.httpClient.get<Supplier[]>(this.url);
    }
    
  
    getOne(id: number): Observable<Supplier> {
      return this.httpClient.get<Supplier>(`${this.url}/${id}`);
    }
  
    post(supplier: Supplier) {
      return this.httpClient.post(this.url, supplier);
    }
  
    put(id: number, supplier: Supplier) {
      return this.httpClient.put(this.url + '/' + id, supplier);
    }
  
    delete(id: number) {
      return this.httpClient.delete(this.url + '/' + id);
    }
    
}
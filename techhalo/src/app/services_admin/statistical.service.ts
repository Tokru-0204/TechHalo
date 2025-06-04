import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticalService {

  url = 'http://localhost:8080/api/statistical';

  constructor(private httpClient: HttpClient) { }

  getByMothOfYear(year: number) {
    return this.httpClient.get(this.url + '/' + year);
  }
  
  getInventory() {
    return this.httpClient.get(this.url + '/get-inventory');
  }

  getCountYear() {
    return this.httpClient.get(this.url + '/countYear');
  }

  getAllOrderSuccess() {
    return this.httpClient.get(this.url + '/get-all-order-success');
  }

  getStatisticalBestSeller() {
    return this.httpClient.get(this.url + '/get-category-seller');
  }

  /////
  getRevenueByYear(year: number) {
    return this.httpClient.get<number>(`${this.url}/revenue/year/${year}`);
  }
  
  getRevenueByYearDetails(year: number) {
    return this.httpClient.get<any[]>(`${this.url}/revenue/year/${year}/details`);
  }
  
  getRevenueByMonth(year: number, month: number) {
    return this.httpClient.get<number>(`${this.url}/revenue/month/${year}/${month}`);
  }
  
  getRevenueByMonthDetails(year: number, month: number) {
    return this.httpClient.get<any[]>(`${this.url}/revenue/month/${year}/${month}/details`);
  }
  
  getRevenueByDay(year: number, month: number, day: number) {
    return this.httpClient.get<number>(`${this.url}/revenue/day/${year}/${month}/${day}`);
  }
  
  getRevenueByDayDetails(year: number, month: number, day: number) {
    return this.httpClient.get<any[]>(`${this.url}/revenue/day/${year}/${month}/${day}/details`);
  }
  
}

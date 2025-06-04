import { TestBed } from "@angular/core/testing";
import { PurchaseOrderDetailsService } from "./purchase-order-detail.service";

describe('PurchaseOrderDetailsService', () => {
  let service: PurchaseOrderDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseOrderDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
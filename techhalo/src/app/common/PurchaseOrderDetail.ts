import { Product } from "./Product";
import { PurchaseOrder } from "./PurchaseOrder";

export class PurchaseOrderDetail {

    'purchaseOrderDetailId': number;
    'quantity': number;
    'price': number;
    'totalMoney': number;
    'createAt_purchaseOrderDetail': Date;
    'purchaseOrder': PurchaseOrder;
    'product': Product;
    
    constructor(id: number) {
        this.purchaseOrderDetailId = id;
    }


}
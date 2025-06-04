
import { Product } from "./Product";
import { Supplier } from "./Supplier";

export class PurchaseOrder {
    
    'purchaseOrderId': number;
    'updateAt_purchaseOrder': Date;
    'createAt_purchaseOrder': Date;
    'product': Product;
    'supplier': Supplier;

    
    constructor(id: number){
        this.purchaseOrderId = id;
    }
}
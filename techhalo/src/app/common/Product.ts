import { Category } from "./Category";
import { Supplier } from "./Supplier";
import { PromotionCode } from "./promotions";

export class Product {
    'productId':number;
    'name':string;
    'quantity': number;
    'price': number;
    'discount':number;
    'image': string;
    'image2': string;
    'image3': string;
    'image4': string;
    'image5': string;
    'description': string;
    'enteredDate': Date;
    'supplier': Supplier;
    'category': Category;
    'status': boolean;
    'sold': number;
    'codeProduct': string;
    'promotionCodeId': any[];
    'promotionCodes': PromotionCode[];
    'normalPart': string;
    'styledPart': string;
    
    constructor(id:number) {
        this.productId = id;
    }
}

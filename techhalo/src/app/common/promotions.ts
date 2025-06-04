import { Product } from "./Product";

export class PromotionCode { 
   'promotionCodeId': number;
    'code': string;
    'description': string;
    'type': string;
    'discount': number;
    'startDate': string;
    'endDate': string;
    'minOrderValue': number;
    'maxUses': number;
    'currentUses': number;
    'isActive': boolean;
    'products'?: Product[]; // Thuộc tính này là tùy chọn
    'formOfApplication': string;
  }
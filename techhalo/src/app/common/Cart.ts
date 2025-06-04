import { Customer } from "./Customer";
import { CartDetail } from "./CartDetail";
import { PromotionCode } from "./promotions";

export class Cart {
    'cartId': number;
    'phone': string;
    'address': string;
    'amount': number;
    'discountCart': number;
    'user': Customer;
    cartDetails: CartDetail[] = []; 
    promotionCode?: PromotionCode;

    constructor(id:number) {
        this.cartId = id;
    }

    // Add a method to calculate the total amount
    getTotalAmount(): number {
        // Ensure cartDetails is properly initialized
        if (this.cartDetails && this.cartDetails.length > 0) {
            return this.cartDetails.reduce((total, detail) => total + detail.price, 0);
        }
        return 0;  // Return 0 if cartDetails is empty or not initialized
    }


}

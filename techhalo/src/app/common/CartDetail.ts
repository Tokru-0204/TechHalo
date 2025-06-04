import { Cart } from "./Cart";
import { Product } from "./Product";
import { PromotionCode } from "./promotions";

export class CartDetail {
    'cartDetailId': number;
    'quantity': number;
    'price': number;
    'discountProductCart': number;
    'product': Product;
    'cart': Cart;
    'promotionCode': PromotionCode | null; // Cho phép giá trị null

    constructor(id: number, quantity: number, price: number, product: Product, cart: Cart) {
        this.cartDetailId = id;
        this.quantity = quantity;
        this.price = price;
        this.product = product;
        this.cart = cart;
    }
}



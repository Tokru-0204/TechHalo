import { Role } from './Role';
import { PromotionCode } from './promotions';

export class User {
    'userId': number;
    'name': string;
    'email': string;
    'password': string;
    'phone': string;
    'address': string;
    'gender': boolean;
    'image': string;
    'registerDate': Date;
    'status': boolean;
    'token': string;
    'roles': Role[];
    'promotionCodes': PromotionCode[];
    
}
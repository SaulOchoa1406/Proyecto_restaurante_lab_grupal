import { Product } from "../services/product";

export interface OrderDetail {
    id:number;
    product:Product;
    amount:number;
    unit_price:number;
    subtotal:number;
}
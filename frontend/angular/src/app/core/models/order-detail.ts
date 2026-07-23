import { Product } from "./product";

export interface OrderDetail {
    id:number;
    order:number;
    product:Product;
    product_id?:number;
    amount:number;
    unit_price:number;
    subtotal:number;
}
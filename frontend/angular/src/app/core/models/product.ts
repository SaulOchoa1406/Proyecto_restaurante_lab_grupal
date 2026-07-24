import { Category } from "./category";

export interface Product {
    id:number;
    name:string;
    description:string;
    price:number;
    category:Category;
    category_id?:number;
    status:boolean;
}

export interface ProductPayLoad {
    name: string;
    description: string;
    price: number;
    category_id: number;
    active: boolean;
}
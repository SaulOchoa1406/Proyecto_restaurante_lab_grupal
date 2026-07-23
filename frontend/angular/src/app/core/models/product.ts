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
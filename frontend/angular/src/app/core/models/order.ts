import { Table } from "../services/table";
import { User } from "./user";
import { OrderDetail } from "./order-detail";

export interface Order {
    id:number,
    table:Table;
    waiter:User;
    customer_name:string;
    customer_dni:string;
    date:string;
    status:string;
    total:number;
    datails:OrderDetail[];
}
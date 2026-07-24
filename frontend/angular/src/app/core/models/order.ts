import { Table } from "./table";
import { User } from "./user";
import { OrderDetail } from "./order-detail";

export type OrderStatus = | 'PENDIENTE' | 'EN_PREPARACION' | 'LISTO' | 'ENTREGADO' | 'PAGADO' | 'CANCELADO';

export interface Order {
    id:number,
    table:Table;
    table_id?:number;
    waiter:User;
    customer_name:string;
    customer_dni:string;
    date:string;
    status:string;
    total:number;
    details:OrderDetail[];
}
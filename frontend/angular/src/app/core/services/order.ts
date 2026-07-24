import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../models/order';
import { OrderDetail } from '../models/order-detail';

@Injectable({
    providedIn: 'root'
})

export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly api = environment.apiUrl;

    list(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/pedidos/`);
    }

    get(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.api}/orders/pedidos/${id}/`);
    }

    getActiveByTable(mesaId: number): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.api}/orders/pedidos/?mesa=${mesaId}`);
    }

    create(tableId: number, customerName?: string, customerDni?: string): Observable<Order> {
        return this.http.post<Order>(`${this.api}/orders/pedidos/`, {
            table_id: tableId,
            customer_nombre: customerName ?? '',
            customer_dni: customerDni ?? '',
        });
    }

    updateCliente(id: number, data: { customer_name: string; customer_dni: string }): Observable<Order> {
        return this.http.patch<Order>(`${this.api}/orders/pedidos/${id}/`, data);
    }

    updateStatus(id: number, status: OrderStatus): Observable<Order> {
        return this.http.patch<Order>(`${this.api}/orders/pedidos/${id}/`, { status });
    }

    addItem(orderId: number, productId: number, amount: number): Observable<OrderDetail> {
        return this.http.post<OrderDetail>(`${this.api}/orders/detalles/`, {
            order: orderId,
            productId: productId,
            amount,
        });
    }

    removeItem(detailId: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/orders/detalles/${detailId}/`);
    }

    charge(id: number): Observable<Blob> {
        return this.http.post(`${this.api}/orders/pedidos/${id}/cobrar/`, {}, { responseType: 'blob' });
    }
}

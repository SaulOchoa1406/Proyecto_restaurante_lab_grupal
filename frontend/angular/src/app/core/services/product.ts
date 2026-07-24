import { inject, Injectable, Service } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { ProductPayload } from '../models/product';

@Injectable({
    providedIn: 'root'
})

export class ProductService {
    private readonly http = inject(HttpClient);
    private readonly api = environment.apiUrl;

    search(nombre: string): Observable<Product[]> {
        const params = nombre ? `?search=${encodeURIComponent(nombre)}` : '';
        return this.http.get<Product[]>(`${this.api}/inventory/productos/${params}`);
    }

    list(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.api}/inventory/productos/`);
    }

    create(data: ProductPayload): Observable<Product> {
        return this.http.post<Product>(`${this.api}/inventory/productos/`, data);
    }

    update(id: number, data: ProductPayload): Observable<Product> {
        return this.http.patch<Product>(`${this.api}/inventory/productos/${id}/`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/inventory/productos/${id}/`);
    }

    categories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.api}/inventory/categorias/`);
    }

    createCategory(nombre: string): Observable<Category> {
        return this.http.post<Category>(`${this.api}/inventory/categorias/`, { nombre });
    }
}

import { inject, Injectable, Service } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

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

    categories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.api}/inventory/categorias/`);
    }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Table } from '../models/table';

@Injectable({
    providedIn: 'root'
})
export class TableService {
    private readonly http = inject(HttpClient);
    private readonly api = environment.apiUrl;

    list(): Observable<Table[]> {
        return this.http.get<Table[]>(`${this.api}/tables/mesas/`);
    }

    get(id: number): Observable<Table> {
        return this.http.get<Table>(`${this.api}/tables/mesas/${id}/`);
    }

    create(numero: number): Observable<Table> {
        return this.http.post<Table>(`${this.api}/tables/mesas/`, { numero });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.api}/tables/mesas/${id}/`);
    }
}
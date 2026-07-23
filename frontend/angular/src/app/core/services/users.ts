import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CreateStaffUser, User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private readonly http = inject(HttpClient);
    private readonly api = environment.apiUrl;

    create(data: CreateStaffUser): Observable<User> {
        return this.http.post<User>(`${this.api}/accounts/users/`, data);
    }
}

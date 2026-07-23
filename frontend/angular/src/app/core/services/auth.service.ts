import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private http = inject(HttpClient);
    private api = environment.apiUrl;

    constructor() {}
    
    register(data: any): Observable<any> {
        return this.http.post(
            `${this.api}/accounts/register/`,
            data
        );
    }
    
    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(
            `${this.api}/accounts/token/`,
            {
                username,
                password
            }
        ).pipe(
            tap(response => {
                this.saveTokens(
                    response.access,
                    response.refresh
                );
            })
        );
    }
    
    logout(): Observable<any> {
        const refresh = this.getRefreshToken();

        return this.http.post(
            `${this.api}/accounts/logout/`,
            {
                refresh
            }
        ).pipe(
            tap(() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
            })
        );
    }
    
    getCurrentUser(): Observable<User> {
        return this.http.get<User>(
            `${this.api}/accounts/me/`
        );
    }

    saveTokens(access: any, refresh: any):void {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
    }

    getAccesToken(): string | null {
        return localStorage.getItem("access");
    }

    getRefreshToken(): string | null {
        return localStorage.getItem("refresh");
    }

    isLoggedIn(): boolean {
        return this.getAccesToken() !== null;
    }

}

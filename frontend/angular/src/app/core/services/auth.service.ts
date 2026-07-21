import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environmnet } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    private http = inject(HttpClient);
    private api = environmnet.apiUrl;

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
    
    logout() {}
    
    refreshToken() {}
    
    getCurrentUser() {}

    saveTokens() {}

    getAccesToken() {}

    getRefreshToken() {}

    isLoggedIn() {}

    isTokenExpired() {}

}

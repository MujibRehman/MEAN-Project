import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/user`;
  private token!: string | null;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http.post(`${this.apiUrl}/signup`, authData).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.authStatusListener.next(false);
      }
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email, password };
    this.http
      .post<{ token: string }>(`${this.apiUrl}/login`, authData)
      .subscribe({
        next: (response) => {
          this.token = response.token;
          if (!this.token) {
            this.authStatusListener.next(false);
            return;
          }

          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          localStorage.setItem('token', this.token);
          this.router.navigate(['/']);
        },
        error: () => {
          this.authStatusListener.next(false);
        }
      });
  }

  autoAuthUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    this.token = token;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
}

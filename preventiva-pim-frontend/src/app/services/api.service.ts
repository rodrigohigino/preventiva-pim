import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  private token: string | null = null;
  private authState = new BehaviorSubject<boolean>(false);
  public authState$ = this.authState.asObservable();

  private dashboardState = new BehaviorSubject<any>(null);
  public dashboardState$ = this.dashboardState.asObservable();

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.authState.next(this.isAuthenticated);

    const dashboardCache = localStorage.getItem('dashboardData');
    if (dashboardCache) {
      try {
        this.dashboardState.next(JSON.parse(dashboardCache));
      } catch {
        this.dashboardState.next(null);
      }
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
    this.authState.next(true);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  private parseJwtPayload(token: string): null | { exp?: number; [key: string]: any } {
    try {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodeURIComponent(
        decoded
          .split('')
          .map((c) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      ));
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.parseJwtPayload(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  }

  get isAuthenticated(): boolean {
    if (!this.token) {
      return false;
    }

    if (this.isTokenExpired(this.token)) {
      this.logout();
      return false;
    }

    return true;
  }

  // REMOVIDO: private getHeaders() - o interceptor cuida disso agora

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, senha });
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`).pipe(
      tap((data) => {
        this.dashboardState.next(data);
        localStorage.setItem('dashboardData', JSON.stringify(data));
      }),
      catchError((err) => {
        // mantém cache antigo no erro, mas entrega o erro adiante.
        return throwError(() => err);
      }),
    );
  }

  getEquipamentos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/equipamentos`);
  }
  createEquipamento(equip: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/equipamentos`, equip);
  }
  deleteEquipamento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/equipamentos/${id}`);
  }

  getPlanos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/planos`);
  }
  createPlano(plano: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/planos`, plano);
  }
  deletePlano(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/planos/${id}`);
  }

  createExecucao(execucao: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/execucoes`, execucao);
  }

  getExecucoesByPlano(planoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/execucoes/plano/${planoId}`);
  }

  getCurrentUserId(): number | null {
    if (!this.token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return payload?.sub ?? null;
    } catch {
      return null;
    }
  }
}

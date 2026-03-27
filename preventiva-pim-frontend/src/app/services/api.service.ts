import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  // REMOVIDO: private getHeaders() - o interceptor cuida disso agora

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, senha });
  }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
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

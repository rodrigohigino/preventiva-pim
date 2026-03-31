import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { catchError, finalize, timeout } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dados: any;
  carregando = true;
  errorMessage = '';
  chartData: Array<{label: string; value: number}> = [];

  private dashboardSubscription?: Subscription;
  private refreshTimer: any;
  private readonly refreshIntervalMs = 30000;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (!this.api.isAuthenticated) {
      this.errorMessage = 'Você precisa fazer login para ver o dashboard.';
      this.carregando = false;
      this.router.navigate(['/login']);
      return;
    }

    this.dashboardSubscription = this.api.dashboardState$.subscribe((cached) => {
      if (cached) {
        this.dados = cached;
        this.chartData = [
          { label: 'Atrasados', value: Number(cached.atrasados ?? 0) },
          { label: 'Previstos 7d', value: Number(cached.previstos_7_dias ?? 0) },
          { label: 'Conformidade', value: Number(cached.conformidade_mes ?? 0) },
          { label: 'Execuções', value: Number(cached.execucoes_mes ?? 0) },
        ];
        this.carregando = false;
        this.errorMessage = ''; // mostra dados cache enquanto atualiza
      }
    });

    this.loadDashboard();

    this.refreshTimer = setInterval(() => {
      this.loadDashboard();
    }, this.refreshIntervalMs);
  }

  ngOnDestroy() {
    this.dashboardSubscription?.unsubscribe();
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  private loadDashboard(): void {
    this.carregando = true;

    this.api.getDashboard()
      .pipe(
        timeout(15000),
        catchError((err) => {
          console.error('Dashboard request error (timeout ou outro):', err);
          this.errorMessage = 'Erro de rede ou tempo esgotado ao carregar dashboard. Tente novamente.';
          return of(null);
        }),
        finalize(() => (this.carregando = false)),
      )
      .subscribe({
        next: (res) => {
          if (!res) {
            this.dados = null;
            return;
          }

          console.debug('Dashboard load', res);
          this.dados = res;
          this.errorMessage = '';
          this.chartData = [
            { label: 'Atrasados', value: Number(res.atrasados ?? 0) },
            { label: 'Previstos 7d', value: Number(res.previstos_7_dias ?? 0) },
            { label: 'Conformidade', value: Number(res.conformidade_mes ?? 0) },
            { label: 'Execuções', value: Number(res.execucoes_mes ?? 0) },
          ];

          if (!res || Object.keys(res).length === 0) {
            this.errorMessage = 'A API retornou dados vazios. Verifique o backend /api/dashboard.';
          }
        },
        error: (err) => {
          console.error('Dashboard load failed', err);
          this.dados = null;
          if (err?.status === 401) {
            this.errorMessage = 'Sessão expirada. Faça login novamente.';
            this.api.logout();
            this.router.navigate(['/login']);
          } else {
            this.errorMessage =
              err?.message
                ? `Erro ao carregar dados do dashboard: ${err.message}`
                : 'Erro ao carregar dados do dashboard. Verifique a API ou rede.';
          }
        }
      });
  }
}

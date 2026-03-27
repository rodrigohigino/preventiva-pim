import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dados: any;
  carregando = true;
  errorMessage = '';
  chartData: Array<{label: string; value: number}> = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (!this.api.isAuthenticated) {
      this.errorMessage = 'Você precisa fazer login para ver o dashboard.';
      this.carregando = false;
      this.router.navigate(['/login']);
      return;
    }

    this.api.getDashboard()
      .pipe(finalize(() => (this.carregando = false)))
      .subscribe({
      next: (res) => {
        this.dados = res;
        this.errorMessage = '';
        this.chartData = [
          { label: 'Atrasados', value: Number(res.atrasados ?? 0) },
          { label: 'Previstos 7d', value: Number(res.previstos_7_dias ?? 0) },
          { label: 'Conformidade', value: Number(res.conformidade_mes ?? 0) },
          { label: 'Execuções', value: Number(res.execucoes_mes ?? 0) },
        ];
      },
      error: (err) => {
        this.dados = null;
        if (err.status === 401) {
          this.errorMessage = 'Sessão expirada. Faça login novamente.';
          this.api.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Erro ao carregar dados do dashboard. Verifique a API ou rede.';
        }
      }
    });
  }
}

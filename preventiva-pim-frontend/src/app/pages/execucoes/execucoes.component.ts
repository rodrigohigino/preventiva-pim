import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-execucoes',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './execucoes.component.html',
  styleUrls: ['./execucoes.component.css']
})
export class ExecucoesComponent implements OnInit {
  planos: any[] = [];
  equipamentos: any[] = [];
  execucoes: any[] = [];
  mensagemSucesso = '';
  errorMessage = '';

  novoRegistro = {
    plano_id: 0,
    data_execucao: new Date().toISOString().split('T')[0],
    status: 'realizada',
    observacoes: ''
  };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (!this.api.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.carregarDadosPrecarregados();
  }

  carregarDadosPrecarregados(): void {
    this.api.getPlanos().subscribe({
      next: (res: any) => {
        this.planos = res;
        if (this.planos.length && !this.novoRegistro.plano_id) {
          this.novoRegistro.plano_id = this.planos[0].id;
          this.carregarExecucoesPorPlano();
        }
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar planos: ' + (err?.message ?? '');
      }
    });

    this.api.getEquipamentos().subscribe({
      next: (res: any) => {
        this.equipamentos = res;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar equipamentos: ' + (err?.message ?? '');
      }
    });
  }

  carregarExecucoesPorPlano(): void {
    if (!this.novoRegistro.plano_id) {
      this.execucoes = [];
      return;
    }
    this.api.getExecucoesByPlano(Number(this.novoRegistro.plano_id)).subscribe({
      next: (res: any) => {
        this.execucoes = res;
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar execuções: ' + (err?.message ?? '');
      }
    });
  }

  registrar(): void {
    if (!this.novoRegistro.plano_id) {
      this.errorMessage = 'Selecione um plano para registrar a execução.';
      return;
    }

    const usuarioId = this.api.getCurrentUserId();
    if (!usuarioId) {
      this.errorMessage = 'Usuário não identificado. Faça login novamente.';
      return;
    }

    const payload = {
      ...this.novoRegistro,
      plano_id: Number(this.novoRegistro.plano_id),
      tecnico_id: usuarioId,
    };

    this.api.createExecucao(payload).subscribe({
      next: () => {
        this.mensagemSucesso = 'Execução registrada com sucesso.';
        this.errorMessage = '';
        this.novoRegistro.status = 'realizada';
        this.novoRegistro.observacoes = '';
        this.carregarExecucoesPorPlano();
      },
      error: (err) => {
        this.mensagemSucesso = '';
        if (err.status === 401) {
          this.api.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Erro ao registrar execução: ' + (err?.error?.message ?? err?.message ?? '');
        }
      }
    });
  }
}

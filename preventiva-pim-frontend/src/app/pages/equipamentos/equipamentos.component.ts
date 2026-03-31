import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-equipamentos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './equipamentos.component.html',
  styleUrls: ['./equipamentos.component.css']
})
export class EquipamentosComponent implements OnInit {
  equipamentos: any[] = [];
  novoEquip = {
    codigo: '',
    nome: '',
    tipo: '',
    localizacao: '',
    fabricante: '',
    modelo: '',
  };
  mensagem = '';
  erro = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (!this.api.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.load();
  }

  load() {
    this.api.getEquipamentos().subscribe({
      next: (res: any) => {
        this.equipamentos = res;
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao carregar equipamentos.';
      },
    });
  }

  salvar() {
    if (!this.api.isAuthenticated) {
      this.erro = 'Você precisa estar logado para salvar equipamentos.';
      return;
    }

    this.api.createEquipamento(this.novoEquip).subscribe({
      next: (data) => {
        this.mensagem = 'Equipamento salvo com sucesso.';
        this.erro = '';
        this.novoEquip = {
          codigo: '',
          nome: '',
          tipo: '',
          localizacao: '',
          fabricante: '',
          modelo: '',
        };
        this.load();
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao salvar equipamento.';
        this.mensagem = '';
      },
    });
  }

  excluir(id: number) {
    if (!confirm('Deseja excluir este equipamento?')) {
      return;
    }

    this.api.deleteEquipamento(id).subscribe({
      next: () => {
        this.mensagem = 'Equipamento removido';
        this.erro = '';
        this.equipamentos = this.equipamentos.filter((e) => e.id !== id);
        this.load();
      },
      error: (err) => {
        this.erro = err?.error?.message || 'Erro ao excluir equipamento.';
        this.mensagem = '';
      },
    });
  }
}

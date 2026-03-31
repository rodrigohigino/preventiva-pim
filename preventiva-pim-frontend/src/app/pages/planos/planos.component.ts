import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {
  planos: any[] = [];
  equipamentos: any[] = [];
  novoPlano = {
    equipamento_id: 0,
    titulo: '',
    descricao: '',
    periodicidade_dias: 30,
    data_inicial: new Date().toISOString().split('T')[0],
  };
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    if (!this.api.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    this.load();
    this.loadEquipamentos();
  }

  load() {
    this.api.getPlanos().subscribe((res: any) => this.planos = res);
  }

  loadEquipamentos() {
    this.api.getEquipamentos().subscribe((res: any) => {
      this.equipamentos = res;
      if (this.equipamentos.length && !this.novoPlano.equipamento_id) {
        this.novoPlano.equipamento_id = this.equipamentos[0].id;
      }
    });
  }

  salvar() {
    const payload = {
      ...this.novoPlano,
      equipamento_id: Number(this.novoPlano.equipamento_id),
      periodicidade_dias: Number(this.novoPlano.periodicidade_dias),
    };

    this.api.createPlano(payload).subscribe(() => {
      this.novoPlano = {
        equipamento_id: 0,
        titulo: '',
        descricao: '',
        periodicidade_dias: 30,
        data_inicial: new Date().toISOString().split('T')[0],
      };
      this.load();
    });
  }

  excluir(id: number) {
    this.api.deletePlano(id).subscribe(() => this.load());
  }
}

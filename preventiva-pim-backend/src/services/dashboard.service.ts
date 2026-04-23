import { AppDataSource } from '../database/data-source.js';
import { PlanoManutencao } from '../entities/PlanoManutencao.js';
import { ExecucaoManutencao } from '../entities/ExecucaoManutencao.js';
import { LessThan, Between } from 'typeorm';
import { DashboardData, PlanoAtrasado } from '../models/dashboard.models.js';

export class DashboardService {
  private planoRepo = AppDataSource.getRepository(PlanoManutencao);
  private execRepo = AppDataSource.getRepository(ExecucaoManutencao);

  async getDados(): Promise<DashboardData> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const em7Dias = new Date(hoje);
    em7Dias.setDate(em7Dias.getDate() + 7);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    // ── 1. Planos atrasados ────────────────────────────────────────
    const planosAtrasados = await this.planoRepo.find({
      where: { ativo: true, proxima_em: LessThan(hoje) },
      relations: ['equipamento', 'tecnico'],
      order: { proxima_em: 'ASC' },
    });

    // ── 2. Previstos para os próximos 7 dias ──────────────────────
    const previstos7 = await this.planoRepo.count({
      where: { ativo: true, proxima_em: Between(hoje, em7Dias) },
    });

    // ── 3. Execuções registradas no mês ───────────────────────────
    // Vamos executar várias consultas em paralelo para reduzir latência
    const execucoesMes = await this.execRepo.find({
      where: { data_execucao: Between(inicioMes, fimMes) },
    });

    const execucoesConformesMes = execucoesMes.filter(exec => exec.conformidade).length;

    // ── 4. Conformidade do mês ────────────────────────────────────
    // Conformidade = execuções conformes / total de execuções do mês * 100
    const conformidade =
      execucoesMes.length > 0 ? Math.round((execucoesConformesMes / execucoesMes.length) * 100) : 0;

    // ── Monta lista de atrasados com dias de atraso ───────────────
    const listaAtrasados: PlanoAtrasado[] = planosAtrasados.map((p) => {
      if (!p.proxima_em) {
        return {
          plano_id: p.id,
          titulo: p.titulo,
          equipamento: p.equipamento.nome,
          codigo_equipamento: p.equipamento.codigo,
          proxima_em: null,
          dias_atraso: 0,
          tecnico: p.tecnico?.nome,
        };
      }

      const proxima = new Date(p.proxima_em);
      proxima.setHours(0, 0, 0, 0);
      const diasAtraso = Math.floor(
        (hoje.getTime() - proxima.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        plano_id: p.id,
        titulo: p.titulo,
        equipamento: p.equipamento.nome,
        codigo_equipamento: p.equipamento.codigo,
        proxima_em: p.proxima_em && p.proxima_em instanceof Date ? p.proxima_em.toISOString().split('T')[0] : null,
        dias_atraso: diasAtraso,
        tecnico: p.tecnico?.nome,
      };
    });

    return {
      atrasados: planosAtrasados.length,
      previstos_7_dias: previstos7,
      conformidade_mes: conformidade,
      execucoes_mes: execucoesMes.length,
      lista_atrasados: listaAtrasados,
    };
  }
}

import { AppDataSource } from '../database/data-source.js';
import { ExecucaoManutencao } from '../entities/ExecucaoManutencao.js';
import { PlanoManutencao } from '../entities/PlanoManutencao.js';
import { Usuario } from '../entities/Usuario.js';
import { AppError } from '../middlewares/error.middleware.js';
import { CreateExecucaoInput } from '../validates/execucao.validate.js';

export class ExecucaoService {
  private execRepo = AppDataSource.getRepository(ExecucaoManutencao);
  private planoRepo = AppDataSource.getRepository(PlanoManutencao);
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async registrar(data: CreateExecucaoInput): Promise<ExecucaoManutencao> {
    const plano = await this.planoRepo.findOne({
      where: { id: data.plano_id },
      relations: { equipamento: true },
    });
    if (!plano) throw new AppError('Plano não encontrado', 404);

    const tecnico = await this.usuarioRepo.findOneBy({ id: data.tecnico_id });
    if (!tecnico) throw new AppError('Técnico não encontrado', 404);

    const dataExecucao = new Date(data.data_execucao);

    // ── Conformidade ──────────────────────────────────────────────
    // Conforme = executado até a data prevista (não atrasada)
    const conformidade = dataExecucao <= plano.proxima_em;

    // ── Cria o registro de execução ───────────────────────────────
    const execucao = this.execRepo.create({
      plano,
      tecnico,
      data_execucao: dataExecucao,
      status: data.status,
      observacoes: data.observacoes,
      data_prevista: plano.proxima_em,
      conformidade,
    });

    await this.execRepo.save(execucao);

    // ── Recalcula proxima_em ──────────────────────────────────────
    // REGRA CRÍTICA: base é data_execucao, nunca now()
    // Evita acúmulo de atraso nas próximas datas
    const novaProxima = new Date(dataExecucao);
    novaProxima.setDate(novaProxima.getDate() + plano.periodicidade_dias);
    plano.proxima_em = novaProxima;

    await this.planoRepo.save(plano);

    return execucao;
  }

  async listarPorPlano(planoId: number): Promise<ExecucaoManutencao[]> {
    return this.execRepo.find({
      where: { plano: { id: planoId } },
      relations: { tecnico: true },
      order: { data_execucao: 'DESC' },
    });
  }

  async remover(id: number): Promise<void> {
    const execucao = await this.execRepo.findOne({
      where: { id },
      relations: { plano: true, tecnico: true },
    });

    if (!execucao) {
      throw new AppError('Execução não encontrada', 404);
    }

    await this.execRepo.remove(execucao);
  }
}

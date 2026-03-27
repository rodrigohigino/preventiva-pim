import { AppDataSource } from '../database/data-source.js';
import { PlanoManutencao } from '../entities/PlanoManutencao.js';
import { Equipamento } from '../entities/Equipamento.js';
import { Usuario } from '../entities/Usuario.js';
import { AppError } from '../middlewares/error.middleware.js';
import { CreatePlanoInput, UpdatePlanoInput } from '../validates/plano.validate.js';
import { LessThan, Between } from 'typeorm';

export type FiltroPrazo = 'atrasadas' | 'esta_semana' | 'este_mes' | 'todas';

export class PlanoService {
  private repo = AppDataSource.getRepository(PlanoManutencao);
  private equipRepo = AppDataSource.getRepository(Equipamento);
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async listar(filtro: FiltroPrazo = 'todas'): Promise<PlanoManutencao[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let where: object = { ativo: true };

    if (filtro === 'atrasadas') {
      where = { ativo: true, proxima_em: LessThan(hoje) };
    } else if (filtro === 'esta_semana') {
      const fim = new Date(hoje);
      fim.setDate(fim.getDate() + 7);
      where = { ativo: true, proxima_em: Between(hoje, fim) };
    } else if (filtro === 'este_mes') {
      const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
      where = { ativo: true, proxima_em: Between(hoje, fim) };
    }

    return this.repo.find({
      where,
      relations: ['equipamento', 'tecnico'],
      order: { proxima_em: 'ASC' },
    });
  }

  async buscarPorId(id: number): Promise<PlanoManutencao> {
    const plano = await this.repo.findOne({
      where: { id },
      relations: ['equipamento', 'tecnico'],
    });
    if (!plano) throw new AppError('Plano não encontrado', 404);
    return plano;
  }

  async historico(planoId: number) {
    const plano = await this.buscarPorId(planoId);

    const execucoes = await AppDataSource.getRepository('execucoes_manutencao').find({
      where: { plano: { id: planoId } } as object,
      relations: ['tecnico'],
      order: { data_execucao: 'DESC' },
    } as object);

    return { plano, execucoes };
  }

  async criar(data: CreatePlanoInput): Promise<PlanoManutencao> {
    const equipamento = await this.equipRepo.findOneBy({ id: data.equipamento_id });
    if (!equipamento) throw new AppError('Equipamento não encontrado', 404);

    let tecnico: Usuario | undefined;
    if (data.tecnico_id) {
      const found = await this.usuarioRepo.findOneBy({ id: data.tecnico_id });
      if (!found) throw new AppError('Técnico não encontrado', 404);
      tecnico = found;
    }

    const plano = this.repo.create({
      equipamento,
      titulo: data.titulo,
      descricao: data.descricao,
      periodicidade_dias: data.periodicidade_dias,
      tecnico,
      proxima_em: new Date(data.data_inicial),
      ativo: data.ativo,
    });

    return this.repo.save(plano);
  }

  async atualizar(id: number, data: UpdatePlanoInput): Promise<PlanoManutencao> {
    const plano = await this.buscarPorId(id);

    if (data.equipamento_id) {
      const equip = await this.equipRepo.findOneBy({ id: data.equipamento_id });
      if (!equip) throw new AppError('Equipamento não encontrado', 404);
      plano.equipamento = equip;
    }

    if (data.tecnico_id) {
      const tec = await this.usuarioRepo.findOneBy({ id: data.tecnico_id });
      if (!tec) throw new AppError('Técnico não encontrado', 404);
      plano.tecnico = tec;
    }

    if (data.titulo) plano.titulo = data.titulo;
    if (data.descricao !== undefined) plano.descricao = data.descricao;
    if (data.periodicidade_dias) plano.periodicidade_dias = data.periodicidade_dias;
    if (data.data_inicial) plano.proxima_em = new Date(data.data_inicial);
    if (data.ativo !== undefined) plano.ativo = data.ativo;

    return this.repo.save(plano);
  }

  async remover(id: number): Promise<void> {
    const plano = await this.buscarPorId(id);
    plano.ativo = false;
    await this.repo.save(plano);
  }
}

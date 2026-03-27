import { AppDataSource } from '../database/data-source.js';
import { Equipamento } from '../entities/Equipamento.js';
import { AppError } from '../middlewares/error.middleware.js';
import {
  CreateEquipamentoInput,
  UpdateEquipamentoInput,
} from '../validates/equipamento.validate.js';

export class EquipamentoService {
  private repo = AppDataSource.getRepository(Equipamento);

  async listar(): Promise<Equipamento[]> {
    // Mostra apenas equipamentos ativos
    return this.repo.find({ where: { ativo: true }, order: { nome: 'ASC' } });
  }

  async buscarPorId(id: number): Promise<Equipamento> {
    const equipamento = await this.repo.findOne({
      where: { id },
      relations: { planos: { tecnico: true } },
    });

    if (!equipamento) {
      throw new AppError('Equipamento não encontrado', 404);
    }
    return equipamento;
  }

  async criar(data: CreateEquipamentoInput): Promise<Equipamento> {
    const existe = await this.repo.findOneBy({ codigo: data.codigo });
    if (existe) {
      throw new AppError(`Já existe um equipamento com o código ${data.codigo}`, 409);
    }

    const equipamento = this.repo.create(data);
    return this.repo.save(equipamento);
  }

  async atualizar(id: number, data: UpdateEquipamentoInput): Promise<Equipamento> {
    const equipamento = await this.buscarPorId(id);

    if (data.codigo && data.codigo !== equipamento.codigo) {
      const existe = await this.repo.findOneBy({ codigo: data.codigo });
      if (existe) {
        throw new AppError(`Já existe um equipamento com o código ${data.codigo}`, 409);
      }
    }

    Object.assign(equipamento, data);
    return this.repo.save(equipamento);
  }

  async remover(id: number): Promise<void> {
    const equipamento = await this.buscarPorId(id);
    // Soft delete: apenas desativa o equipamento
    equipamento.ativo = false;
    await this.repo.save(equipamento);
  }
}

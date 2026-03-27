import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Equipamento } from './Equipamento.js';
import { Usuario } from './Usuario.js';
import { ExecucaoManutencao } from './ExecucaoManutencao.js';

@Entity('planos_manutencao')
export class PlanoManutencao {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne('Equipamento', 'planos', { nullable: false })
  @JoinColumn({ name: 'equipamento_id' })
  equipamento!: Equipamento;

  @Column({ type: 'text' })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column({ type: 'integer' })
  periodicidade_dias!: number;

  @ManyToOne('Usuario', 'planos', { nullable: true })
  @JoinColumn({ name: 'tecnico_id' })
  tecnico?: Usuario;

  /**
   * Data calculada para a próxima execução.
   * Recalculada pelo backend após cada execução:
   *   proxima_em = data_execucao + periodicidade_dias
   */
  @Column({ type: 'date' })
  proxima_em!: Date;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  // @OneToMany(() => ExecucaoManutencao, (exec) => exec.plano)
  // execucoes!: ExecucaoManutencao[];

  @CreateDateColumn()
  criado_em!: Date;

  @UpdateDateColumn()
  atualizado_em!: Date;
}

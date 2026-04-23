import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { PlanoManutencao } from './PlanoManutencao.js';
import { Usuario } from './Usuario.js';

export type StatusExecucao = 'realizada' | 'parcial' | 'nao_realizada';

@Entity('execucoes_manutencao')
export class ExecucaoManutencao {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne('PlanoManutencao', { nullable: false })
  @JoinColumn({ name: 'plano_id' })
  plano!: PlanoManutencao;

  @ManyToOne('Usuario', { nullable: false })
  @JoinColumn({ name: 'tecnico_id' })
  tecnico!: Usuario;

  @Column({ type: 'date' })
  data_execucao!: Date;

  @Column({
    type: 'enum',
    enum: ['realizada', 'parcial', 'nao_realizada'],
    default: 'realizada',
  })
  status!: StatusExecucao;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  /**
   * Data prevista para a execução (cópia de plano.proxima_em no momento da execução)
   */
  @Column({ type: 'date', nullable: true })
  data_prevista?: Date;

  /**
   * true = manutenção executada conforme o plano (dentro do prazo)
   * Calculado automaticamente no service: data_execucao <= data_prevista
   */
  @Column({ type: 'boolean' })
  conformidade!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  timestamp!: Date;
}

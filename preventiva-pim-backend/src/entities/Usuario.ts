import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PlanoManutencao } from './PlanoManutencao.js';
import { ExecucaoManutencao } from './ExecucaoManutencao.js';

export type PerfilUsuario = 'supervisor' | 'tecnico' | 'gestor';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  nome!: string;

  @Column({ type: 'text', unique: true })
  email!: string;

  @Column({ type: 'text', select: false }) // nunca retornado nas queries por padrão
  senha!: string;

  @Column({
    type: 'enum',
    enum: ['supervisor', 'tecnico', 'gestor'],
    default: 'tecnico',
  })
  perfil!: PerfilUsuario;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @OneToMany('PlanoManutencao', 'tecnico')
  planos!: PlanoManutencao[];

  @OneToMany('ExecucaoManutencao', 'tecnico')
  execucoes!: ExecucaoManutencao[];

  @CreateDateColumn()
  criado_em!: Date;

  @UpdateDateColumn()
  atualizado_em!: Date;
}

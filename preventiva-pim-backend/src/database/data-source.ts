import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from '../config/env.js';

import { Usuario } from '../entities/Usuario.js';
import { Equipamento } from '../entities/Equipamento.js';
import { PlanoManutencao } from '../entities/PlanoManutencao.js';
import { ExecucaoManutencao } from '../entities/ExecucaoManutencao.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  // Em produção, desligar synchronize e usar migrations
  synchronize: env.NODE_ENV !== 'production',
  logging: env.NODE_ENV === 'development',

  entities: [Usuario, Equipamento, PlanoManutencao, ExecucaoManutencao],
  migrations: ['src/database/migrations/*.ts'],
});

export async function connectDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅  Banco de dados conectado');
  } catch (err) {
    console.error('❌  Erro ao conectar o banco de dados:', err);
    process.exit(1);
  }
}

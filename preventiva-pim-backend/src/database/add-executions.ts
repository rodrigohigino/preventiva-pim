import 'reflect-metadata';
import { AppDataSource } from './data-source.js';
import { ExecucaoManutencao } from '../entities/ExecucaoManutencao.js';
import { PlanoManutencao } from '../entities/PlanoManutencao.js';
import { Usuario } from '../entities/Usuario.js';

async function addExecutions() {
  await AppDataSource.initialize();

  const execRepo = AppDataSource.getRepository(ExecucaoManutencao);
  const planoRepo = AppDataSource.getRepository(PlanoManutencao);
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const tecnico = await usuarioRepo.findOneBy({ email: 'tecnico@pim.com' });
  if (!tecnico) {
    console.log('Técnico não encontrado');
    return;
  }

  const planos = await planoRepo.find();
  if (planos.length === 0) {
    console.log('Nenhum plano encontrado');
    return;
  }

  const executions = [
    {
      plano: planos[0],
      tecnico,
      data_execucao: new Date(2026, 3, 10), // Abril 10
      status: 'realizada' as const,
      observacoes: 'Execução de teste - atrasada',
      data_prevista: planos[0].proxima_em,
      conformidade: false,
    },
    {
      plano: planos[1],
      tecnico,
      data_execucao: new Date(2026, 3, 15), // Abril 15
      status: 'realizada' as const,
      observacoes: 'Execução de teste - atrasada',
      data_prevista: planos[1].proxima_em,
      conformidade: false,
    },
    {
      plano: planos[2],
      tecnico,
      data_execucao: new Date(2026, 3, 20), // Abril 20
      status: 'realizada' as const,
      observacoes: 'Execução de teste - no prazo',
      data_prevista: planos[2].proxima_em,
      conformidade: true,
    },
    {
      plano: planos[3],
      tecnico,
      data_execucao: new Date(2026, 3, 18), // Abril 18
      status: 'realizada' as const,
      observacoes: 'Execução de teste - antecipada',
      data_prevista: planos[3].proxima_em,
      conformidade: true,
    },
  ];

  await execRepo.save(executions);
  console.log('✅  Execuções adicionadas');

  await AppDataSource.destroy();
}

addExecutions().catch(console.error);
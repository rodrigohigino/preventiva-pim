import 'reflect-metadata';
import { AppDataSource } from './data-source.js';
import { Usuario } from '../entities/Usuario.js';
import { Equipamento } from '../entities/Equipamento.js';
import { PlanoManutencao } from '../entities/PlanoManutencao.js';
import { ExecucaoManutencao } from '../entities/ExecucaoManutencao.js';
import bcrypt from 'bcryptjs';

async function seed() {
  await AppDataSource.initialize();

  // ── Usuários ──────────────────────────────────────────────────
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const supervisor = usuarioRepo.create({
    nome: 'Carlos Supervisor',
    email: 'supervisor@pim.com',
    senha: await bcrypt.hash('senha123', 10),
    perfil: 'supervisor',
  });

  const tecnico = usuarioRepo.create({
    nome: 'João Técnico',
    email: 'tecnico@pim.com',
    senha: await bcrypt.hash('senha123', 10),
    perfil: 'tecnico',
  });

  await usuarioRepo.save([supervisor, tecnico]);
  console.log('✅  Usuários criados');

  // ── Equipamentos ──────────────────────────────────────────────
  const equipRepo = AppDataSource.getRepository(Equipamento);

  const prensa = equipRepo.create({
    codigo: 'PRN-001',
    nome: 'Prensa Hidráulica Linha A',
    tipo: 'prensa',
    localizacao: 'Linha A - Setor 1',
    fabricante: 'Schuler',
    modelo: 'HPS 100',
  });

  const torno = equipRepo.create({
    codigo: 'TRN-042',
    nome: 'Torno CNC Compacto',
    tipo: 'torno',
    localizacao: 'Usinagem - Setor 3',
    fabricante: 'Romi',
    modelo: 'Galaxy 15',
  });

  const compressor = equipRepo.create({
    codigo: 'CMP-007',
    nome: 'Compressor de Ar Industrial',
    tipo: 'compressor',
    localizacao: 'Utilidades - Setor 0',
    fabricante: 'Atlas Copco',
    modelo: 'GA 15',
  });

  await equipRepo.save([prensa, torno, compressor]);
  console.log('✅  Equipamentos criados');

  // ── Planos de manutenção (alguns vencidos) ────────────────────
  const planoRepo = AppDataSource.getRepository(PlanoManutencao);

  const hoje = new Date();
  const diasAtras = (n: number) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() - n);
    return d;
  };
  const diasFrente = (n: number) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + n);
    return d;
  };

  const planos = planoRepo.create([
    {
      equipamento: prensa,
      titulo: 'Lubrificação Geral',
      descricao: 'Lubrificar todos os pontos de engrenagem e guias conforme manual.',
      periodicidade_dias: 30,
      tecnico: tecnico,
      proxima_em: diasAtras(5), // VENCIDO
    },
    {
      equipamento: prensa,
      titulo: 'Inspeção Elétrica',
      descricao: 'Verificar conexões, fusíveis e painel elétrico.',
      periodicidade_dias: 90,
      tecnico: tecnico,
      proxima_em: diasAtras(12), // VENCIDO
    },
    {
      equipamento: torno,
      titulo: 'Troca de Fluido de Corte',
      descricao: 'Drenar e repor fluido de corte. Limpar reservatório.',
      periodicidade_dias: 60,
      tecnico: tecnico,
      proxima_em: diasFrente(3), // Próximos dias
    },
    {
      equipamento: compressor,
      titulo: 'Revisão de Filtros',
      descricao: 'Trocar filtro de ar e verificar filtro de óleo.',
      periodicidade_dias: 30,
      tecnico: tecnico,
      proxima_em: diasFrente(15), // No prazo
    },
    {
      equipamento: compressor,
      titulo: 'Revisão Semestral Completa',
      descricao: 'Verificar válvulas, correias, rolamentos e painel de controle.',
      periodicidade_dias: 180,
      tecnico: tecnico,
      proxima_em: diasFrente(45), // No prazo
    },
  ]);

  await planoRepo.save(planos);
  console.log('✅  Planos de manutenção criados');

  // ── Execuções de manutenção ────────────────────────────────────
  const execRepo = AppDataSource.getRepository(ExecucaoManutencao);

  const execucoes = execRepo.create([
    {
      plano: planos[0], // Lubrificação Geral - vencido 5 dias atrás
      tecnico: tecnico,
      data_execucao: new Date(2026, 3, 10), // Abril 10 (atrasado)
      status: 'realizada',
      observacoes: 'Executado com atraso devido à falta de peças.',
      conformidade: false,
    },
    {
      plano: planos[1], // Inspeção Elétrica - vencido 12 dias atrás
      tecnico: tecnico,
      data_execucao: new Date(2026, 3, 15), // Abril 15 (atrasado)
      status: 'realizada',
      observacoes: 'Inspeção realizada, tudo OK.',
      conformidade: false,
    },
    {
      plano: planos[2], // Troca de Fluido - próxima em 3 dias
      tecnico: tecnico,
      data_execucao: new Date(2026, 3, 20), // Abril 20 (no prazo)
      status: 'realizada',
      observacoes: 'Fluido trocado conforme plano.',
      conformidade: true,
    },
    {
      plano: planos[3], // Revisão de Filtros - próxima em 15 dias
      tecnico: tecnico,
      data_execucao: new Date(2026, 3, 18), // Abril 18 (antecipado)
      status: 'realizada',
      observacoes: 'Filtros trocados preventivamente.',
      conformidade: true,
    },
  ]);

  await execRepo.save(execucoes);
  console.log('✅  Execuções de manutenção criadas');

  console.log('\n🌱  Seed concluído com sucesso!');
  console.log('   supervisor@pim.com / senha123');
  console.log('   tecnico@pim.com    / senha123');

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

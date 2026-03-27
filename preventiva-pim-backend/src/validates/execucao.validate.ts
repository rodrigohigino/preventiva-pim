import { z } from 'zod';

export const createExecucaoSchema = z.object({
  plano_id: z.number().int().positive('Plano obrigatório'),
  tecnico_id: z.number().int().positive('Técnico obrigatório'),
  data_execucao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (use YYYY-MM-DD)'),
  status: z.enum(['realizada', 'parcial', 'nao_realizada']),
  observacoes: z.string().optional(),
});

export type CreateExecucaoInput = z.infer<typeof createExecucaoSchema>;

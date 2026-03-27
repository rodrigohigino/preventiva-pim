import { z } from 'zod';

export const createPlanoSchema = z.object({
  equipamento_id: z.number().int().positive('Equipamento obrigatório'),
  titulo: z.string().min(1, 'Título obrigatório'),
  descricao: z.string().optional(),
  periodicidade_dias: z
    .number()
    .int()
    .positive('Periodicidade deve ser um número positivo de dias'),
  tecnico_id: z.number().int().positive().optional(),
  /**
   * data_inicial define o proxima_em do plano.
   * Formato esperado: "YYYY-MM-DD"
   */
  data_inicial: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (use YYYY-MM-DD)'),
  ativo: z.boolean().optional().default(true),
});

export const updatePlanoSchema = createPlanoSchema.partial();

export type CreatePlanoInput = z.infer<typeof createPlanoSchema>;
export type UpdatePlanoInput = z.infer<typeof updatePlanoSchema>;

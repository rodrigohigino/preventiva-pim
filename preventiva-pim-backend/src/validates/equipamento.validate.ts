import { z } from 'zod';

export const createEquipamentoSchema = z.object({
  codigo: z.string().min(1, 'Código obrigatório'),
  nome: z.string().min(1, 'Nome obrigatório'),
  tipo: z.string().min(1, 'Tipo obrigatório'),
  localizacao: z.string().min(1, 'Localização obrigatória'),
  fabricante: z.string().optional(),
  modelo: z.string().optional(),
  ativo: z.boolean().optional().default(true),
});

export const updateEquipamentoSchema = createEquipamentoSchema.partial();

export type CreateEquipamentoInput = z.infer<typeof createEquipamentoSchema>;
export type UpdateEquipamentoInput = z.infer<typeof updateEquipamentoSchema>;

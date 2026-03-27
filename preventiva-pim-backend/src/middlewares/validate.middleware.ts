import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware genérico de validação com Zod.
 * Uso: router.post('/rota', validate(meuSchema), controller.metodo)
 */
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = (result.error as ZodError).flatten().fieldErrors;
      res.status(400).json({ message: 'Dados inválidos', errors });
      return;
    }

    // Substitui req.body pelos dados já validados/transformados pelo Zod
    req.body = result.data;
    next();
  };
}

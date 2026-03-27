import 'reflect-metadata';
import './config/env.js'; // valida .env antes de tudo
import express from 'express';
import cors from 'cors';

import { env } from './config/env.js';
import { connectDatabase } from './database/data-source.js';
import routes from './routes/index.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

// ── Middlewares globais ───────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ─────────────────────────────────────────────────────
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Tratamento de erros (deve ser o último middleware) ────────
app.use(errorMiddleware);

// ── Inicialização ─────────────────────────────────────────────
async function bootstrap() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`🚀  Servidor rodando em http://localhost:${env.PORT}`);
    console.log(`   Ambiente: ${env.NODE_ENV}`);
  });
}

bootstrap();

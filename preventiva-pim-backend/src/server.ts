import 'reflect-metadata';
import './config/env.js'; // valida .env antes de tudo
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes.js';

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

// Prefixo da rota
app.use('/auth', authRouter);


// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Tratamento de erros (deve ser o último middleware) ────────
app.use(errorMiddleware);

// ── Inicialização ─────────────────────────────────────────────
async function startServer(port: number) {
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`🚀  Servidor rodando em http://localhost:${port}`);
      console.log(`   Ambiente: ${env.NODE_ENV}`);
      resolve();
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      reject(err);
    });
  });
}

async function tryPorts(startPort: number, endPort: number) {
  for (let port = startPort; port <= endPort; port++) {
    try {
      console.log(`🔎 Tentando porta ${port}...`);
      await startServer(port);
      return port;
    } catch (err: unknown) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === 'EADDRINUSE') {
        console.warn(`⚠️  Porta ${port} em uso; tentando próxima porta...`);
        continue;
      }
      throw e;
    }
  }

  throw new Error(`Nenhuma porta livre encontrada entre ${startPort} e ${endPort}`);
}

async function bootstrap() {
  await connectDatabase();

  const initialPort = env.PORT;
  const fallbackStart = 3000;
  const fallbackEnd = 3010;

  try {
    const usedPort = await tryPorts(initialPort, fallbackEnd);
    if (usedPort !== initialPort) {
      console.log(`✅  Servidor iniciado com fallback na porta ${usedPort}. Ajuste sua UI para essa porta, se necessário.`);
    }
  } catch (err: unknown) {
    const e = err as Error;
    console.error('❌  Falha ao iniciar servidor:', e.message);
    process.exit(1);
  }
}

bootstrap();

# PreventivaPIM — Backend

Sistema de Manutenção Preventiva Industrial  
Stack: **Node.js 20 + TypeScript + Express + TypeORM + PostgreSQL + Docker**

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker + Docker Compose](https://docs.docker.com/compose/)

---

## Instalação e execução

### 1. Clone e configure o ambiente

```bash
git clone https://github.com/rodrigohigino/preventiva-pim-backend.git
cd preventiva-pim-backend

cp .env.example .env
# Edite o .env e defina um JWT_SECRET forte
```

### 2. Opção A — Docker (recomendado)

Sobe o banco PostgreSQL + a API juntos:

```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:3000`.

### 3. Opção B — Local (apenas a API, banco no Docker)

```bash
# Sobe só o banco
docker-compose up postgres -d

# Instala dependências e roda em modo dev
npm install
npm run dev
```

### 4. Popular o banco com dados iniciais (seed)

```bash
npx ts-node src/database/seed.ts
```

Usuários criados pelo seed:

| E-mail                  | Senha    | Perfil     |
|-------------------------|----------|------------|
| supervisor@pim.com      | senha123 | supervisor |
| tecnico@pim.com         | senha123 | tecnico    |

---

## Estrutura do projeto

```
src/
├── server.ts              # Ponto de entrada — Express + bootstrap
├── config/
│   └── env.ts             # Valida variáveis de ambiente com Zod
├── database/
│   ├── data-source.ts     # Configuração do TypeORM / DataSource
│   └── seed.ts            # Dados iniciais para desenvolvimento
├── entities/              # Entidades TypeORM (mapeiam as tabelas)
│   ├── Usuario.ts
│   ├── Equipamento.ts
│   ├── PlanoManutencao.ts
│   └── ExecucaoManutencao.ts
├── validates/             # Schemas de validação com Zod
│   ├── auth.validate.ts
│   ├── equipamento.validate.ts
│   ├── plano.validate.ts
│   └── execucao.validate.ts
├── models/                # Interfaces de domínio (não são entidades)
│   ├── auth.models.ts
│   └── dashboard.models.ts
├── middlewares/
│   ├── auth.middleware.ts     # Verifica JWT em rotas protegidas
│   ├── validate.middleware.ts # Valida req.body com schema Zod
│   └── error.middleware.ts    # Handler global de erros
├── services/              # Regras de negócio
│   ├── auth.service.ts
│   ├── equipamento.service.ts
│   ├── plano.service.ts
│   ├── execucao.service.ts    # ⚠️ Contém a regra crítica de recálculo
│   └── dashboard.service.ts
├── controllers/           # Recebe req/res, chama service, retorna JSON
│   ├── auth.controller.ts
│   ├── equipamento.controller.ts
│   ├── plano.controller.ts
│   ├── execucao.controller.ts
│   └── dashboard.controller.ts
└── routes/
    ├── index.ts               # Agrega todas as rotas + aplica authMiddleware
    ├── auth.routes.ts
    ├── equipamento.routes.ts
    ├── plano.routes.ts
    ├── execucao.routes.ts
    └── dashboard.routes.ts
```

---

## Endpoints da API

Todas as rotas (exceto `/auth/login`) exigem header:  
`Authorization: Bearer <token>`

### Autenticação

| Método | Rota          | Descrição              |
|--------|---------------|------------------------|
| POST   | /api/auth/login | Login, retorna JWT   |

**Body:**
```json
{ "email": "supervisor@pim.com", "senha": "senha123" }
```

---

### Equipamentos

| Método | Rota                    | Descrição                              |
|--------|-------------------------|----------------------------------------|
| GET    | /api/equipamentos       | Lista todos os equipamentos            |
| GET    | /api/equipamentos/:id   | Detalhe + planos vinculados            |
| POST   | /api/equipamentos       | Cadastra novo equipamento              |
| PUT    | /api/equipamentos/:id   | Atualiza equipamento                   |
| DELETE | /api/equipamentos/:id   | Desativa equipamento (soft delete)     |

---

### Planos de Manutenção

| Método | Rota                        | Descrição                                 |
|--------|-----------------------------|-------------------------------------------|
| GET    | /api/planos                 | Lista planos (`?filtro=atrasadas\|esta_semana\|este_mes\|todas`) |
| GET    | /api/planos/:id             | Detalhe do plano                          |
| GET    | /api/planos/:id/historico   | Histórico de execuções do plano           |
| POST   | /api/planos                 | Cadastra novo plano                       |
| PUT    | /api/planos/:id             | Atualiza plano                            |
| DELETE | /api/planos/:id             | Desativa plano (soft delete)              |

**Body (POST):**
```json
{
  "equipamento_id": 1,
  "titulo": "Lubrificação Geral",
  "descricao": "Lubrificar pontos conforme manual.",
  "periodicidade_dias": 30,
  "tecnico_id": 2,
  "data_inicial": "2025-04-01"
}
```

---

### Execuções

| Método | Rota                            | Descrição                            |
|--------|---------------------------------|--------------------------------------|
| POST   | /api/execucoes                  | Registra execução + recalcula proxima_em |
| GET    | /api/execucoes/plano/:planoId   | Lista execuções de um plano          |

**Body (POST):**
```json
{
  "plano_id": 1,
  "tecnico_id": 2,
  "data_execucao": "2025-03-20",
  "status": "realizada",
  "observacoes": "Tudo conforme."
}
```

---

### Dashboard

| Método | Rota           | Descrição                      |
|--------|----------------|--------------------------------|
| GET    | /api/dashboard | Retorna os 4 indicadores       |

**Resposta:**
```json
{
  "atrasados": 2,
  "previstos_7_dias": 1,
  "conformidade_mes": 87,
  "execucoes_mes": 8,
  "lista_atrasados": [
    {
      "plano_id": 1,
      "titulo": "Lubrificação Geral",
      "equipamento": "Prensa Hidráulica Linha A",
      "codigo_equipamento": "PRN-001",
      "proxima_em": "2025-03-10",
      "dias_atraso": 15,
      "tecnico": "João Técnico"
    }
  ]
}
```

---

## Regra crítica — recálculo de `proxima_em`

```
proxima_em = data_execucao + periodicidade_dias
```

**A base é sempre `data_execucao`, nunca `now()`.**  
Isso garante que uma manutenção executada com atraso não acumule esse atraso nas datas seguintes.

Exemplo: plano com periodicidade 30 dias, `proxima_em` era `15/03`.  
- Executado em `20/03` (5 dias de atraso) → novo `proxima_em` = `19/04`, não `14/04`.

---

## Scripts disponíveis

```bash
npm run dev       # Inicia em modo desenvolvimento com hot-reload
npm run build     # Compila TypeScript para dist/
npm start         # Executa o build compilado
npx ts-node src/database/seed.ts  # Popula o banco com dados iniciais
```

---

## Variáveis de ambiente

| Variável        | Obrigatória | Descrição                          |
|-----------------|-------------|-------------------------------------|
| PORT            | não         | Porta do servidor (padrão: 3000)   |
| NODE_ENV        | não         | development / production / test    |
| DB_HOST         | sim         | Host do PostgreSQL                 |
| DB_PORT         | não         | Porta do PostgreSQL (padrão: 5432) |
| DB_USER         | sim         | Usuário do banco                   |
| DB_PASSWORD     | sim         | Senha do banco                     |
| DB_NAME         | sim         | Nome do banco de dados             |
| JWT_SECRET      | sim         | Segredo para assinar os tokens JWT |
| JWT_EXPIRES_IN  | não         | Validade do token (padrão: 8h)     |

> ⚠️ Nunca commite o arquivo `.env`. Ele está no `.gitignore`.

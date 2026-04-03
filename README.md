# 🔧 Preventiva PIM - Sistema de Manutenção Preventiva

> Um sistema completo de gestão de manutenção preventiva de equipamentos com autenticação segura, dashboard intuitivo e controle de execuções de manutenção.

## 📋 Sobre o Projeto

**Preventiva PIM** é uma aplicação web full-stack para gerenciar planos de manutenção preventiva de equipamentos. O sistema permite:

- ✅ Gestão de equipamentos
- 🗓️ Criação e monitoramento de planos de manutenção
- 📊 Dashboard com visualização de dados
- 👥 Controle de usuários com diferentes perfis
- 📝 Registro de execuções de manutenção
- 🔐 Autenticação segura com JWT

---

## 🛠 Tecnologias Utilizadas

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Linguagem:** TypeScript
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Autenticação:** JWT + bcryptjs
- **Validação:** Zod
- **CORS:** Habilitado para requisições cross-origin

### Frontend
- **Framework:** Angular 21
- **Linguagem:** TypeScript
- **Estilização:** CSS/Custom Styles
- **HTTP Client:** Axios
- **Roteamento:** Angular Router
- **SSR:** Angular Universal (SSR)

---

## 📦 Requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18+)
- **npm** (v8+)
- **PostgreSQL** (v12+)
- **Git**

---

## 🚀 Instalação e Execução

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/rodrigohigino/preventiva-pim.git
cd preventiva-pim
```

### 2️⃣ Configurar Backend

```bash
cd preventiva-pim-backend

# Instalar dependências
npm install

# Criar arquivo .env (copie do exemplo)
cp .env.example .env

# Configure as variáveis de ambiente:
# DATABASE_URL=postgresql://user:password@localhost:5432/preventiva_pim
# JWT_SECRET=sua_chave_secreta_aqui
# JWT_EXPIRES_IN=7d
# NODE_ENV=development
# PORT=3000

# Executar em desenvolvimento (modo watch)
npm run dev

# Ou compilar e executar
npm run build
npm start
```

### 3️⃣ Configurar Frontend

```bash
cd preventiva-pim-frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm start

# Ou para build de produção
npm run build
```

---

## 📂 Estrutura do Projeto

### Backend (`preventiva-pim-backend/`)

```
src/
├── config/           # Configurações (variáveis de ambiente)
├── controllers/      # Lógica de requisições HTTP
├── routes/          # Definição de rotas
├── services/        # Lógica de negócios
├── entities/        # Modelos de banco de dados (TypeORM)
├── models/          # Tipos e interfaces
├── middlewares/     # Middlewares (autenticação, validação, erros)
├── validates/       # Schemas de validação (Zod)
├── database/        # Configuração de banco de dados
└── server.ts        # Arquivo principal
```

### Frontend (`preventiva-pim-frontend/`)

```
src/
├── app/
│   ├── pages/          # Componentes de página
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── equipamentos/
│   │   ├── planos/
│   │   └── execucoes/
│   ├── services/       # Serviços HTTP
│   ├── guards/         # Proteção de rotas
│   ├── interceptors/   # Interceptadores HTTP
│   └── app.routes.ts   # Rotas da aplicação
└── main.ts            # Arquivo principal
```

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação:

1. **Login:** Usuário faz login com email e senha
2. **Token:** Sistema retorna um JWT válido por 7 dias
3. **Proteção:** Rotas protegidas verificam o token no header `Authorization: Bearer <token>`
4. **Refresh:** Token é armazenado no localStorage

### Perfis de Usuário
- `admin` - Acesso total ao sistema
- `manager` - Gestão de equipamentos e planos
- `technician` - Visualização e execução de manutenção
- `viewer` - Apenas leitura

---

## 🗄️ Banco de Dados

### Tabelas Principais

- **usuarios** - Usuários do sistema
- **equipamentos** - Equipamentos a serem mantidos
- **planos_manutencao** - Planos de manutenção preventiva
- **execucoes_manutencao** - Histórico de execuções

### Connectionstring PostgreSQL

```
postgresql://usuario:senha@localhost:5432/preventiva_pim
```

---

## 📡 APIs Disponíveis

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Renovar token

### Equipamentos
- `GET /api/equipamentos` - Listar todos
- `POST /api/equipamentos` - Criar novo
- `PUT /api/equipamentos/:id` - Atualizar
- `DELETE /api/equipamentos/:id` - Deletar

### Planos de Manutenção
- `GET /api/planos` - Listar planos
- `POST /api/planos` - Criar plano
- `PUT /api/planos/:id` - Atualizar
- `DELETE /api/planos/:id` - Deletar

### Execuções
- `GET /api/execucoes` - Listar execuções
- `POST /api/execucoes` - Registrar execução
- `PUT /api/execucoes/:id` - Atualizar

### Dashboard
- `GET /api/dashboard/resume` - Dados resumidos
- `GET /api/dashboard/stats` - Estatísticas

---

## 🔌 Variáveis de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/preventiva_pim
DATABASE_LOGGING=false

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=development
PORT=3000
```

### Frontend (environment.ts)

```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  authUrl: 'http://localhost:3000/auth'
};
```

---

## 🧪 Testes

### Backend
```bash
npm run test          # Executar testes
npm run test:watch   # Modo watch
```

### Frontend
```bash
npm run test          # Executar testes
npm run test:watch   # Modo watch
```

---

## 🐳 Docker

O projeto inclui Dockerfile para containerização:

```bash
# Build da imagem
docker build -t preventiva-pim-backend .

# Executar container
docker run -p 3000:3000 --env-file .env preventiva-pim-backend
```

### Docker Compose
```bash
docker-compose up    # Iniciar serviços
docker-compose down  # Parar serviços
```

---

## 📝 Scripts Disponíveis

### Backend
```bash
npm run dev        # Desenvolvimento com watch
npm run build      # Build para produção
npm start          # Iniciar servidor compilado
npm run typeorm    # CLI TypeORM para migrations
```

### Frontend
```bash
npm start          # Servidor de desenvolvimento
npm run build      # Build otimizado
npm run test       # Testes unitários
npm run test:watch # Testes em modo watch
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---

## 📧 Contato e Suporte

Para dúvidas ou sugestões sobre o projeto:

- **GitHub Issues:** [rodrigohigino/preventiva-pim/issues](https://github.com/rodrigohigino/preventiva-pim/issues)
- **Email:** [seu email aqui]

---

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🎯 Roadmap

- [ ] Implementar notificações por email
- [ ] Adicionar gráficos avançados de relatórios
- [ ] Sistema de backup automático
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com IoT para equipamentos inteligentes
- [ ] Exportação de relatórios em PDF

---

## 👨‍💻 Autor

**Rodrigo Higino**
- GitHub: [@rodrigohigino](https://github.com/rodrigohigino)

---

**Última atualização:** Abril de 2026

---

### ⚡ Quick Start

```bash
# Terminal 1 - Backend
cd preventiva-pim-backend
npm install
npm run dev

# Terminal 2 - Frontend
cd preventiva-pim-frontend
npm install
npm start
```

Acesse a aplicação em: `http://localhost:4200`
API disponível em: `http://localhost:3000`

---

**🎉 Pronto para começar! Divirta-se desenvolvendo!**

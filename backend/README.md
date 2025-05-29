# Backend - Restaurant Financial Management System

API REST robusta para o sistema de gestão financeira de restaurantes, desenvolvida com Node.js, Express e TypeScript.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM moderno
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação stateless
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de dados

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/        # Controladores das rotas
│   │   ├── auth.controller.ts
│   │   ├── accounts.controller.ts
│   │   ├── inventory.controller.ts
│   │   ├── purchases.controller.ts
│   │   └── calendar.controller.ts
│   ├── services/          # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── accounts.service.ts
│   │   ├── inventory.service.ts
│   │   └── purchases.service.ts
│   ├── middleware/        # Middlewares customizados
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/           # Definição das rotas
│   │   ├── auth.routes.ts
│   │   ├── accounts.routes.ts
│   │   ├── inventory.routes.ts
│   │   └── purchases.routes.ts
│   ├── utils/            # Utilitários
│   │   ├── database.ts
│   │   ├── jwt.ts
│   │   └── validators.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   └── server.ts         # Servidor principal
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   ├── migrations/       # Migrações
│   └── seed.ts          # Dados iniciais
├── dist/                 # Build compilado
└── package.json         # Dependências
```

## 🗄️ Banco de Dados

### Modelo de Dados
- **Users** - Gerenciamento de usuários e permissões
- **AccountsPayable** - Contas a pagar (fornecedores, despesas)
- **AccountsReceivable** - Contas a receber (vendas, receitas)
- **InventoryItems** - Itens do inventário
- **Purchases** - Compras e pedidos
- **PurchaseItems** - Itens das compras
- **CalendarEvents** - Eventos do calendário

### Relacionamentos
- User 1:N AccountsPayable/Receivable
- User 1:N InventoryItems
- User 1:N Purchases
- Purchase 1:N PurchaseItems
- InventoryItem 1:N PurchaseItems

## 🛠️ API Endpoints

### Autenticação
```
POST   /api/auth/login      # Login do usuário
POST   /api/auth/register   # Registro (admin only)
POST   /api/auth/refresh    # Refresh token
POST   /api/auth/logout     # Logout
```

### Contas a Pagar
```
GET    /api/accounts/payable         # Listar contas a pagar
POST   /api/accounts/payable         # Criar conta a pagar
PUT    /api/accounts/payable/:id     # Atualizar conta
DELETE /api/accounts/payable/:id     # Excluir conta
PATCH  /api/accounts/payable/:id/pay # Marcar como paga
```

### Contas a Receber
```
GET    /api/accounts/receivable           # Listar contas a receber
POST   /api/accounts/receivable           # Criar conta a receber
PUT    /api/accounts/receivable/:id       # Atualizar conta
DELETE /api/accounts/receivable/:id       # Excluir conta
PATCH  /api/accounts/receivable/:id/receive # Marcar como recebida
```

### Inventário
```
GET    /api/inventory           # Listar itens
POST   /api/inventory           # Criar item
PUT    /api/inventory/:id       # Atualizar item
DELETE /api/inventory/:id       # Excluir item
GET    /api/inventory/low-stock # Itens com estoque baixo
```

### Compras
```
GET    /api/purchases           # Listar compras
POST   /api/purchases           # Criar compra
PUT    /api/purchases/:id       # Atualizar compra
DELETE /api/purchases/:id       # Excluir compra
PATCH  /api/purchases/:id/status # Atualizar status
```

### Calendário
```
GET    /api/calendar/events     # Listar eventos
POST   /api/calendar/events     # Criar evento
PUT    /api/calendar/events/:id # Atualizar evento
DELETE /api/calendar/events/:id # Excluir evento
```

### Dashboard
```
GET    /api/dashboard/stats     # Estatísticas gerais
GET    /api/dashboard/charts    # Dados para gráficos
```

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- PostgreSQL 13+
- npm ou yarn

### Instalação
```bash
cd backend
npm install
```

### Configuração do Banco
```bash
# Copiar arquivo de ambiente
cp env.example .env

# Configurar DATABASE_URL no .env
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# Popular banco com dados iniciais
npm run db:seed
```

### Executar em desenvolvimento
```bash
npm run dev
```

### Build de produção
```bash
npm run build
npm start
```

### Utilitários do banco
```bash
npm run db:studio    # Interface visual do banco
npm run db:generate  # Gerar cliente Prisma
npm run db:migrate   # Executar migrações
```

## 🔒 Segurança

### Implementações
- **JWT Authentication** - Tokens seguros
- **Rate Limiting** - Proteção contra spam
- **Helmet** - Cabeçalhos de segurança
- **CORS** - Controle de origem
- **Bcrypt** - Hash de senhas
- **Input Validation** - Validação com Zod

### Middleware de Segurança
- Autenticação em rotas protegidas
- Validação de entrada de dados
- Tratamento de erros seguro
- Logs de auditoria

## 📊 Monitoramento

### Health Check
```bash
GET /health
```

### Logs
- Morgan para logs HTTP
- Winston para logs da aplicação
- Rotação de logs em produção

## 🌍 Variáveis de Ambiente

Consulte `env.example` para todas as variáveis necessárias:
- Configuração do banco
- Chaves JWT
- URLs e portas
- Configurações de email 
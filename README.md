# 🍽️ Restaurant Management System

Sistema completo de gestão para restaurantes desenvolvido com React, Node.js, e EventBus. Pronto para deploy na AWS com arquitetura escalável e moderna.

![Restaurant Management](https://img.shields.io/badge/Restaurant-Management-orange)
![AWS Ready](https://img.shields.io/badge/AWS-Ready-yellow)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)

## 📋 **Visão Geral**

Sistema completo para gerenciamento de restaurantes com módulos integrados:

### **🏗️ Arquitetura**
- **Frontend**: React 18 + Next.js + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL (Produção) / SQLite (Desenvolvimento)
- **Event System**: EventBus customizado para comunicação entre módulos
- **Infrastructure**: AWS (ECS, RDS, S3, CloudFront, ALB)

### **📦 Módulos Disponíveis**
- 🏪 **Restaurantes**: Gestão de múltiplos restaurantes
- 📊 **Dashboard**: Visão geral e métricas
- 👥 **Pessoal**: Gestão de funcionários e folha de pagamento
- 💰 **Finanças**: Contas a pagar/receber
- 📅 **Calendário**: Agendamentos e eventos
- 🛒 **Compras**: Gestão de fornecedores e pedidos (com produtos customizados)
- 📦 **Inventário**: Controle de estoque

---

## 🚀 **Quick Start**

### **Desenvolvimento Local**

```bash
# 1. Clonar repositório
git clone <repository-url>
cd restaurant-management

# 2. Instalar dependências
npm run install:all

# 3. Configurar banco de dados
cd backend
cp .env.example .env
npx prisma migrate dev
npx prisma db seed

# 4. Iniciar em modo desenvolvimento
cd ..
npm run dev
```

**URLs de Desenvolvimento:**
- Frontend: http://localhost:3003
- Backend: http://localhost:3001

**Credenciais de Teste:**
- Admin: `admin@restaurant.local` / `RestaurantAdmin2024!`
- Manager: `manager@restaurant.local` / `RestaurantManager2024!`

### **Deploy AWS (Produção)**

```bash
# Windows
.\aws-deploy.ps1

# Linux/Mac
chmod +x aws-deploy.sh
./aws-deploy.sh
```

---

## 🛠️ **Desenvolvimento**

### **Estrutura do Projeto**

```
restaurant-management/
├── frontend/                 # React + Next.js
│   ├── src/
│   │   ├── app/              # App Router (Next.js 13+)
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── hooks/            # React Hooks customizados
│   │   └── types/            # TypeScript types
│   ├── public/               # Assets estáticos
│   └── Dockerfile            # Container frontend
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── routes/           # Rotas da API
│   │   ├── middleware/       # Middlewares
│   │   ├── controllers/      # Controllers
│   │   └── utils/            # Utilitários
│   ├── prisma/               # Banco de dados
│   │   ├── schema.prisma     # Schema do Prisma
│   │   └── migrations/       # Migrações
│   └── Dockerfile            # Container backend
├── infrastructure/           # AWS CloudFormation
│   └── cloudformation.yaml   # Template de infraestrutura
├── docker-compose.yml        # Desenvolvimento local
├── aws-deploy.sh             # Deploy para AWS (Linux/Mac)
├── aws-deploy.ps1            # Deploy para AWS (Windows)
└── README.md                 # Este arquivo
```

### **Scripts Disponíveis**

```bash
# Desenvolvimento
npm run dev                   # Inicia frontend + backend
npm run dev:frontend          # Apenas frontend
npm run dev:backend           # Apenas backend

# Build
npm run build                 # Build completo
npm run build:frontend        # Build frontend
npm run build:backend         # Build backend

# Docker
npm run docker:build          # Build containers
npm run docker:up             # Inicia containers
npm run docker:down           # Para containers

# AWS
npm run aws:deploy            # Deploy para AWS
```

### **Variáveis de Ambiente**

#### **Backend (.env)**
```env
# Database
DATABASE_URL="file:./dev.db"                    # SQLite (dev)
# DATABASE_URL="postgresql://user:pass@host/db" # PostgreSQL (prod)

# Server
NODE_ENV=development
PORT=3001

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3003
```

#### **Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🏗️ **Deploy na AWS**

### **Arquitetura AWS**

```
Internet → CloudFront → S3 (Frontend)
Internet → ALB → ECS Fargate (Backend) → RDS PostgreSQL
```

### **Serviços Utilizados**
- **ECS Fargate**: Container backend sem servidor
- **RDS PostgreSQL**: Banco de dados gerenciado
- **S3 + CloudFront**: Frontend estático com CDN
- **Application Load Balancer**: Load balancer para backend
- **ECR**: Registry de containers
- **VPC**: Rede privada virtual
- **CloudWatch**: Monitoramento e logs

### **Custos Estimados (Mensais)**
- RDS t3.micro: ~$15-20
- ECS Fargate: ~$25-35
- ALB: ~$18
- S3 + CloudFront: ~$5-10
- **Total: ~$69-90/mês**

### **Pré-requisitos AWS**

1. **Instalar AWS CLI**
```bash
# Windows
winget install Amazon.AWSCLI

# Mac
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

2. **Configurar Credenciais**
```bash
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region: us-east-1
# Default output format: json
```

3. **Instalar Docker**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### **Deploy Automático**

```bash
# Windows PowerShell
.\aws-deploy.ps1

# Linux/Mac Bash
./aws-deploy.sh
```

### **Deploy Manual**

Consulte o guia completo: [AWS_DEPLOY_GUIDE.md](./AWS_DEPLOY_GUIDE.md)

---

## 🔧 **Funcionalidades Principais**

### **🏪 Gestão de Restaurantes**
- Múltiplos restaurantes por usuário
- Configurações personalizadas
- Temas e branding

### **📊 Dashboard Inteligente**
- Métricas em tempo real
- Gráficos interativos
- Alertas e notificações

### **👥 Gestão de Pessoal**
- Cadastro de funcionários
- Folha de pagamento
- Escalas de trabalho
- Controle de ponto

### **💰 Controle Financeiro**
- Contas a pagar/receber
- Fluxo de caixa
- Relatórios financeiros
- Categorização automática

### **📅 Sistema de Calendário**
- Agendamentos
- Eventos e reuniões
- Lembretes automáticos
- Integração com outros módulos

### **🛒 Gestão de Compras**
- Lista de compras inteligente
- **Produtos customizados** (nova funcionalidade)
- Gestão de fornecedores
- Controle de pedidos
- Histórico de compras

### **📦 Controle de Inventário**
- Estoque em tempo real
- Alertas de estoque baixo
- Rastreamento de produtos
- Relatórios de movimentação

### **🔔 Sistema EventBus**
- Comunicação entre módulos
- Notificações em tempo real
- Logs de atividades
- Auditoria completa

---

## 🔐 **Segurança**

### **Autenticação & Autorização**
- JWT tokens seguros
- Controle de acesso baseado em roles
- Sessões com expiração automática
- Middleware de proteção de rotas

### **Segurança de Dados**
- Senhas criptografadas (bcrypt)
- Validação de entrada
- Sanitização de dados
- Rate limiting

### **AWS Security**
- VPC com subnets privadas
- Security Groups restritivos
- Encryption em repouso (RDS)
- HTTPS obrigatório (CloudFront)

---

## 📊 **Monitoramento**

### **Logs**
```bash
# Ver logs do backend
aws logs tail /ecs/restaurant-management --follow

# Filtrar erros
aws logs filter-log-events \
  --log-group-name /ecs/restaurant-management \
  --filter-pattern "ERROR"
```

### **Health Checks**
- Backend: `/health`
- Frontend: Status de build
- Database: Connection pooling

### **Métricas**
- Performance da aplicação
- Uso de recursos AWS
- Tempo de resposta
- Taxa de erro

---

## 🧪 **Testes**

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🔄 **CI/CD**

### **GitHub Actions** (configurar)
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: ./aws-deploy.sh
```

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- TypeScript strict mode
- ESLint + Prettier
- Conventional Commits
- Tests obrigatórios

---

## 📚 **Documentação**

- [Guia de Deploy AWS](./AWS_DEPLOY_GUIDE.md)
- [Documentação da API](./backend/docs/api.md)
- [Componentes Frontend](./frontend/docs/components.md)
- [EventBus Guide](./docs/eventbus.md)

---

## 🐛 **Troubleshooting**

### **Problemas Comuns**

#### **"Verbindung zum Server fehlgeschlagen"**
```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Restart do backend
cd backend && npm run dev
```

#### **Erro de CORS**
- Verificar `FRONTEND_URL` no backend
- Configurar CORS_ORIGIN corretamente

#### **Database connection error**
```bash
# Regenerar Prisma client
npx prisma generate

# Reset database
npx prisma migrate reset
```

### **AWS Troubleshooting**
- [AWS_DEPLOY_GUIDE.md - Seção Troubleshooting](./AWS_DEPLOY_GUIDE.md#troubleshooting)

---

## 🎯 **Roadmap**

### **Próximas Funcionalidades**
- [ ] App mobile (React Native)
- [ ] Integração com delivery apps
- [ ] IA para previsão de demanda
- [ ] API para integração externa
- [ ] Multi-idioma (i18n)
- [ ] Sistema de relatórios avançado
- [ ] Integração com sistemas de pagamento

### **Melhorias Técnicas**
- [ ] Migrate para Server Components (Next.js)
- [ ] Implementar Redis para cache
- [ ] Adicionar Elasticsearch para busca
- [ ] Implementar WebSockets para real-time
- [ ] Adicionar testes automatizados
- [ ] Configurar CI/CD completo

---

## 📄 **Licença**

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 **Equipe**

- **Desenvolvedor Principal**: Restaurant Management Team
- **Arquitetura AWS**: DevOps Team
- **UI/UX**: Design Team

---

## 📞 **Suporte**

Para problemas ou dúvidas:

1. 📖 Consulte esta documentação
2. 🔍 Verifique [Issues](../../issues) existentes
3. 📧 Entre em contato: support@restaurant-management.com
4. 💬 Discord: [Restaurant Management Community](https://discord.gg/restaurant-mgmt)

---

**🎉 Sistema Restaurant Management - Gestão completa para seu restaurante na nuvem!** 
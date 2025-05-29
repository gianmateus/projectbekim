# 🚀 Guia de Configuração Completa

Este guia irá te ajudar a configurar todo o sistema de gestão financeira do restaurante do zero.

## 📋 Pré-requisitos

### Software Necessário
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 13+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **VSCode** ou editor de sua preferência

### Verificar Instalações
```bash
node --version          # deve mostrar v18+
npm --version           # deve mostrar 9+
psql --version          # deve mostrar 13+
git --version           # qualquer versão recente
```

## 🗄️ Configuração do Banco de Dados

### 1. Criar Banco PostgreSQL
```bash
# Acessar PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE restaurant_financial_db;

# Criar usuário (opcional)
CREATE USER restaurant_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE restaurant_financial_db TO restaurant_user;

# Sair do psql
\q
```

### 2. URL de Conexão
Anote a URL de conexão do seu banco:
```
postgresql://restaurant_user:sua_senha_segura@localhost:5432/restaurant_financial_db
```

## ⚙️ Configuração do Backend

### 1. Navegar para a pasta backend
```bash
cd backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar o arquivo .env com suas configurações
nano .env  # ou use seu editor preferido
```

### 4. Configurações no arquivo .env
```env
# Ambiente
NODE_ENV=development
PORT=3001

# Frontend
FRONTEND_URL=http://localhost:3000

# Banco de dados (IMPORTANTE: use sua URL real)
DATABASE_URL="postgresql://restaurant_user:sua_senha_segura@localhost:5432/restaurant_financial_db"

# JWT (IMPORTANTE: use uma chave única e segura)
JWT_SECRET=sua-chave-jwt-super-secreta-aqui-128-caracteres-minimo
JWT_EXPIRES_IN=7d

# Uploads
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Email (opcional para desenvolvimento)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app

# App
APP_NAME="Restaurant Financial Management"
APP_VERSION=1.0.0
```

### 5. Configurar banco de dados
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações (criar tabelas)
npm run db:migrate

# Popular com dados iniciais (opcional)
npm run db:seed
```

### 6. Testar backend
```bash
# Executar em desenvolvimento
npm run dev

# O servidor deve iniciar em http://localhost:3001
# Teste: curl http://localhost:3001/health
```

## 🎨 Configuração do Frontend

### 1. Abrir novo terminal e navegar para frontend
```bash
cd ../frontend  # assumindo que você estava em backend/
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Executar em desenvolvimento
```bash
npm run dev

# O frontend deve iniciar em http://localhost:3000
```

## 🧪 Verificação da Instalação

### 1. Backend Health Check
```bash
curl http://localhost:3001/health
```
**Resposta esperada:**
```json
{
  "status": "OK",
  "message": "Restaurant Financial Management API is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development"
}
```

### 2. Frontend
Acesse `http://localhost:3000` no navegador. Você deve ver a página inicial do sistema.

### 3. Banco de dados
```bash
# No diretório backend
npm run db:studio
```
Isso abrirá o Prisma Studio em `http://localhost:5555` para visualizar/editar dados.

## 🛠️ Scripts Úteis

### Backend
```bash
# Desenvolvimento
npm run dev                 # Executar com hot reload
npm run build              # Build de produção
npm run start              # Executar build de produção
npm run type-check         # Verificar tipos TypeScript
npm run lint               # Verificar código

# Banco de dados
npm run db:generate        # Gerar cliente Prisma
npm run db:migrate         # Executar migrações
npm run db:studio          # Abrir interface visual
npm run db:seed            # Popular dados iniciais
```

### Frontend
```bash
# Desenvolvimento
npm run dev                # Executar com hot reload
npm run build              # Build de produção
npm run start              # Executar build de produção
npm run type-check         # Verificar tipos TypeScript
npm run lint               # Verificar código
```

## 🚨 Resolução de Problemas

### Erro de conexão com banco
1. Verificar se PostgreSQL está rodando
2. Verificar URL de conexão no `.env`
3. Verificar permissões do usuário
4. Testar conexão: `psql -d restaurant_financial_db -U restaurant_user`

### Erro "Cannot find module"
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de porta em uso
```bash
# Verificar o que está usando a porta
lsof -i :3001  # para backend
lsof -i :3000  # para frontend

# Matar processo se necessário
kill -9 <PID>
```

### Erro de migração Prisma
```bash
# Reset completo do banco (CUIDADO: apaga todos os dados)
npm run db:reset

# Ou gerar e aplicar manualmente
npx prisma generate
npx prisma db push
```

## 📱 Próximos Passos

Após a configuração bem-sucedida:

1. **Explorar a API**: Use Postman ou similar para testar endpoints
2. **Desenvolver componentes**: Comece pelos componentes básicos da UI
3. **Implementar autenticação**: Configure login/logout
4. **Adicionar funcionalidades**: Implemente módulos um por vez
5. **Testes**: Configure testes unitários e de integração

## 🔒 Segurança em Produção

Quando for para produção, lembre-se de:
- Usar HTTPS
- Configurar CORS adequadamente
- Usar variáveis de ambiente seguras
- Configurar rate limiting
- Implementar logs de auditoria
- Backup regular do banco de dados

## 📞 Suporte

Se encontrar problemas, verifique:
1. Este documento
2. READMEs específicos (`frontend/README.md`, `backend/README.md`)
3. Logs de erro no terminal
4. Documentação das tecnologias utilizadas 
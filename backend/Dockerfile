# Dockerfile para o Backend Node.js
FROM node:18-alpine AS build

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar TODAS as dependências para build
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação TypeScript
RUN npm run build

# Stage de produção
FROM node:18-alpine AS production

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client para produção
RUN npx prisma generate

# Copiar código compilado da stage de build
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist

# Copiar outros arquivos necessários
COPY --chown=nodejs:nodejs .env.production ./.env

# Criar diretório para uploads
RUN mkdir -p uploads && chown nodejs:nodejs uploads

# Criar script de inicialização
RUN echo '#!/bin/sh\n\
echo "🚀 Iniciando Restaurant Management Backend..."\n\
echo "📊 Verificando banco de dados..."\n\
npx prisma migrate deploy || echo "⚠️  Migrations falharam - continuando..."\n\
echo "🌱 Executando seed se necessário..."\n\
npx prisma db seed || echo "ℹ️  Seed não executado"\n\
echo "✅ Iniciando servidor..."\n\
exec "$@"' > /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Comando de entrada
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"] 
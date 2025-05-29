# Dockerfile para o Backend Node.js
FROM node:18-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client
RUN npx prisma generate

# Stage de produção
FROM node:18-alpine AS production

WORKDIR /app

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copiar arquivos da stage base
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/prisma ./prisma

# Copiar código fonte
COPY --chown=nodejs:nodejs . .

# Build da aplicação
RUN npm run build

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
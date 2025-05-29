# 🚀 Guia Completo de Deploy AWS - Restaurant Management System

## 📋 **Visão Geral da Arquitetura**

### **Serviços AWS Utilizados:**
- **Frontend**: S3 + CloudFront (CDN)
- **Backend**: ECS Fargate + Application Load Balancer
- **Database**: RDS PostgreSQL
- **Container Registry**: ECR
- **Networking**: VPC, Subnets, Security Groups
- **Monitoring**: CloudWatch Logs
- **Infrastructure**: CloudFormation

---

## 🛠️ **Pré-requisitos**

### **1. Ferramentas Necessárias:**
```bash
# AWS CLI
aws --version

# Docker
docker --version

# Node.js 18+
node --version
npm --version

# Git
git --version
```

### **2. Configuração AWS:**
```bash
# Configurar credenciais AWS
aws configure

# Verificar configuração
aws sts get-caller-identity
```

### **3. Permissões IAM Necessárias:**
- CloudFormation: Full Access
- ECR: Full Access
- ECS: Full Access
- RDS: Full Access
- S3: Full Access
- CloudFront: Full Access
- VPC: Full Access
- IAM: Create/Attach roles

---

## 🚀 **Deploy Automático (Recomendado)**

### **Opção 1: Script Automático**
```bash
# Tornar script executável
chmod +x aws-deploy.sh

# Executar deploy
./aws-deploy.sh

# Ou com variáveis customizadas
AWS_REGION=us-east-1 STACK_NAME=meu-restaurante ./aws-deploy.sh
```

### **Opção 2: Docker Compose + Deploy**
```bash
# Build e teste local
npm run docker:build
npm run docker:up

# Deploy para produção
npm run aws:deploy
```

---

## 🏗️ **Deploy Manual Passo a Passo**

### **Passo 1: Preparar o Projeto**
```bash
# Instalar dependências
npm run install:all

# Build do projeto
npm run build
```

### **Passo 2: Configurar Banco de Dados**
```bash
# Atualizar schema Prisma para PostgreSQL
cd backend
# Editar prisma/schema.prisma
# provider = "postgresql"

# Gerar migrações
npx prisma migrate dev --name init-postgres

# Gerar cliente
npx prisma generate
```

### **Passo 3: Criar Repositório ECR**
```bash
# Criar repositório
aws ecr create-repository --repository-name restaurant-management --region us-east-1

# Login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
```

### **Passo 4: Build e Push da Imagem Docker**
```bash
# Build da imagem
docker build -t restaurant-management:backend ./backend/

# Tag da imagem
docker tag restaurant-management:backend <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/restaurant-management:backend

# Push da imagem
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/restaurant-management:backend
```

### **Passo 5: Deploy da Infraestrutura**
```bash
# Deploy do CloudFormation
aws cloudformation deploy \
  --template-file infrastructure/cloudformation.yaml \
  --stack-name restaurant-management \
  --parameter-overrides \
    DBPassword=SuaSenhaSegura123! \
    ECRRepository=restaurant-management \
  --capabilities CAPABILITY_IAM \
  --region us-east-1
```

### **Passo 6: Deploy do Frontend**
```bash
# Build do frontend
cd frontend
npm run build

# Obter nome do bucket
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name restaurant-management \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucket`].OutputValue' \
  --output text)

# Upload para S3
aws s3 sync out/ s3://$BUCKET_NAME/ --delete
```

---

## 🔧 **Configurações Específicas**

### **1. Variáveis de Ambiente de Produção:**
```bash
# Obter URLs após deploy
ALB_URL=$(aws cloudformation describe-stacks \
  --stack-name restaurant-management \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' \
  --output text)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name restaurant-management \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
  --output text)

DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name restaurant-management \
  --query 'Stacks[0].Outputs[?OutputKey==`DatabaseEndpoint`].OutputValue' \
  --output text)
```

### **2. Configurar Next.js para Produção:**
```javascript
// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  }
}

module.exports = nextConfig
```

### **3. Configurar CORS no Backend:**
```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    process.env.CLOUDFRONT_URL,
    'https://yourdomain.com'
  ],
  credentials: true
}));
```

---

## 📊 **Monitoramento e Logs**

### **1. CloudWatch Logs:**
```bash
# Ver logs do backend
aws logs tail /ecs/restaurant-management --follow --region us-east-1

# Filtrar logs por erro
aws logs filter-log-events \
  --log-group-name /ecs/restaurant-management \
  --filter-pattern "ERROR" \
  --region us-east-1
```

### **2. Health Checks:**
```bash
# Verificar saúde do backend
curl http://<ALB_URL>/health

# Verificar frontend
curl https://<CLOUDFRONT_URL>
```

---

## 🔐 **Segurança e Backup**

### **1. Backup do Banco de Dados:**
```bash
# Configurar backup automático (já incluído no CloudFormation)
# Retention: 7 dias
# Janela de backup: 3:00-4:00 AM UTC
```

### **2. SSL/TLS:**
```bash
# Adicionar certificado SSL (opcional)
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### **3. Secrets Manager:**
```bash
# Armazenar senhas sensíveis
aws secretsmanager create-secret \
  --name restaurant-management/db-password \
  --description "Database password for restaurant management" \
  --secret-string "SuaSenhaSegura123!" \
  --region us-east-1
```

---

## 💰 **Estimativa de Custos**

### **Custos Mensais Estimados (us-east-1):**
- **RDS t3.micro**: ~$15-20/mês
- **ECS Fargate**: ~$25-35/mês
- **ALB**: ~$18/mês
- **S3 + CloudFront**: ~$5-10/mês
- **ECR**: ~$1-2/mês
- **CloudWatch**: ~$5/mês

**Total Estimado: $69-90/mês**

### **Otimização de Custos:**
- Use Reserved Instances para RDS
- Configure Auto Scaling para ECS
- Ative compressão no CloudFront
- Use S3 Intelligent Tiering

---

## 🛟 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Task Definition não inicia:**
```bash
# Verificar logs
aws ecs describe-services \
  --cluster restaurant-management-cluster \
  --services restaurant-management-backend-service \
  --region us-east-1
```

#### **2. Conexão com banco falha:**
```bash
# Verificar security groups
aws ec2 describe-security-groups \
  --group-names restaurant-management-rds-sg \
  --region us-east-1
```

#### **3. Frontend não carrega:**
```bash
# Verificar bucket policy
aws s3api get-bucket-policy \
  --bucket restaurant-management-frontend-<ACCOUNT_ID>
```

---

## 🔄 **CI/CD Pipeline (Opcional)**

### **GitHub Actions:**
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
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to AWS
        run: ./aws-deploy.sh
```

---

## 📚 **URLs e Recursos**

### **URLs do Sistema (após deploy):**
- **Frontend**: https://`<CLOUDFRONT_DOMAIN>`
- **Backend API**: http://`<ALB_DOMAIN>`
- **Health Check**: http://`<ALB_DOMAIN>`/health

### **Documentação Útil:**
- [AWS ECS Guide](https://docs.aws.amazon.com/ecs/)
- [CloudFormation Reference](https://docs.aws.amazon.com/cloudformation/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production](https://www.prisma.io/docs/guides/deployment)

---

## 🎯 **Próximos Passos**

1. **Configurar domínio customizado**
2. **Implementar SSL/TLS**
3. **Configurar backup automático**
4. **Implementar CI/CD**
5. **Configurar monitoramento avançado**
6. **Implementar auto-scaling**

---

## 📞 **Suporte**

Para problemas ou dúvidas:
1. Verificar logs no CloudWatch
2. Consultar este guia
3. Verificar status dos serviços AWS
4. Contactar equipe de desenvolvimento

**Sistema pronto para produção na AWS! 🚀** 
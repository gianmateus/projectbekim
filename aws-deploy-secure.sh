#!/bin/bash

# Script de Deploy SEGURO para AWS - Restaurant Management System
# Autor: Restaurant Management Team
# Versão: 2.0.0 - PRODUÇÃO SEGURA

set -e

echo "🔒 Iniciando deploy SEGURO do Restaurant Management System na AWS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis de configuração
AWS_REGION=${AWS_REGION:-"us-east-1"}
STACK_NAME=${STACK_NAME:-"restaurant-management"}
ECR_REPOSITORY=${ECR_REPOSITORY:-"restaurant-management"}

# Função para imprimir mensagens coloridas
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validar pré-requisitos
validate_prerequisites() {
    print_status "Validando pré-requisitos de segurança..."
    
    # Verificar AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI não está instalado!"
        exit 1
    fi
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado!"
        exit 1
    fi
    
    # Verificar credenciais AWS
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "Credenciais AWS não configuradas!"
        exit 1
    fi
    
    # Verificar se template seguro existe
    if [[ ! -f "infrastructure/cloudformation-secure.yaml" ]]; then
        print_error "Template CloudFormation seguro não encontrado!"
        exit 1
    fi
    
    print_success "Pré-requisitos validados"
}

# Coletar informações do usuário
collect_user_input() {
    print_status "Coletando informações do usuário..."
    
    # Email do administrador
    while [[ -z "$ADMIN_EMAIL" ]]; do
        read -p "📧 Digite o email do administrador: " ADMIN_EMAIL
        if [[ ! "$ADMIN_EMAIL" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
            print_error "Email inválido!"
            ADMIN_EMAIL=""
        fi
    done
    
    # Nome do restaurante
    read -p "🏪 Nome do restaurante (opcional): " RESTAURANT_NAME
    RESTAURANT_NAME=${RESTAURANT_NAME:-"Meu Restaurante"}
    
    # Confirmação
    echo ""
    print_warning "⚠️  CONFIGURAÇÕES DE DEPLOY:"
    echo "   📧 Admin Email: $ADMIN_EMAIL"
    echo "   🏪 Restaurante: $RESTAURANT_NAME"
    echo "   🌍 Região AWS: $AWS_REGION"
    echo "   📦 Stack Name: $STACK_NAME"
    echo ""
    
    read -p "Confirma o deploy? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        print_error "Deploy cancelado pelo usuário"
        exit 1
    fi
}

# Criar repositório ECR
setup_ecr() {
    print_status "Configurando ECR..."
    
    if aws ecr describe-repositories --repository-names "$ECR_REPOSITORY" --region "$AWS_REGION" &> /dev/null; then
        print_warning "Repositório ECR já existe"
    else
        aws ecr create-repository --repository-name "$ECR_REPOSITORY" --region "$AWS_REGION"
        print_success "Repositório ECR criado"
    fi
}

# Build e push das imagens Docker
build_and_deploy_backend() {
    print_status "Fazendo build e deploy do backend..."
    
    # Login no ECR
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin \
        "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com"
    
    ECR_URI="$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"
    
    # Build da imagem com multi-stage para segurança
    print_status "Building imagem segura do backend..."
    docker build -t "$ECR_REPOSITORY:backend" ./backend/ \
        --build-arg NODE_ENV=production \
        --no-cache
    
    docker tag "$ECR_REPOSITORY:backend" "$ECR_URI:backend"
    
    # Push da imagem
    print_status "Fazendo push da imagem..."
    docker push "$ECR_URI:backend"
    
    print_success "Backend deployado no ECR"
}

# Deploy da infraestrutura SEGURA
deploy_infrastructure() {
    print_status "Fazendo deploy da infraestrutura SEGURA..."
    
    aws cloudformation deploy \
        --template-file infrastructure/cloudformation-secure.yaml \
        --stack-name "$STACK_NAME" \
        --parameter-overrides \
            "AdminEmail=$ADMIN_EMAIL" \
            "ECRRepository=$ECR_REPOSITORY" \
        --capabilities CAPABILITY_IAM \
        --region "$AWS_REGION" \
        --no-fail-on-empty-changeset
    
    if [[ $? -eq 0 ]]; then
        print_success "Infraestrutura segura deployada!"
    else
        print_error "Falha no deploy da infraestrutura"
        exit 1
    fi
}

# Deploy do frontend
deploy_frontend() {
    print_status "Fazendo deploy do frontend..."
    
    # Obter nome do bucket
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucket`].OutputValue' \
        --output text \
        --region "$AWS_REGION")
    
    if [[ -z "$BUCKET_NAME" ]]; then
        print_error "Não foi possível obter o nome do bucket S3"
        exit 1
    fi
    
    # Build do frontend
    cd frontend
    npm ci --only=production
    npm run build
    cd ..
    
    # Upload para S3
    aws s3 sync frontend/out/ "s3://$BUCKET_NAME/" --delete --region "$AWS_REGION"
    
    print_success "Frontend deployado no S3"
}

# Obter informações finais
get_deployment_info() {
    print_status "Obtendo informações do deployment..."
    
    # URLs
    CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
        --output text \
        --region "$AWS_REGION" 2>/dev/null)
    
    # Secrets ARNs
    ADMIN_SECRET_ARN=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --query 'Stacks[0].Outputs[?OutputKey==`AdminSecretArn`].OutputValue' \
        --output text \
        --region "$AWS_REGION" 2>/dev/null)
    
    # Obter credenciais do administrador
    if [[ -n "$ADMIN_SECRET_ARN" ]]; then
        ADMIN_PASSWORD=$(aws secretsmanager get-secret-value \
            --secret-id "$ADMIN_SECRET_ARN" \
            --query 'SecretString' \
            --output text \
            --region "$AWS_REGION" | jq -r '.password')
    fi
    
    echo ""
    print_success "🎉 DEPLOY SEGURO CONCLUÍDO COM SUCESSO!"
    echo ""
    print_warning "📋 INFORMAÇÕES DE ACESSO:"
    echo "   🌐 URL do Sistema: $CLOUDFRONT_URL"
    echo "   📧 Email Admin: $ADMIN_EMAIL"
    echo "   🔐 Senha Admin: $ADMIN_PASSWORD"
    echo ""
    print_warning "🔒 CREDENCIAIS SEGURAS:"
    echo "   ✅ Senhas geradas automaticamente"
    echo "   ✅ Armazenadas no AWS Secrets Manager"
    echo "   ✅ HTTPS obrigatório"
    echo "   ✅ WAF ativo para proteção"
    echo "   ✅ Rate limiting configurado"
    echo "   ✅ Backup automático (30 dias)"
    echo ""
    print_warning "⚠️  IMPORTANTE:"
    echo "   • Anote as credenciais acima com SEGURANÇA"
    echo "   • O acesso é apenas via HTTPS"
    echo "   • Máximo 5 tentativas de login por 15 min"
    echo "   • Logs são monitorados no CloudWatch"
    echo ""
}

# Função principal
main() {
    validate_prerequisites
    collect_user_input
    setup_ecr
    build_and_deploy_backend
    deploy_infrastructure
    deploy_frontend
    get_deployment_info
}

# Executar script principal
main "$@" 
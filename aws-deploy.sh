#!/bin/bash

# Script de Deploy para AWS - Restaurant Management System
# Autor: Restaurant Management Team
# Versão: 1.0.0

set -e

echo "🚀 Iniciando deploy do Restaurant Management System na AWS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis de configuração
AWS_REGION=${AWS_REGION:-"us-east-1"}
STACK_NAME=${STACK_NAME:-"restaurant-management"}
S3_BUCKET_NAME=${S3_BUCKET_NAME:-"restaurant-management-deploy-$(date +%s)"}
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

# Verificar se AWS CLI está instalado
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI não está instalado. Por favor, instale primeiro."
        exit 1
    fi
    print_success "AWS CLI encontrado"
}

# Verificar se Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado. Por favor, instale primeiro."
        exit 1
    fi
    print_success "Docker encontrado"
}

# Verificar credenciais AWS
check_aws_credentials() {
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "Credenciais AWS não configuradas. Execute: aws configure"
        exit 1
    fi
    print_success "Credenciais AWS verificadas"
}

# Criar S3 bucket para deploy se não existir
create_s3_bucket() {
    print_status "Verificando bucket S3: $S3_BUCKET_NAME"
    
    if ! aws s3 ls "s3://$S3_BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
        print_warning "Bucket já existe: $S3_BUCKET_NAME"
    else
        print_status "Criando bucket S3: $S3_BUCKET_NAME"
        aws s3 mb "s3://$S3_BUCKET_NAME" --region "$AWS_REGION"
        print_success "Bucket S3 criado: $S3_BUCKET_NAME"
    fi
}

# Criar ECR repository se não existir
create_ecr_repository() {
    print_status "Verificando repositório ECR: $ECR_REPOSITORY"
    
    if aws ecr describe-repositories --repository-names "$ECR_REPOSITORY" --region "$AWS_REGION" &> /dev/null; then
        print_warning "Repositório ECR já existe: $ECR_REPOSITORY"
    else
        print_status "Criando repositório ECR: $ECR_REPOSITORY"
        aws ecr create-repository --repository-name "$ECR_REPOSITORY" --region "$AWS_REGION"
        print_success "Repositório ECR criado: $ECR_REPOSITORY"
    fi
}

# Build e push das imagens Docker
build_and_push_images() {
    print_status "Fazendo login no ECR..."
    aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com"
    
    ECR_URI="$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"
    
    print_status "Construindo imagem do backend..."
    docker build -t "$ECR_REPOSITORY:backend" ./backend/
    docker tag "$ECR_REPOSITORY:backend" "$ECR_URI:backend"
    
    print_status "Fazendo push da imagem do backend..."
    docker push "$ECR_URI:backend"
    
    print_success "Imagens Docker enviadas para ECR"
}

# Build do frontend para S3
build_frontend() {
    print_status "Construindo frontend..."
    cd frontend
    npm ci
    npm run build
    cd ..
    
    print_status "Enviando frontend para S3..."
    aws s3 sync frontend/out/ "s3://$S3_BUCKET_NAME-frontend/" --delete
    
    print_success "Frontend enviado para S3"
}

# Deploy da infraestrutura usando CloudFormation
deploy_infrastructure() {
    print_status "Fazendo deploy da infraestrutura..."
    
    # Aqui você adicionaria o template CloudFormation
    # aws cloudformation deploy \
    #   --template-file infrastructure/cloudformation.yaml \
    #   --stack-name "$STACK_NAME" \
    #   --parameter-overrides \
    #     S3BucketName="$S3_BUCKET_NAME-frontend" \
    #     ECRRepository="$ECR_REPOSITORY" \
    #   --capabilities CAPABILITY_IAM \
    #   --region "$AWS_REGION"
    
    print_warning "Template CloudFormation não implementado ainda"
}

# Função principal
main() {
    print_status "Iniciando verificações..."
    
    check_aws_cli
    check_docker
    check_aws_credentials
    
    print_status "Preparando infraestrutura..."
    
    create_s3_bucket
    create_ecr_repository
    
    print_status "Fazendo build e deploy..."
    
    build_and_push_images
    build_frontend
    deploy_infrastructure
    
    print_success "Deploy concluído com sucesso!"
    print_status "Frontend URL: http://$S3_BUCKET_NAME-frontend.s3-website-$AWS_REGION.amazonaws.com"
    print_status "Backend ECR: $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY:backend"
}

# Executar script principal
main "$@" 
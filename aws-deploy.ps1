# Script de Deploy para AWS - Restaurant Management System (PowerShell)
# Autor: Restaurant Management Team
# Versão: 1.0.0

param(
    [string]$AwsRegion = "us-east-1",
    [string]$StackName = "restaurant-management",
    [string]$EcrRepository = "restaurant-management"
)

# Configurações
$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando deploy do Restaurant Management System na AWS..." -ForegroundColor Green

# Função para imprimir mensagens coloridas
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar se AWS CLI está instalado
function Test-AwsCli {
    Write-Status "Verificando AWS CLI..."
    try {
        $awsVersion = aws --version 2>&1
        Write-Success "AWS CLI encontrado: $awsVersion"
    } catch {
        Write-Error "AWS CLI não está instalado. Por favor, instale primeiro."
        exit 1
    }
}

# Verificar se Docker está instalado
function Test-Docker {
    Write-Status "Verificando Docker..."
    try {
        $dockerVersion = docker --version
        Write-Success "Docker encontrado: $dockerVersion"
    } catch {
        Write-Error "Docker não está instalado. Por favor, instale primeiro."
        exit 1
    }
}

# Verificar credenciais AWS
function Test-AwsCredentials {
    Write-Status "Verificando credenciais AWS..."
    try {
        $identity = aws sts get-caller-identity 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Credenciais AWS verificadas"
        } else {
            throw "Credenciais inválidas"
        }
    } catch {
        Write-Error "Credenciais AWS não configuradas. Execute: aws configure"
        exit 1
    }
}

# Criar bucket S3 se não existir
function New-S3BucketIfNotExists {
    param([string]$BucketName)
    
    Write-Status "Verificando bucket S3: $BucketName"
    
    $bucketExists = aws s3 ls "s3://$BucketName" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "Bucket já existe: $BucketName"
    } else {
        Write-Status "Criando bucket S3: $BucketName"
        aws s3 mb "s3://$BucketName" --region $AwsRegion
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Bucket S3 criado: $BucketName"
        } else {
            Write-Error "Falha ao criar bucket S3"
            exit 1
        }
    }
}

# Criar repositório ECR se não existir
function New-EcrRepositoryIfNotExists {
    param([string]$RepositoryName)
    
    Write-Status "Verificando repositório ECR: $RepositoryName"
    
    $repoExists = aws ecr describe-repositories --repository-names $RepositoryName --region $AwsRegion 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Warning "Repositório ECR já existe: $RepositoryName"
    } else {
        Write-Status "Criando repositório ECR: $RepositoryName"
        aws ecr create-repository --repository-name $RepositoryName --region $AwsRegion
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Repositório ECR criado: $RepositoryName"
        } else {
            Write-Error "Falha ao criar repositório ECR"
            exit 1
        }
    }
}

# Build e push das imagens Docker
function Build-And-Push-Images {
    param([string]$RepositoryName)
    
    Write-Status "Fazendo login no ECR..."
    $accountId = (aws sts get-caller-identity --query Account --output text)
    $loginCmd = aws ecr get-login-password --region $AwsRegion
    $loginCmd | docker login --username AWS --password-stdin "$accountId.dkr.ecr.$AwsRegion.amazonaws.com"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no login do ECR"
        exit 1
    }
    
    $ecrUri = "$accountId.dkr.ecr.$AwsRegion.amazonaws.com/$RepositoryName"
    
    Write-Status "Construindo imagem do backend..."
    docker build -t "${RepositoryName}:backend" ./backend/
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no build da imagem do backend"
        exit 1
    }
    
    docker tag "${RepositoryName}:backend" "${ecrUri}:backend"
    
    Write-Status "Fazendo push da imagem do backend..."
    docker push "${ecrUri}:backend"
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Imagens Docker enviadas para ECR"
    } else {
        Write-Error "Falha no push da imagem"
        exit 1
    }
}

# Build do frontend para S3
function Build-Frontend {
    param([string]$BucketName)
    
    Write-Status "Construindo frontend..."
    Set-Location frontend
    npm ci
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha na instalação das dependências do frontend"
        Set-Location ..
        exit 1
    }
    
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no build do frontend"
        Set-Location ..
        exit 1
    }
    
    Set-Location ..
    
    Write-Status "Enviando frontend para S3..."
    aws s3 sync frontend/out/ "s3://$BucketName-frontend/" --delete
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend enviado para S3"
    } else {
        Write-Error "Falha no upload do frontend"
        exit 1
    }
}

# Deploy da infraestrutura usando CloudFormation
function Deploy-Infrastructure {
    param([string]$StackName, [string]$RepositoryName)
    
    Write-Status "Fazendo deploy da infraestrutura..."
    
    if (Test-Path "infrastructure/cloudformation.yaml") {
        Write-Status "Executando CloudFormation..."
        
        # Solicitar senha do banco de dados
        $dbPassword = Read-Host "Digite a senha do banco de dados (min 8 caracteres)" -AsSecureString
        $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
        
        aws cloudformation deploy `
            --template-file infrastructure/cloudformation.yaml `
            --stack-name $StackName `
            --parameter-overrides `
            "ECRRepository=$RepositoryName" `
            "DBPassword=$dbPasswordPlain" `
            --capabilities CAPABILITY_IAM `
            --region $AwsRegion
            
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Infraestrutura deployada com sucesso!"
        } else {
            Write-Error "Falha no deploy da infraestrutura"
            exit 1
        }
    } else {
        Write-Warning "Template CloudFormation não encontrado - pulando deploy da infraestrutura"
    }
}

# Função principal
function Main {
    Write-Status "Iniciando verificações..."
    
    Test-AwsCli
    Test-Docker
    Test-AwsCredentials
    
    Write-Status "Preparando infraestrutura..."
    
    $accountId = (aws sts get-caller-identity --query Account --output text)
    $s3BucketName = "$StackName-deploy-$(Get-Date -Format 'yyyyMMddHHmmss')"
    
    New-S3BucketIfNotExists -BucketName $s3BucketName
    New-EcrRepositoryIfNotExists -RepositoryName $EcrRepository
    
    Write-Status "Fazendo build e deploy..."
    
    Build-And-Push-Images -RepositoryName $EcrRepository
    Deploy-Infrastructure -StackName $StackName -RepositoryName $EcrRepository
    Build-Frontend -BucketName $s3BucketName
    
    Write-Success "Deploy concluído com sucesso!"
    
    # Obter URLs finais
    Write-Status "Obtendo URLs do sistema..."
    
    $albUrl = aws cloudformation describe-stacks --stack-name $StackName --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerURL`].OutputValue' --output text --region $AwsRegion 2>$null
    $cloudfrontUrl = aws cloudformation describe-stacks --stack-name $StackName --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' --output text --region $AwsRegion 2>$null
    
    Write-Host "`n📋 URLs do Sistema:" -ForegroundColor Cyan
    if ($albUrl) {
        Write-Host "Backend API: $albUrl" -ForegroundColor White
    }
    if ($cloudfrontUrl) {
        Write-Host "Frontend: $cloudfrontUrl" -ForegroundColor White
    }
    Write-Host "S3 Frontend: http://$s3BucketName-frontend.s3-website-$AwsRegion.amazonaws.com" -ForegroundColor White
    Write-Host "ECR Backend: $accountId.dkr.ecr.$AwsRegion.amazonaws.com/${EcrRepository}:backend" -ForegroundColor White
    
    Write-Host "`n🎉 Sistema Restaurant Management deployado com sucesso na AWS!" -ForegroundColor Green
}

# Executar script principal
try {
    Main
} catch {
    Write-Error "Erro durante o deploy: $_"
    exit 1
} 
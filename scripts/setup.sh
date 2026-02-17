#!/bin/bash

# VAMMOS Setup Script
# Instala e configura tudo automaticamente

set -e

echo "🚀 VAMMOS - Setup Automático"
echo "================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar pré-requisitos
echo -e "\n${BLUE}1️⃣  Verificando pré-requisitos...${NC}"

check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 não instalado!${NC}"
        echo "   Instale de: $2"
        exit 1
    fi
    echo -e "${GREEN}✓ $1${NC}"
}

check_command "node" "https://nodejs.org/"
check_command "npm" "https://nodejs.org/"
check_command "git" "https://git-scm.com/"
check_command "docker" "https://docker.com/"
check_command "docker-compose" "https://docker.com/"

# Verificar versões
echo -e "\n${BLUE}Versões instaladas:${NC}"
echo "  Node: $(node --version)"
echo "  npm: $(npm --version)"
echo "  Docker: $(docker --version)"
echo "  Docker Compose: $(docker-compose --version)"

# 2. Configurar ambiente
echo -e "\n${BLUE}2️⃣  Configurando variáveis de ambiente...${NC}"

# .env raiz
if [ ! -f .env ]; then
    echo "  Criando .env (raiz)..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "  ${GREEN}✓ .env criado${NC}"
    else
        echo -e "  ${YELLOW}⚠️  .env.example não encontrado${NC}"
    fi
else
    echo -e "  ✓ .env já existe"
fi

# backend/.env
if [ ! -f backend/.env ]; then
    echo "  Criando backend/.env..."
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
        echo -e "  ${GREEN}✓ backend/.env criado${NC}"
    else
        echo -e "  ${YELLOW}⚠️  backend/.env.example não encontrado${NC}"
    fi
else
    echo -e "  ✓ backend/.env já existe"
fi

# frontend/.env.local
if [ ! -f frontend/.env.local ]; then
    echo "  Criando frontend/.env.local..."
    if [ -f frontend/.env.example ]; then
        cp frontend/.env.example frontend/.env.local
        echo -e "  ${GREEN}✓ frontend/.env.local criado${NC}"
    else
        echo -e "  ${YELLOW}⚠️  frontend/.env.example não encontrado${NC}"
    fi
else
    echo -e "  ✓ frontend/.env.local já existe"
fi

# 3. Instalar dependências
echo -e "\n${BLUE}3️⃣  Instalando dependências...${NC}"

if [ ! -d "node_modules" ]; then
    echo "  Instalando dependências raiz..."
    npm install
    echo -e "  ${GREEN}✓ Dependências raiz instaladas${NC}"
else
    echo "  ✓ node_modules raiz já existe"
fi

if [ ! -d "backend/node_modules" ]; then
    echo "  Instalando dependências backend..."
    cd backend
    npm install
    cd ..
    echo -e "  ${GREEN}✓ Dependências backend instaladas${NC}"
else
    echo "  ✓ node_modules backend já existe"
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "  Instalando dependências frontend..."
    cd frontend
    npm install
    cd ..
    echo -e "  ${GREEN}✓ Dependências frontend instaladas${NC}"
else
    echo "  ✓ node_modules frontend já existe"
fi

# 4. Criar diretórios essenciais
echo -e "\n${BLUE}4️⃣  Criando estrutura de diretórios...${NC}"

mkdir -p logs
mkdir -p uploads
mkdir -p backend/coverage
mkdir -p frontend/coverage
mkdir -p backend/__mocks__
mkdir -p frontend/__mocks__

echo -e "${GREEN}✓ Diretórios criados${NC}"

# 5. Resumo Final
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ SETUP COMPLETO!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"

echo -e "\n${BLUE}🎯 Próximos Passos:${NC}"
echo ""
echo "  1️⃣  Iniciar a aplicação:"
echo "     ${YELLOW}docker-compose -f docker-compose.dev.yml up${NC}"
echo ""
echo "  2️⃣  Esperar 30-60 segundos enquanto os containers iniciam"
echo ""
echo "  3️⃣  Acessar URLs:"
echo "     🔗 Frontend:  http://localhost:3000"
echo "     🔗 Backend:   http://localhost:3001"
echo "     🔗 API Docs:  http://localhost:3001/api-docs"
echo ""
echo "  4️⃣  Ler documentação:"
echo "     📖 ${YELLOW}GUIA_RAPIDO.md${NC}"
echo "     📖 ${YELLOW}GUIA_SETUP_INICIAL.md${NC}"
echo ""
echo -e "${BLUE}📚 Para mais informações:${NC}"
echo "   👉 https://github.com/ahri98h/vammos"
echo ""

# 6. Verificação opcional
echo -e "${YELLOW}ℹ️  Dica: Execute 'npm run setup' novamente se tiver problemas${NC}\n"

exit 0

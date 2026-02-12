#!/bin/bash

# 🚀 DEPLOY COMPLETO - Cleaner Leidy
# Este script automatiza todo o processo de deploy em produção
# Uso: bash deploy-production.sh

set -e

# CORES
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}║      🚀 DEPLOY PRODUCTION - CLEANERLEIDY.COM.BR                ║${NC}"
echo -e "${BLUE}║                                                                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# PASSO 1: Validar Requirements
echo -e "${YELLOW}[1/8]${NC} Validando requisitos..."
check_cmd() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}❌ $1 não está instalado!${NC}"
    exit 1
  fi
}

check_cmd docker
check_cmd docker-compose
check_cmd git
echo -e "${GREEN}✅ Requisitos validados${NC}\n"

# PASSO 2: Validar Git Status
echo -e "${YELLOW}[2/8]${NC} Validando repositório Git..."
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${RED}⚠️  Há mudanças não commitadas!${NC}"
  echo "Execute: git status"
  exit 1
fi
echo -e "${GREEN}✅ Git limpo${NC}\n"

# PASSO 3: Validar .env.production
echo -e "${YELLOW}[3/8]${NC} Validando configurações..."
if [ ! -f "backend/.env.production" ]; then
  echo -e "${RED}❌ backend/.env.production não existe!${NC}"
  exit 1
fi

if grep -q "CHANGE_ME" backend/.env.production; then
  echo -e "${RED}⚠️  Ainda há valores CHANGE_ME em backend/.env.production${NC}"
  echo "    Atualize manualmente os seguintes:"
  grep "CHANGE_ME" backend/.env.production | head -5
  exit 1
fi

if [ ! -f "frontend/.env.production" ]; then
  echo -e "${RED}❌ frontend/.env.production não existe!${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Configurações validadas${NC}\n"

# PASSO 4: Pull latest changes
echo -e "${YELLOW}[4/8]${NC} Atualizando repositório..."
git pull origin main
echo -e "${GREEN}✅ Repositório atualizado${NC}\n"

# PASSO 5: Build Docker Images
echo -e "${YELLOW}[5/8]${NC} Compilando Docker images..."
docker-compose -f docker-compose.production.yml build --no-cache
echo -e "${GREEN}✅ Docker images compiladas${NC}\n"

# PASSO 6: Parar containers antigos
echo -e "${YELLOW}[6/8]${NC} Parando containers antigos..."
docker-compose -f docker-compose.production.yml down || true
echo -e "${GREEN}✅ Containers parados${NC}\n"

# PASSO 7: Iniciar nova versão
echo -e "${YELLOW}[7/8]${NC} Iniciando nova versão..."
docker-compose -f docker-compose.production.yml up -d
echo -e "${GREEN}✅ Containers iniciados${NC}\n"

# PASSO 8: Validar Deploy
echo -e "${YELLOW}[8/8]${NC} Validando deploy..."
sleep 10

# Checklist
echo -e "${BLUE}🔍 Validações em progresso...${NC}\n"

# Verificar containers
if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
  echo -e "${GREEN}✅ Todos os containers estão rodando${NC}"
else
  echo -e "${RED}❌ Alguns containers não estão rodando!${NC}"
  docker-compose -f docker-compose.production.yml ps
  exit 1
fi

# Verificar banco de dados
echo "   Testando conexão com banco de dados..."
if docker exec cleanerleidy-db pg_isready -U cleanerleidy > /dev/null 2>&1; then
  echo -e "   ${GREEN}✅ PostgreSQL OK${NC}"
else
  echo -e "   ${RED}❌ PostgreSQL falhou!${NC}"
  exit 1
fi

# Verificar Redis
echo "   Testando conexão com cache..."
if docker exec cleanerleidy-redis redis-cli ping > /dev/null 2>&1; then
  echo -e "   ${GREEN}✅ Redis OK${NC}"
else
  echo -e "   ${RED}❌ Redis falhou!${NC}"
  exit 1
fi

# Verificar Backend
echo "   Testando API backend..."
if docker exec cleanerleidy-backend curl -s http://localhost:3000/api/health | grep -q "ok"; then
  echo -e "   ${GREEN}✅ Backend OK${NC}"
else
  echo -e "   ${RED}⚠️  Backend ainda iniciando...${NC}"
fi

# Verificar Frontend
echo "   Testando frontend..."
if docker exec cleanerleidy-frontend curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "   ${GREEN}✅ Frontend OK${NC}"
else
  echo -e "   ${RED}⚠️  Frontend ainda iniciando...${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║  ✅ DEPLOY CONCLUÍDO COM SUCESSO!                              ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║  🌐 Acesse: https://cleanerleidy.com.br                         ║${NC}"
echo -e "${GREEN}║  📊 API: https://cleanerleidy.com.br/api                        ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "  1. Monitorar logs: ${YELLOW}docker logs -f cleanerleidy-backend${NC}"
echo -e "  2. Configurar SSL: ${YELLOW}docker exec cleanerleidy-certbot certbot certonly --webroot${NC}"
echo -e "  3. Configurar webhooks de pagamento no Stripe/MercadoPago"
echo -e "  4. Fazer backup do banco: ${YELLOW}docker exec cleanerleidy-db pg_dump -U cleanerleidy cleanerleidy > backup.sql${NC}"
echo ""

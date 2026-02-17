#!/bin/bash

# Lint & Format Script
# Verifica e formata código

set -e

echo "🎨 VAMMOS - Lint & Format"
echo "========================\n"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FAILED=0

echo -e "${BLUE}📦 Backend Linting${NC}"
echo "===================="

cd backend

echo -e "${YELLOW}Verificando código...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Backend lint passou${NC}"
else
    echo -e "${RED}✗ Backend lint falhou${NC}"
    ((FAILED++))
fi

echo -e "${YELLOW}Formatando código...${NC}"
if npm run format 2>/dev/null || true; then
    echo -e "${GREEN}✓ Backend formatado${NC}"
fi

cd ..

echo -e "\n${BLUE}🎨 Frontend Linting${NC}"
echo "===================="

cd frontend

echo -e "${YELLOW}Verificando código...${NC}"
if npm run lint; then
    echo -e "${GREEN}✓ Frontend lint passou${NC}"
else
    echo -e "${RED}✗ Frontend lint falhou${NC}"
    ((FAILED++))
fi

echo -e "${YELLOW}Formatando código...${NC}"
if npm run format 2>/dev/null || true; then
    echo -e "${GREEN}✓ Frontend formatado${NC}"
fi

cd ..

# Resumo
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Lint falhou em $FAILED modulo(s)${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Lint passou! Código formatado.${NC}"
fi
echo -e "${GREEN}════════════════════════════════════════${NC}\n"

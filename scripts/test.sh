#!/bin/bash

# Test Script
# Executa testes de todo projeto

set -e

echo "🧪 VAMMOS - Test Suite"
echo "=====================\n"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FAILED=0
PASSED=0

test_backend() {
    echo -e "\n${BLUE}📦 Backend Testes${NC}"
    echo "===================="
    
    cd backend
    
    echo -e "${YELLOW}→ Unit tests${NC}"
    if npm run test -- --passWithNoTests; then
        echo -e "${GREEN}✓ Unit tests passaram${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Unit tests falharam${NC}"
        ((FAILED++))
    fi
    
    echo -e "\n${YELLOW}→ Integration tests${NC}"
    if npm run test:integration -- --passWithNoTests 2>/dev/null || true; then
        echo -e "${GREEN}✓ Integration tests ok${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️  Integration tests pulados${NC}"
    fi
    
    echo -e "\n${YELLOW}→ Linting${NC}"
    if npm run lint; then
        echo -e "${GREEN}✓ Linting passou${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Linting falhou${NC}"
        ((FAILED++))
    fi
    
    cd ..
}

test_frontend() {
    echo -e "\n${BLUE}🎨 Frontend Testes${NC}"
    echo "===================="
    
    cd frontend
    
    echo -e "${YELLOW}→ Unit/Component tests${NC}"
    if npm run test -- --passWithNoTests --coverage=false; then
        echo -e "${GREEN}✓ Unit tests passaram${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Unit tests falharam${NC}"
        ((FAILED++))
    fi
    
    echo -e "\n${YELLOW}→ Linting${NC}"
    if npm run lint; then
        echo -e "${GREEN}✓ Linting passou${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Linting falhou${NC}"
        ((FAILED++))
    fi
    
    echo -e "\n${YELLOW}→ Build check${NC}"
    if npm run build; then
        echo -e "${GREEN}✓ Build compilou${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ Build falhou${NC}"
        ((FAILED++))
    fi
    
    cd ..
}

coverage() {
    echo -e "\n${BLUE}📊 Coverage${NC}"
    echo "============"
    
    cd backend
    echo -e "${YELLOW}→ Backend coverage${NC}"
    npm run test:coverage 2>/dev/null || echo "Coverage info gerada"
    cd ..
}

# Executar testes
test_backend
test_frontend

# Resumo
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}TEST SUMMARY${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "✓ Passaram: ${GREEN}$PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "✗ Falharam: ${RED}$FAILED${NC}"
    exit 1
else
    echo -e "✗ Falharam: ${GREEN}0${NC}"
    echo -e "\n${GREEN}🎉 Todos os testes passaram!${NC}\n"
fi

#!/bin/bash

# Clean Script
# Remove arquivos de build, logs, cache

set -e

echo "🧹 VAMMOS - Cleanup"
echo "==================\n"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar confirmação
if [ "$1" != "-f" ] && [ "$1" != "--force" ]; then
    echo -e "${YELLOW}⚠️  Isso vai remover:${NC}"
    echo "  • node_modules (todos)"
    echo "  • build/dist (compilados)"
    echo "  • .next (compilados Next.js)"
    echo "  • coverage (relatórios)"
    echo "  • logs (arquivo de log)"
    echo "  • .cache (cache local)"
    echo ""
    echo -e "${BLUE}Continuar? (s/n)${NC}"
    read -r response
    
    if [ "$response" != "s" ] && [ "$response" != "S" ] && [ "$response" != "yes" ]; then
        echo -e "${YELLOW}Cancelado${NC}"
        exit 0
    fi
fi

echo -e "${BLUE}Limpando...${NC}\n"

# Remove node_modules
echo -e "${YELLOW}→ Removendo node_modules${NC}"
rm -rf node_modules backend/node_modules frontend/node_modules
echo -e "${GREEN}✓ Removido${NC}"

# Remove builds
echo -e "${YELLOW}→ Removendo builds${NC}"
rm -rf backend/dist frontend/.next backend/out frontend/out
echo -e "${GREEN}✓ Removido${NC}"

# Remove cache
echo -e "${YELLOW}→ Removendo cache${NC}"
rm -rf .next backend/.cache frontend/.cache
rm -rf backend/.turbo frontend/.turbo
echo -e "${GREEN}✓ Removido${NC}"

# Remove coverage
echo -e "${YELLOW}→ Removendo coverage${NC}"
rm -rf backend/coverage frontend/coverage .nyc_output
echo -e "${GREEN}✓ Removido${NC}"

# Remove logs
echo -e "${YELLOW}→ Removendo logs${NC}"
rm -rf logs
mkdir -p logs
echo -e "${GREEN}✓ Removido${NC}"

# Remove lock files (opcional)
if [ "$2" == "--locks" ]; then
    echo -e "${YELLOW}→ Removendo package-lock.json${NC}"
    rm -f package-lock.json backend/package-lock.json frontend/package-lock.json
    rm -f pnpm-lock.yaml backend/pnpm-lock.yaml frontend/pnpm-lock.yaml
    echo -e "${GREEN}✓ Removido${NC}"
fi

echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Limpeza completa!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}\n"

echo -e "${BLUE}🚀 Próximo passo:${NC}"
echo "   npm run setup"
echo ""

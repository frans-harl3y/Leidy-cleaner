#!/bin/bash

# Development Script
# Inicia ambiente de desenvolvimento sem Docker (útil para debug)

set -e

echo "🚀 VAMMOS - Modo Desenvolvimento (Local)"
echo "========================================\n"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar se Node está instalado
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não instalado${NC}"
    exit 1
fi

echo -e "${BLUE}Environment: Development (Local)${NC}"
echo -e "Node: $(node --version)"
echo -e "npm: $(npm --version)\n"

# Terminal 1: Backend
echo -e "${YELLOW}Iniciando Backend...${NC}"
cd backend
echo -e "${GREEN}✓ Backend pronto em http://localhost:3001${NC}"
npm run dev &
BACKEND_PID=$!

# Terminal 2: Frontend
cd ../frontend
echo -e "${GREEN}✓ Frontend pronto em http://localhost:3000${NC}"
npm run dev &
FRONTEND_PID=$!

echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Ambientes iniciados!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}\n"

echo -e "${BLUE}URLs Disponíveis:${NC}"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3001"
echo "  API Docs:  http://localhost:3001/api-docs"
echo ""
echo -e "${YELLOW}PIDs dos processos:${NC}"
echo "  Backend:  $BACKEND_PID"
echo "  Frontend: $FRONTEND_PID"
echo ""
echo -e "${BLUE}Pressione Ctrl+C para parar...${NC}\n"

# Aguardar
wait

# Cleanup
kill $BACKEND_PID 2>/dev/null || true
kill $FRONTEND_PID 2>/dev/null || true

echo -e "${BLUE}Desenvolvimento encerrado${NC}"

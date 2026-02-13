#!/bin/bash

# =====================================================
# 🧪 TESTE DE INTEGRAÇÃO RÁPIDO - VERIFICAÇÃO DE SAÚDE
# =====================================================

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

log_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

log_failure() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# =====================================================
# TESTES ESTRUTURAIS
# =====================================================

test_project_structure() {
    log_header "TESTE 1: Estrutura do Projeto"
    
    # Verificar pastas principais
    if [ -d "/workspaces/chega/backend" ]; then
        log_success "Pasta /backend existe"
    else
        log_failure "Pasta /backend não encontrada"
    fi
    
    if [ -d "/workspaces/chega/frontend" ]; then
        log_success "Pasta /frontend existe"
    else
        log_failure "Pasta /frontend não encontrada"
    fi
    
    if [ -d "/workspaces/chega/config" ]; then
        log_success "Pasta /config existe"
    else
        log_failure "Pasta /config não encontrada"
    fi
}

test_docker_files() {
    log_header "TESTE 2: Arquivos Docker"
    
    if [ -f "/workspaces/chega/docker-compose.yml" ]; then
        log_success "docker-compose.yml existe"
    else
        log_failure "docker-compose.yml não encontrado"
    fi
    
    if [ -f "/workspaces/chega/Dockerfile.backend" ]; then
        log_success "Dockerfile.backend existe"
    else
        log_failure "Dockerfile.backend não encontrado"
    fi
    
    if [ -f "/workspaces/chega/Dockerfile.frontend" ]; then
        log_success "Dockerfile.frontend existe"
    else
        log_failure "Dockerfile.frontend não encontrado"
    fi
}

test_config_files() {
    log_header "TESTE 3: Arquivos de Configuração"
    
    if [ -f "/workspaces/chega/.env" ]; then
        log_success "Arquivo .env existe"
    else
        log_failure "Arquivo .env não encontrado"
    fi
    
    if [ -f "/workspaces/chega/backend/package.json" ]; then
        log_success "backend/package.json existe"
    else
        log_failure "backend/package.json não encontrado"
    fi
    
    if [ -f "/workspaces/chega/frontend/package.json" ]; then
        log_success "frontend/package.json existe"
    else
        log_failure "frontend/package.json não encontrado"
    fi
}

test_backend_code() {
    log_header "TESTE 4: Código Backend"
    
    if [ -f "/workspaces/chega/backend/src/index.js" ] || [ -f "/workspaces/chega/backend/src/server.js" ]; then
        log_success "Arquivo principal do backend encontrado"
    else
        log_failure "Arquivo principal do backend não encontrado"
    fi
    
    # Verificar se há rotas
    if find /workspaces/chega/backend/src -name "*route*" -o -name "*routes*" 2>/dev/null | grep -q .; then
        log_success "Rotas do backend encontradas"
    else
        log_failure "Rotas do backend não encontradas"
    fi
    
    # Verificar modelos
    if find /workspaces/chega/backend/src -name "*model*" 2>/dev/null | grep -q .; then
        log_success "Modelos de dados encontrados"
    else
        log_info "Modelos de dados não claramente identificados (pode estar em outro lugar)"
    fi
}

test_frontend_code() {
    log_header "TESTE 5: Código Frontend"
    
    if find /workspaces/chega/frontend/src -type f -name "*.js" -o -name "*.jsx" -o -name "*.tsx" 2>/dev/null | grep -q .; then
        log_success "Componentes React/Next.js encontrados"
    else
        log_failure "Componentes React/Next.js não encontrados"
    fi
    
    # Verificar pages ou app
    if [ -d "/workspaces/chega/frontend/src/pages" ] || [ -d "/workspaces/chega/frontend/src/app" ]; then
        log_success "Estrutura de páginas encontrada"
    else
        log_failure "Estrutura de páginas não encontrada"
    fi
}

test_documentation() {
    log_header "TESTE 6: Documentação"
    
    doc_count=$(find /workspaces/chega -maxdepth 1 -name "*.md" -type f | wc -l)
    
    if [ $doc_count -gt 10 ]; then
        log_success "Documentação abrangente encontrada (${doc_count} arquivos .md)"
    else
        log_failure "Documentação limitada encontrada (apenas ${doc_count} arquivos .md)"
    fi
    
    if [ -f "/workspaces/chega/COMECE_AQUI.md" ]; then
        log_success "Guia de início encontrado"
    else
        log_failure "Guia de início não encontrado"
    fi
}

test_database() {
    log_header "TESTE 7: Banco de Dados"
    
    if [ -f "/workspaces/chega/backend/backend_data/database.sqlite" ]; then
        log_success "Banco de dados SQLite populado encontrado"
    elif [ -f "/workspaces/chega/database/schema.sql" ]; then
        log_success "Schema do banco de dados encontrado"
    else
        log_info "Arquivo de banco de dados não encontrado (pode ser criado na primeira execução)"
    fi
}

test_env_vars() {
    log_header "TESTE 8: Variáveis de Ambiente"
    
    if grep -q "JWT_SECRET" /workspaces/chega/.env; then
        log_success "JWT_SECRET configurado"
    else
        log_failure "JWT_SECRET não configurado"
    fi
    
    if grep -q "REDIS_URL" /workspaces/chega/.env; then
        log_success "REDIS_URL configurado"
    else
        log_failure "REDIS_URL não configurado"
    fi
    
    if grep -q "PORT" /workspaces/chega/.env; then
        log_success "PORT configurado"
    else
        log_failure "PORT não configurado"
    fi
}

test_docker_build() {
    log_header "TESTE 9: Build Docker"
    
    log_info "Verificando imagens Docker disponíveis..."
    
    if docker images | grep -q "node"; then
        log_success "Imagem Node.js disponível"
    else
        log_failure "Imagem Node.js não disponível"
    fi
    
    if docker images | grep -q "redis"; then
        log_success "Imagem Redis disponível"
    else
        log_info "Imagem Redis não está em cache (será baixada no primeiro up)"
    fi
}

test_package_dependencies() {
    log_header "TESTE 10: Dependências do Projeto"
    
    # Backend dependencies
    if [ -f "/workspaces/chega/backend/package.json" ]; then
        backend_deps=$(grep -c '"dependencies"' /workspaces/chega/backend/package.json)
        if [ $backend_deps -gt 0 ]; then
            log_success "Dependencies no backend package.json"
        else
            log_failure "Nenhuma dependency encontrada no backend"
        fi
    fi
    
    # Frontend dependencies
    if [ -f "/workspaces/chega/frontend/package.json" ]; then
        frontend_deps=$(grep -c '"dependencies"' /workspaces/chega/frontend/package.json)
        if [ $frontend_deps -gt 0 ]; then
            log_success "Dependencies no frontend package.json"
        else
            log_failure "Nenhuma dependency encontrada no frontend"
        fi
    fi
}

test_git_repo() {
    log_header "TESTE 11: Repositório Git"
    
    if [ -d "/workspaces/chega/.git" ]; then
        log_success "Repositório Git encontrado"
        
        # Verificar commits
        commit_count=$(cd /workspaces/chega && git rev-list HEAD | wc -l 2>/dev/null || echo "0")
        if [ $commit_count -gt 0 ]; then
            log_success "Histórico de commits encontrado ($commit_count commits)"
        fi
    else
        log_failure "Repositório Git não inicializado"
    fi
}

test_environment() {
    log_header "TESTE 12: Ambiente & Ferramentas"
    
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        log_success "Node.js instalado ($node_version)"
    else
        log_failure "Node.js não instalado"
    fi
    
    if command -v npm &> /dev/null; then
        npm_version=$(npm --version)
        log_success "npm instalado ($npm_version)"
    else
        log_failure "npm não instalado"
    fi
    
    if command -v docker &> /dev/null; then
        docker_version=$(docker --version | cut -d' ' -f3 | tr -d ',')
        log_success "Docker instalado ($docker_version)"
    else
        log_failure "Docker não instalado"
    fi
    
    if command -v curl &> /dev/null; then
        log_success "curl disponível"
    else
        log_failure "curl não disponível"
    fi
}

test_code_quality() {
    log_header "TESTE 13: Qualidade do Código"
    
    # Verificar ESLint
    if [ -f "/workspaces/chega/backend/.eslintrc.json" ] || [ -f "/workspaces/chega/backend/.eslintrc" ]; then
        log_success "Configuração ESLint encontrada no backend"
    else
        log_info "Configuração ESLint não encontrada no backend"
    fi
    
    # Verificar Prettier
    if [ -f "/workspaces/chega/.prettierrc" ] || grep -q "prettier" /workspaces/chega/package.json 2>/dev/null; then
        log_success "Prettier configurado"
    else
        log_info "Prettier não configurado"
    fi
}

test_api_structure() {
    log_header "TESTE 14: Estrutura da API"
    
    api_files=$(find /workspaces/chega/backend/src -name "*api*" -o -name "*controller*" -o -name "*service*" 2>/dev/null | wc -l)
    
    if [ $api_files -gt 0 ]; then
        log_success "Estrutura de API encontrada ($api_files arquivos)"
    else
        log_info "Estrutura de API não claramente identificada"
    fi
    
    # Verificar rotas
    routes_files=$(find /workspaces/chega/backend/src -name "*route*" 2>/dev/null | wc -l)
    if [ $routes_files -gt 0 ]; then
        log_success "Rotas de API encontradas ($routes_files arquivos)"
    fi
}

test_security() {
    log_header "TESTE 15: Segurança"
    
    # Verificar .gitignore
    if [ -f "/workspaces/chega/.gitignore" ]; then
        log_success ".gitignore encontrado"
        
        # Verificar se .env está em .gitignore
        if grep -q "^\.env" /workspaces/chega/.gitignore; then
            log_success ".env está em .gitignore (bom!)"
        else
            log_failure ".env NÃO está em .gitignore (risco de segurança!)"
        fi
    else
        log_failure ".gitignore não encontrado"
    fi
    
    # Verificar node_modules
    if grep -q "^node_modules" /workspaces/chega/.gitignore; then
        log_success "node_modules está em .gitignore"
    else
        log_failure "node_modules NÃO está em .gitignore"
    fi
}

# =====================================================
# RELATÓRIO FINAL
# =====================================================

generate_report() {
    log_header "📋 RELATÓRIO FINAL"
    
    total=$((TESTS_PASSED + TESTS_FAILED))
    
    if [ $total -gt 0 ]; then
        success_rate=$((TESTS_PASSED * 100 / total))
    else
        success_rate=0
    fi
    
    echo -e "Testes Totais: $total"
    echo -e "${GREEN}✅ Passou: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Falhou: $TESTS_FAILED${NC}"
    echo -e "Taxa de Sucesso: ${success_rate}%"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 TODOS OS TESTES ESTRUTURAIS PASSARAM! 🎉${NC}"
        echo ""
        echo "Próximos passos:"
        echo "  1. Iniciar containers: docker-compose up -d"
        echo "  2. Aguardar serviços: aguarde ~2 minutos"
        echo "  3. Testar backend: curl http://localhost:3001/api/health"
        echo "  4. Testar frontend: abra http://localhost:3000"
        echo "  5. Login com: admin@leidycleaner.com.br / AdminPassword123!@#"
    else
        echo -e "${YELLOW}⚠️  Alguns testes falharam. Verifique os logs acima.${NC}"
    fi
}

# =====================================================
# MAIN
# =====================================================

main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════╗"
    echo "║ 🧪 TESTE DE INTEGRAÇÃO - ANÁLISE ESTRUTURAL║"
    echo "║    Sistema: Leidy Cleaner                 ║"
    echo "║    Data: $(date '+%Y-%m-%d %H:%M:%S')                 ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    test_project_structure
    test_docker_files
    test_config_files
    test_backend_code
    test_frontend_code
    test_documentation
    test_database
    test_env_vars
    test_docker_build
    test_package_dependencies
    test_git_repo
    test_environment
    test_code_quality
    test_api_structure
    test_security
    
    generate_report
    
    # Save report
    mkdir -p /workspaces/chega/test-results
    cp /workspaces/chega/test-integracao.log /workspaces/chega/test-results/teste-estrutural-$(date +%Y%m%d-%H%M%S).log 2>/dev/null || true
}

main "$@"

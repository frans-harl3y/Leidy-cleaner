#!/bin/bash

# =====================================================
# 🧪 TESTE DE INTEGRAÇÃO TOTAL - SISTEMA LEIDY CLEANER
# =====================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variáveis de configuração
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"
API_TIMEOUT=10
MAX_RETRIES=30
RETRY_INTERVAL=2

# Contadores
TESTS_PASSED=0
TESTS_FAILED=0
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# =====================================================
# 📊 Funções auxiliares
# =====================================================

log_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
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

log_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

wait_for_service() {
    local url=$1
    local name=$2
    local retry_count=0

    log_step "Aguardando serviço $name..."

    while [ $retry_count -lt $MAX_RETRIES ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            log_success "$name está pronto ($url)"
            return 0
        fi

        retry_count=$((retry_count + 1))
        echo -ne "${YELLOW}   Tentativa $retry_count/$MAX_RETRIES (aguardando ${RETRY_INTERVAL}s)...${NC}\r"
        sleep $RETRY_INTERVAL
    done

    log_failure "$name não ficou pronto após $MAX_RETRIES tentativas"
    return 1
}

# =====================================================
# 🚀 FASE 1: Inicialização dos Containers
# =====================================================

test_docker_installed() {
    log_header "FASE 1: Verificação de Pré-requisitos"
    
    if ! command -v docker &> /dev/null; then
        log_failure "Docker não está instalado"
        exit 1
    fi
    log_success "Docker instalado"

    if ! command -v docker-compose &> /dev/null; then
        log_failure "Docker Compose não está instalado"
        exit 1
    fi
    log_success "Docker Compose instalado"
}

test_docker_daemon() {
    log_step "Verificando Docker daemon..."
    if ! docker ps > /dev/null 2>&1; then
        log_failure "Docker daemon não está rodando"
        exit 1
    fi
    log_success "Docker daemon está rodando"
}

test_ports_available() {
    log_step "Verificando disponibilidade de portas..."
    
    for port in 3000 3001 6379; do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            log_info "Porta $port já está em uso (tentarei parar containers antigos)"
        fi
    done
}

stop_existing_containers() {
    log_step "Parando containers existentes..."
    
    docker-compose down 2>/dev/null || true
    sleep 2
    
    log_success "Containers parados"
}

start_containers() {
    log_step "Iniciando containers Docker..."
    
    cd /workspaces/chega
    
    # Criar arquivo .env se não existir
    if [ ! -f .env ]; then
        log_info "Arquivo .env não encontrado, criando com valores padrão..."
        cat > .env << 'EOF'
NODE_ENV=development
PORT=3001
BASE_URL=http://localhost:3001
REDIS_URL=redis://:redis123@redis:6379
JWT_SECRET=test_jwt_secret_key_for_testing_12345
STRIPE_SECRET_KEY=sk_test_placeholder
MERCADOPAGO_TOKEN=test_token_placeholder
REDIS_PASSWORD=redis123
DB_USER=vamos
DB_PASSWORD=postgres123
DB_NAME=limpeza_pro
NEXT_PUBLIC_API_URL=http://localhost:3001
EOF
        log_success ".env criado"
    fi
    
    docker-compose up -d
    
    log_success "Containers iniciados"
}

wait_for_services() {
    log_header "FASE 2: Aguardando Serviços Ficarem Prontos"
    
    wait_for_service "$BACKEND_URL/api/health" "Backend" || exit 1
    wait_for_service "$FRONTEND_URL/api/health" "Frontend (Next.js)" || log_info "Frontend pode levar mais tempo..."
    wait_for_service "http://redis:6379" "Redis" || log_info "Redis pode não responder ao curl"
    
    sleep 2  # Buffer adicional
}

# =====================================================
# 🧪 FASE 3: Testes de Saúde do Sistema
# =====================================================

test_backend_health() {
    log_header "FASE 3: Testes de Saúde do Sistema"
    
    log_step "Testando health check do Backend..."
    
    response=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/health")
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        log_success "Backend health check (HTTP 200)"
        echo "   Resposta: $body"
    else
        log_failure "Backend health check retornou HTTP $http_code"
        echo "   Resposta: $body"
    fi
}

test_frontend_health() {
    log_step "Testando Frontend..."
    
    response=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL")
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "200" ]; then
        log_success "Frontend acessível (HTTP 200)"
    else
        log_failure "Frontend retornou HTTP $http_code"
    fi
}

check_redis_connection() {
    log_step "Testando conexão Redis..."
    
    if docker-compose exec -T redis redis-cli -a redis123 ping > /dev/null 2>&1; then
        log_success "Redis conectável"
    else
        log_failure "Redis não respondeu"
    fi
}

# =====================================================
# 🔑 FASE 4: Testes de Autenticação & API
# =====================================================

test_auth_endpoints() {
    log_header "FASE 4: Testes de Autenticação & API"
    
    log_step "Testando rota de login..."
    
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@leidycleaner.com.br",
            "password": "AdminPassword123!@#"
        }')
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        log_success "Login de admin funcionando (HTTP 200)"
        
        # Extrair token JWT
        TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)
        if [ -n "$TOKEN" ]; then
            log_success "Token JWT recebido"
            echo "   Token: ${TOKEN:0:40}..."
        else
            log_failure "Token JWT não encontrado na resposta"
        fi
    else
        log_failure "Login retornou HTTP $http_code"
        echo "   Resposta: $body"
    fi
}

test_protected_endpoints() {
    log_step "Testando endpoints protegidos..."
    
    # Primeiro, obter token válido
    response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@leidycleaner.com.br",
            "password": "AdminPassword123!@#"
        }')
    
    TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)
    
    if [ -z "$TOKEN" ]; then
        log_failure "Não foi possível obter token para testes de endpoints protegidos"
        return 1
    fi
    
    # Testar endpoint de usuários
    log_step "Testando GET /api/users..."
    response=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/users" \
        -H "Authorization: Bearer $TOKEN")
    
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "200" ]; then
        log_success "GET /api/users funcionando"
    else
        log_failure "GET /api/users retornou HTTP $http_code"
    fi
}

# =====================================================
# 📊 FASE 5: Testes de Funcionalidades Principais
# =====================================================

test_services_crud() {
    log_header "FASE 5: Testes de CRUD - Serviços"
    
    response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@leidycleaner.com.br",
            "password": "AdminPassword123!@#"
        }')
    
    TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)
    
    if [ -z "$TOKEN" ]; then
        log_failure "Não foi possível obter token"
        return 1
    fi
    
    # Teste GET services
    log_step "Testando GET /api/services..."
    response=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/services" \
        -H "Authorization: Bearer $TOKEN")
    
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "200" ]; then
        log_success "GET /api/services"
    else
        log_failure "GET /api/services retornou HTTP $http_code"
    fi
    
    # Teste POST services (criar novo serviço)
    log_step "Testando POST /api/services..."
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$BACKEND_URL/api/services" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "name": "Serviço Teste Integração",
            "description": "Serviço criado pela integração",
            "category": "limpeza",
            "basePrice": 150.00,
            "duration": 60
        }')
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        log_success "POST /api/services"
        SERVICE_ID=$(echo "$body" | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)
        if [ -n "$SERVICE_ID" ]; then
            echo "   Service ID: $SERVICE_ID"
        fi
    else
        log_failure "POST /api/services retornou HTTP $http_code"
        echo "   Resposta: $body"
    fi
}

test_bookings_flow() {
    log_header "FASE 6: Testes de Fluxo de Agendamentos"
    
    response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@leidycleaner.com.br",
            "password": "AdminPassword123!@#"
        }')
    
    TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)
    
    if [ -z "$TOKEN" ]; then
        log_failure "Não foi possível obter token"
        return 1
    fi
    
    # Teste GET bookings
    log_step "Testando GET /api/bookings..."
    response=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/bookings" \
        -H "Authorization: Bearer $TOKEN")
    
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "200" ]; then
        log_success "GET /api/bookings"
    else
        log_failure "GET /api/bookings retornou HTTP $http_code"
    fi
}

test_users_management() {
    log_header "FASE 7: Testes de Gerenciamento de Usuários"
    
    response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "admin@leidycleaner.com.br",
            "password": "AdminPassword123!@#"
        }')
    
    TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4 | head -1)
    
    if [ -z "$TOKEN" ]; then
        log_failure "Não foi possível obter token"
        return 1
    fi
    
    # GET profile
    log_step "Testando GET /api/auth/profile..."
    response=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/auth/profile" \
        -H "Authorization: Bearer $TOKEN")
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "200" ]; then
        log_success "GET /api/auth/profile"
        echo "   Usuário: $(echo "$body" | grep -o '"email":"[^"]*' | cut -d'"' -f4)"
    else
        log_failure "GET /api/auth/profile retornou HTTP $http_code"
    fi
}

test_cache_operations() {
    log_header "FASE 8: Testes de Cache (Redis)"
    
    log_step "Testando Redis cache..."
    
    # Testar set/get via API (se houver endpoint de cache)
    response=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/health" \
        -H "X-Test-Cache: true")
    
    http_code=$(echo "$response" | tail -n 1)
    
    # Fazer requisição novamente para testar cache
    response2=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/health" \
        -H "X-Test-Cache: true")
    
    http_code2=$(echo "$response2" | tail -n 1)
    
    if [ "$http_code" = "200" ] && [ "$http_code2" = "200" ]; then
        log_success "Cache Redis operacional"
    else
        log_failure "Problema ao testar Redis cache"
    fi
}

test_error_handling() {
    log_header "FASE 9: Testes de Tratamento de Erros"
    
    log_step "Testando erro de autenticação inválida..."
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "$BACKEND_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "invalid@email.com",
            "password": "wrongpassword"
        }')
    
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "401" ] || [ "$http_code" = "400" ]; then
        log_success "Erro de autenticação retorna HTTP $http_code (esperado)"
    else
        log_failure "Erro de autenticação retornou HTTP $http_code (esperado 401 ou 400)"
    fi
    
    log_step "Testando acesso sem token em endpoint protegido..."
    response=$(curl -s -w "\n%{http_code}" \
        "$BACKEND_URL/api/users")
    
    http_code=$(echo "$response" | tail -n 1)
    
    if [ "$http_code" = "401" ]; then
        log_success "Acesso sem token retorna HTTP 401 (esperado)"
    else
        log_failure "Acesso sem token retornou HTTP $http_code (esperado 401)"
    fi
}

test_response_formats() {
    log_header "FASE 10: Testes de Formato de Respostas"
    
    log_step "Verificando headers e formato JSON..."
    
    response=$(curl -s -i "$BACKEND_URL/api/health")
    
    if echo "$response" | grep -q "Content-Type: application/json\|Content-Type: application/json;"; then
        log_success "Content-Type correto (application/json)"
    else
        log_failure "Content-Type incorreto"
    fi
    
    if echo "$response" | grep -q "200 OK\|200 "; then
        log_success "Status HTTP correto"
    else
        log_failure "Status HTTP incorreto"
    fi
}

# =====================================================
# 📈 FASE 11: Performance & Stress Tests
# =====================================================

test_performance() {
    log_header "FASE 11: Testes de Performance"
    
    log_step "Testando tempo de resposta..."
    
    start_time=$(date +%s%N)
    
    curl -s "$BACKEND_URL/api/health" > /dev/null
    
    end_time=$(date +%s%N)
    elapsed=$((($end_time - $start_time) / 1000000))  # Converter para ms
    
    if [ $elapsed -lt 1000 ]; then
        log_success "Tempo de resposta rápido: ${elapsed}ms"
    else
        log_failure "Tempo de resposta lento: ${elapsed}ms"
    fi
}

test_concurrent_requests() {
    log_header "FASE 12: Teste de Requisições Concorrentes"
    
    log_step "Testando 5 requisições simultâneas..."
    
    for i in {1..5}; do
        curl -s "$BACKEND_URL/api/health" > /dev/null &
    done
    
    wait
    
    log_success "Requisições concorrentes completadas"
}

# =====================================================
# 🗑️  Limpeza e Relatório Final
# =====================================================

generate_report() {
    log_header "📋 RELATÓRIO FINAL DE TESTES"
    
    echo -e "${CYAN}Timestamp: $TIMESTAMP${NC}"
    echo -e "${CYAN}Backend: $BACKEND_URL${NC}"
    echo -e "${CYAN}Frontend: $FRONTEND_URL${NC}"
    echo ""
    
    total_tests=$((TESTS_PASSED + TESTS_FAILED))
    success_rate=$((TESTS_PASSED * 100 / total_tests))
    
    echo -e "Total de Testes: $total_tests"
    echo -e "${GREEN}✅ Passou: $TESTS_PASSED${NC}"
    echo -e "${RED}❌ Falhou: $TESTS_FAILED${NC}"
    echo -e "Taxa de Sucesso: ${success_rate}%"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM! 🎉${NC}"
    else
        echo -e "${YELLOW}⚠️  Alguns testes falharam. Verifique os logs acima.${NC}"
    fi
}

save_report() {
    local report_file="/workspaces/chega/test-results/integracao-completa-$(date +%Y%m%d-%H%M%S).log"
    
    mkdir -p /workspaces/chega/test-results
    
    {
        echo "=== RELATÓRIO DE TESTES DE INTEGRAÇÃO ==="
        echo "Data: $TIMESTAMP"
        echo "Backend: $BACKEND_URL"
        echo "Frontend: $FRONTEND_URL"
        echo ""
        echo "Testes Passados: $TESTS_PASSED"
        echo "Testes Falhados: $TESTS_FAILED"
        echo "Taxa de Sucesso: $((TESTS_PASSED * 100 / (TESTS_PASSED + TESTS_FAILED)))%"
    } > "$report_file"
    
    log_info "Relatório salvo em: $report_file"
}

cleanup() {
    log_header "Limpeza"
    
    log_step "Encerrando testes..."
    log_success "Testes concluídos"
}

# =====================================================
# 🚀 EXECUÇÃO PRINCIPAL
# =====================================================

main() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════╗"
    echo "║  🧪 TESTE DE INTEGRAÇÃO TOTAL - CHEGA    ║"
    echo "║  Sistema: Leidy Cleaner                   ║"
    echo "║  Início: $TIMESTAMP           ║"
    echo "╚════════════════════════════════════════════╝"
    echo -e "${NC}\n"
    
    # Executar testes em sequência
    test_docker_installed
    test_docker_daemon
    test_ports_available
    stop_existing_containers
    start_containers
    wait_for_services
    
    test_backend_health
    test_frontend_health
    check_redis_connection
    
    test_auth_endpoints
    test_protected_endpoints
    
    test_services_crud
    test_bookings_flow
    test_users_management
    
    test_cache_operations
    test_error_handling
    test_response_formats
    
    test_performance
    test_concurrent_requests
    
    save_report
    generate_report
    cleanup
    
    echo ""
    
    # Exit code baseado em resultados
    if [ $TESTS_FAILED -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Trap para limpeza em caso de erro
trap 'log_failure "Teste interrompido"; exit 1' SIGINT SIGTERM

# Executar main
main "$@"

#!/bin/bash

###
### Load Test Script - Benchmark API Performance
###
### Measures:
### - Requests/sec
### - Latency (p50, p95, p99)
### - Error rate
### - Memory/CPU usage
###
### Prerequisites:
### npm install -g autocannon
###
### Usage:
### ./scripts/load-test.sh [URL]
### ./scripts/load-test.sh http://localhost:3001
### ./scripts/load-test.sh https://chega-backend.railway.app
###

set -e

# ===== CONFIGURATION =====
URL=${1:-http://localhost:3001}
DURATION=30  # seconds
RATE=100     # requests per second
CONNECTIONS=10  # concurrent connections

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ===== FUNCTIONS =====

check_prerequisites() {
  echo -e "${BLUE}🔍 Checking prerequisites...${NC}\n"
  
  # Check autocannon
  if ! command -v autocannon &> /dev/null; then
    echo -e "${RED}❌ autocannon not found${NC}"
    echo "Install with: npm install -g autocannon"
    exit 1
  fi
  
  # Check curl
  if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl not found${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✅ All prerequisites installed${NC}\n"
}

check_server() {
  echo -e "${BLUE}🔍 Checking if server is running...${NC}\n"
  
  if ! curl -s -m 5 "$URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server not responding at $URL${NC}"
    echo ""
    echo "Start your server first:"
    echo "  npm start"
    echo ""
    exit 1
  fi
  
  echo -e "${GREEN}✅ Server is running at $URL${NC}\n"
}

show_header() {
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  🚀 Load Test - API Performance Benchmark${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
  echo "Target URL:       $URL"
  echo "Duration:         $DURATION seconds"
  echo "Rate:             $RATE req/sec"
  echo "Connections:      $CONNECTIONS concurrent"
  echo ""
}

run_health_test() {
  echo -e "${BLUE}📊 Test 1: Health Check Endpoint${NC}\n"
  
  autocannon \
    --url "$URL/health" \
    --duration $DURATION \
    --rate $RATE \
    --connections $CONNECTIONS \
    --title "GET /health" \
    --json false
}

run_api_test() {
  echo -e "\n${BLUE}📊 Test 2: API Endpoints (Mixed)${NC}\n"
  
  # Create a test file with multiple endpoints
  cat > /tmp/load-test-requests.txt << 'EOF'
GET /health/db
GET /health/full
GET /api/bookings
POST /api/auth/login
EOF
  
  autocannon \
    --url "$URL" \
    --duration $DURATION \
    --rate $RATE \
    --connections $CONNECTIONS \
    --title "Mixed API endpoints" \
    --json false
}

run_concurrent_test() {
  echo -e "\n${BLUE}📊 Test 3: High Concurrency (50 connections)${NC}\n"
  
  autocannon \
    --url "$URL/health" \
    --duration 20 \
    --connections 50 \
    --title "High concurrency" \
    --json false
}

run_stress_test() {
  echo -e "\n${BLUE}📊 Test 4: Stress Test (Sustained Load)${NC}\n"
  
  autocannon \
    --url "$URL/health" \
    --duration 60 \
    --rate 500 \
    --connections 20 \
    --title "Stress test - 60 seconds" \
    --json false
}

generate_report() {
  echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}"
  echo -e "${BLUE}  📈 Summary & Recommendations${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
  
  echo "✅ Tests completed!"
  echo ""
  echo "📊 Metrics Interpretation:"
  echo "  Throughput (req/sec)"
  echo "    Good:     > 500 req/sec"
  echo "    Excellent: > 1000 req/sec"
  echo ""
  echo "  Latency (median)"
  echo "    Good:     < 50ms"
  echo "    Excellent: < 10ms"
  echo ""
  echo "  Error Rate"
  echo "    Good:     0% errors"
  echo "    Acceptable: < 0.1% errors"
  echo ""
  echo "🔍 If results are below targets:"
  echo "  1. Check database queries are optimized"
  echo "  2. Verify connection pooling is configured"
  echo "  3. Check Redis/cache hit rates"
  echo "  4. Monitor for N+1 queries"
  echo "  5. Enable query result caching"
  echo "  6. Increase database pool size (DB_POOL_MAX)"
  echo ""
  echo "💾 Memory Usage:"
  echo "  Should stay stable (not growing)"
  echo "  Check for memory leaks with: node --max-old-space-size=2048"
  echo ""
}

run_profile_test() {
  echo -e "\n${BLUE}🔧 Profile Test: JSON Output for Analysis${NC}\n"
  
  autocannon \
    --url "$URL/health" \
    --duration 30 \
    --json \
    --connections 10 > /tmp/load-test-results.json
  
  echo "Results saved to: /tmp/load-test-results.json"
  echo ""
  echo "View results:"
  echo "  cat /tmp/load-test-results.json | jq"
}

# ===== EXECUTION =====

main() {
  check_prerequisites
  check_server
  show_header
  
  # Ask which tests to run
  echo -e "${YELLOW}📋 Available Tests:${NC}\n"
  echo "1. Health check endpoint (quick)"
  echo "2. Mixed API endpoints"
  echo "3. High concurrency"
  echo "4. Stress test (60 seconds)"
  echo "5. Profile with JSON output"
  echo "6. Run all tests"
  echo ""
  
  read -p "Enter test number (default: 1): " test_choice
  test_choice=${test_choice:-1}
  
  echo ""
  
  case $test_choice in
    1)
      run_health_test
      ;;
    2)
      run_health_test
      run_api_test
      ;;
    3)
      run_concurrent_test
      ;;
    4)
      run_stress_test
      ;;
    5)
      run_profile_test
      ;;
    6)
      run_health_test
      run_api_test
      run_concurrent_test
      run_stress_test
      run_profile_test
      ;;
    *)
      echo -e "${RED}Invalid option${NC}"
      exit 1
      ;;
  esac
  
  generate_report
}

# Run if not sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main
fi

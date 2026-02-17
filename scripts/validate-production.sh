#!/bin/bash

# Production Setup Script for Chega
# Validates all critical environment variables
# Usage: bash scripts/validate-production.sh

set -e

echo "🔍 Validating Production Configuration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counter
ERRORS=0
WARNINGS=0

# Functions
check_required() {
  local var=$1
  local desc=$2
  
  if [ -z "${!var}" ]; then
    echo -e "${RED}❌ CRITICAL: $var (${desc}) is missing${NC}"
    ERRORS=$((ERRORS+1))
    return 1
  else
    # Show first 10 chars for verification
    local value="${!var:0:10}"
    echo -e "${GREEN}✅ $var is set${NC}"
    return 0
  fi
}

check_optional() {
  local var=$1
  local desc=$2
  
  if [ -z "${!var}" ]; then
    echo -e "${YELLOW}⚠️  OPTIONAL: $var (${desc}) is not set${NC}"
    WARNINGS=$((WARNINGS+1))
    return 1
  else
    echo -e "${GREEN}✅ $var is set${NC}"
    return 0
  fi
}

# ===== CRITICAL CHECKS =====
echo -e "${BLUE}=== CRITICAL ENVIRONMENT VARIABLES ===${NC}"

check_required "NODE_ENV" "Node environment"
check_required "PORT" "Server port"
check_required "DATABASE_URL" "Database connection string"
check_required "JWT_SECRET" "JWT signing key"
check_required "CORS_ORIGIN" "CORS allowed origins"
check_required "STRIPE_SECRET_KEY" "Stripe secret key (LIVE)"

echo ""
echo -e "${BLUE}=== HIGH PRIORITY VARIABLES ===${NC}"

check_optional "SENTRY_DSN" "Sentry error tracking"
check_optional "REDIS_URL" "Redis cache connection"
check_optional "EMAIL_USER" "Email sender address"
check_optional "TWILIO_ACCOUNT_SID" "Twilio account SID"

echo ""
echo -e "${BLUE}=== INFRASTRUCTURE CHECKS ===${NC}"

# Check database connectivity
if [ ! -z "$DATABASE_URL" ]; then
  if [[ "$DATABASE_URL" == postgresql* ]]; then
    echo -n "Testing PostgreSQL connection... "
    if timeout 5 psql "$DATABASE_URL" -c "SELECT 1" >/dev/null 2>&1; then
      echo -e "${GREEN}✅ Database is accessible${NC}"
    else
      echo -e "${RED}❌ Cannot connect to database${NC}"
      ERRORS=$((ERRORS+1))
    fi
  elif [[ "$DATABASE_URL" == sqlite* ]]; then
    echo -e "${YELLOW}⚠️  Using SQLite - OK for dev, NOT recommended for production${NC}"
    WARNINGS=$((WARNINGS+1))
  fi
fi

# Check Redis connectivity
if [ ! -z "$REDIS_URL" ]; then
  echo -n "Testing Redis connection... "
  if timeout 5 redis-cli -u "$REDIS_URL" PING >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is accessible${NC}"
  else
    echo -e "${YELLOW}⚠️  Redis not accessible (optional, cache disabled)${NC}"
    WARNINGS=$((WARNINGS+1))
  fi
fi

echo ""
echo -e "${BLUE}=== SECURITY CHECKS ===${NC}"

# JWT Secret length
if [ ! -z "$JWT_SECRET" ]; then
  jwt_len=${#JWT_SECRET}
  if [ $jwt_len -lt 32 ]; then
    echo -e "${RED}❌ JWT_SECRET too short (${jwt_len} chars, min 32)${NC}"
    ERRORS=$((ERRORS+1))
  else
    echo -e "${GREEN}✅ JWT_SECRET length OK (${jwt_len} chars)${NC}"
  fi
fi

# HTTPS check
if [ ! -z "$APP_URL" ]; then
  if [[ "$APP_URL" == https* ]]; then
    echo -e "${GREEN}✅ Using HTTPS${NC}"
  else
    echo -e "${YELLOW}⚠️  Not using HTTPS (only OK for development)${NC}"
    WARNINGS=$((WARNINGS+1))
  fi
fi

# CORS check
if [ ! -z "$CORS_ORIGIN" ]; then
  if [[ "$CORS_ORIGIN" == *"localhost"* ]]; then
    echo -e "${YELLOW}⚠️  CORS includes localhost (OK for staging only)${NC}"
    WARNINGS=$((WARNINGS+1))
  else
    echo -e "${GREEN}✅ CORS configured for production domain${NC}"
  fi
fi

echo ""
echo -e "${BLUE}=== FEATURE FLAGS ===${NC}"

if [ "$NODE_ENV" == "production" ]; then
  check_optional "SENTRY_ENVIRONMENT" "Sentry environment tag"
  check_optional "LOG_LEVEL" "Logging level"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -gt 0 ]; then
  echo -e "${RED}❌ VALIDATION FAILED${NC}"
  echo -e "Found ${RED}${ERRORS} critical errors${NC}"
  [ $WARNINGS -gt 0 ] && echo -e "and ${YELLOW}${WARNINGS} warnings${NC}"
  exit 1
elif [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  VALIDATION PASSED WITH WARNINGS${NC}"
  echo -e "Found ${YELLOW}${WARNINGS} warnings${NC} to review before production"
  exit 0
else
  echo -e "${GREEN}✅ VALIDATION PASSED${NC}"
  echo -e "All critical settings are configured correctly!"
  exit 0
fi

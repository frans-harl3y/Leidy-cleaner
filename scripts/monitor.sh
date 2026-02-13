#!/bin/bash

# Monitoring & Alerts Script
# Verifica saúde da aplicação e envia alertas

set -e

API_URL="${API_URL:-http://localhost:3001}"
ALERT_EMAIL="${ALERT_EMAIL:-admin@seu-dominio.com}"
ERROR_THRESHOLD="${ERROR_THRESHOLD:-5}"
RESPONSE_TIME_THRESHOLD="${RESPONSE_TIME_THRESHOLD:-1000}"

echo "🔍 Starting Health Check Monitoring..."
echo "API_URL: $API_URL"
echo "Error Threshold: ${ERROR_THRESHOLD}%"
echo "Response Time Threshold: ${RESPONSE_TIME_THRESHOLD}ms"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check endpoint
check_endpoint() {
  local endpoint=$1
  local name=$2
  
  echo -n "🔗 Checking $name... "
  
  local start_time=$(date +%s%N | cut -b1-13)
  local response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/$endpoint" 2>/dev/null || echo "000")
  local end_time=$(date +%s%N | cut -b1-13)
  local response_time=$((end_time - start_time))
  
  if [ "$response" == "200" ]; then
    echo -e "${GREEN}✅ OK (${response_time}ms)${NC}"
    
    # Check response time
    if [ "$response_time" -gt "$RESPONSE_TIME_THRESHOLD" ]; then
      echo -e "${YELLOW}⚠️  Slow response: ${response_time}ms > ${RESPONSE_TIME_THRESHOLD}ms${NC}"
      return 1
    fi
    return 0
  else
    echo -e "${RED}❌ FAILED (HTTP $response)${NC}"
    return 1
  fi
}

# Function to send alert
send_alert() {
  local subject=$1
  local message=$2
  
  if command -v mail &> /dev/null; then
    echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
    echo "📧 Alert sent to $ALERT_EMAIL"
  else
    echo -e "${YELLOW}⚠️  Mail command not available. Alert not sent.${NC}"
    echo "Subject: $subject"
    echo "Body: $message"
  fi
}

# Function to get metrics
get_metrics() {
  echo ""
  echo "📊 System Metrics:"
  echo ""
  
  # CPU Usage
  local cpu_usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print int(100-$1)}')
  echo "CPU Usage: ${cpu_usage}%"
  
  # Memory Usage
  local mem_usage=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
  echo "Memory Usage: ${mem_usage}%"
  
  # Disk Usage
  local disk_usage=$(df /workspaces | tail -1 | awk '{print $5}' | sed 's/%//')
  echo "Disk Usage: ${disk_usage}%"
  
  # Database connections (if PostgreSQL)
  if command -v psql &> /dev/null && [ ! -z "$DATABASE_URL" ]; then
    echo ""
    echo "Database Connections:"
    psql "$DATABASE_URL" -c "SELECT count(*) as connections FROM pg_stat_activity;" 2>/dev/null || true
  fi
}

# Main health checks
failed_checks=0
total_checks=0

check_endpoints=(
  "health,Health Check"
  "health/db,Database Health"
  "health/full,Full Health Check"
  "api/bookings,Bookings API"
)

echo ""
echo "🔍 Running Health Checks..."
echo ""

for check in "${check_endpoints[@]}"; do
  IFS=',' read -r endpoint name <<< "$check"
  ((total_checks++))
  
  if ! check_endpoint "$endpoint" "$name"; then
    ((failed_checks++))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calculate error percentage
error_percentage=$((failed_checks * 100 / total_checks))
echo "Summary: $failed_checks/$total_checks checks failed ($error_percentage%)"

# Check if threshold exceeded
if [ "$error_percentage" -ge "$ERROR_THRESHOLD" ]; then
  echo -e "${RED}❌ ERROR THRESHOLD EXCEEDED!${NC}"
  send_alert "🚨 [ALERT] Chega API Health Check Failed" \
    "Failed checks: $failed_checks/$total_checks\nError rate: $error_percentage%\nAPI URL: $API_URL"
  exit 1
else
  echo -e "${GREEN}✅ All systems operational${NC}"
fi

# Show metrics
get_metrics

echo ""
echo "✅ Monitoring check completed at $(date)"

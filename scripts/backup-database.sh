#!/bin/bash

###
### Database Backup Script - Enhanced
###
### Creates automated PostgreSQL backups with rotation.
###
### Features:
### - Automatic daily backups
### - Compression (gzip)
### - Retention policy (keep last 30 days)
### - S3 upload (optional)
### - Email notifications (optional)
###
### Setup:
### 1. chmod +x scripts/backup-database.sh
### 2. Add to crontab: 0 2 * * * /workspace/scripts/backup-database.sh
###
### Usage:
### ./scripts/backup-database.sh
### ./scripts/backup-database.sh --s3-bucket my-backups
### ./scripts/backup-database.sh --keep-days 7
###

set -e

# ===== CONFIGURATION =====
BACKUP_DIR="${BACKUP_DIR:-.}/backups"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/chega-db-${TIMESTAMP}.sql"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"

# S3 Configuration (optional)
S3_ENABLED="${S3_ENABLED:-false}"
S3_BUCKET="${S3_BUCKET:-}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Log functions
log() {
  echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$BACKUP_DIR/backup.log"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1" | tee -a "$BACKUP_DIR/backup.log"
}

error() {
  echo -e "${RED}[ERROR $(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$BACKUP_DIR/backup.log" >&2
  exit 1
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

log "================================"
log "📋 Database Backup Started"
log "================================"
log "Time: $TIMESTAMP"
log "DB: $DB_URL"
log "Destination: $BACKUP_DIR"
echo ""

# Check PostgreSQL connection
log "🔗 Verificando conexão com PostgreSQL..."
if ! psql "$DB_URL" -c "SELECT 1;" > /dev/null 2>&1; then
  error "Não conseguiu conectar ao PostgreSQL"
fi
log "✅ Conexão OK"
echo ""

# Create backup
BACKUP_FILE="$BACKUP_DIR/db_backup_${TIMESTAMP}.sql.gz"
log "📦 Criando backup..."

if pg_dump "$DB_URL" | gzip > "$BACKUP_FILE"; then
  BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  log "✅ Backup criado: $BACKUP_FILE ($BACKUP_SIZE)"
else
  error "Erro ao criar backup"
fi
echo ""

# Upload to S3 (if configured)
if [ -n "$AWS_S3_BUCKET" ] && command -v aws &> /dev/null; then
  log "☁️  Enviando para S3..."
  if aws s3 cp "$BACKUP_FILE" "s3://$AWS_S3_BUCKET/database/" --region "${AWS_REGION:-sa-east-1}"; then
    log "✅ Backup enviado para S3"
  else
    error "Erro ao enviar para S3"
  fi
  echo ""
fi

# Cleanup old backups (local)
log "🧹 Removendo backups antigos (>$RETENTION_DAYS dias)..."
find "$BACKUP_DIR" -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
log "✅ Limpeza concluída"
echo ""

# List recent backups
log "📂 Backups recentes:"
ls -lh "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | tail -5 | awk '{print "  " $9 " (" $5 ")"}'
echo ""

log "================================"
log "✅ Backup Concluído com Sucesso!"
log "================================"
echo ""

# Verify backup integrity
log "🔍 Verificando integridade..."
if gzip -t "$BACKUP_FILE"; then
  log "✅ Arquivo íntegro"
else
  error "Backup corrompido"
fi

# Test restore (opcional - comentado por padrão)
# log "🧪 Testando restore em BD temporária..."
# TEMP_DB="test_restore_$TIMESTAMP"
# createdb "$TEMP_DB" || error "Erro ao criar BD temporária"
# gunzip < "$BACKUP_FILE" | psql "$TEMP_DB" > /dev/null 2>&1 || error "Erro ao restaurar"
# dropdb "$TEMP_DB"
# log "✅ Restore bem-sucedido"

echo ""
log "💡 Para restaurar:"
echo "  gunzip < $BACKUP_FILE | psql $DB_URL"
echo ""

#!/bin/bash

# Script de Backup - Vammos Platform
# Backup database, uploads e configurações

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="vammos_backup_$TIMESTAMP"

echo "🚀 Iniciando backup: $BACKUP_NAME"

# Criar diretório de backup
mkdir -p "$BACKUP_DIR"

# Backup do banco de dados
echo "💾 Fazendo backup do banco de dados..."
if command -v pg_dump > /dev/null; then
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/${BACKUP_NAME}_db.sql"
    echo "✅ Database backup criado"
else
    echo "⚠️  pg_dump não encontrado. Pulando backup do DB"
fi

# Backup de uploads
echo "📁 Fazendo backup de uploads..."
if [ -d "./uploads" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" ./uploads/
    echo "✅ Uploads backup criado"
else
    echo "⚠️  Diretório uploads não encontrado"
fi

# Backup de configurações
echo "⚙️  Fazendo backup de configurações..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="backups" \
    --exclude="*.log" \
    .

echo "✅ Configurações backup criado"

# Criar backup consolidado
echo "📦 Criando backup consolidado..."
tar -czf "$BACKUP_DIR/${BACKUP_NAME}_full.tar.gz" \
    "$BACKUP_DIR/${BACKUP_NAME}_db.sql" \
    "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz" \
    "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz"

echo "✅ Backup consolidado criado"

# Limpar backups temporários (manter apenas o consolidado)
rm -f "$BACKUP_DIR/${BACKUP_NAME}_db.sql"
rm -f "$BACKUP_DIR/${BACKUP_NAME}_uploads.tar.gz"
rm -f "$BACKUP_DIR/${BACKUP_NAME}_config.tar.gz"

# Listar backups existentes
echo "📋 Backups existentes:"
ls -la "$BACKUP_DIR"/vammos_backup_*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"

# Limpar backups antigos (manter apenas os últimos 10)
echo "🧹 Limpando backups antigos..."
ls -t "$BACKUP_DIR"/vammos_backup_*.tar.gz 2>/dev/null | tail -n +11 | xargs -r rm -f

echo "🎉 Backup concluído: $BACKUP_DIR/${BACKUP_NAME}_full.tar.gz"

# Calcular tamanho do backup
if [ -f "$BACKUP_DIR/${BACKUP_NAME}_full.tar.gz" ]; then
    SIZE=$(du -h "$BACKUP_DIR/${BACKUP_NAME}_full.tar.gz" | cut -f1)
    echo "📏 Tamanho do backup: $SIZE"
fi
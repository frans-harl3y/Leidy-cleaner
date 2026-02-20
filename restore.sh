#!/bin/bash

# Script de Restore - Vammos Platform
# Restaura backup do database, uploads e configurações

set -e

BACKUP_DIR="./backups"
RESTORE_DIR="./restore_temp"

if [ $# -eq 0 ]; then
    echo "❌ Uso: $0 <arquivo_backup.tar.gz>"
    echo "📋 Backups disponíveis:"
    ls -la "$BACKUP_DIR"/vammos_backup_*.tar.gz 2>/dev/null || echo "Nenhum backup encontrado"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Iniciando restore do backup: $BACKUP_FILE"

# Criar diretório temporário
mkdir -p "$RESTORE_DIR"

# Extrair backup
echo "📦 Extraindo backup..."
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Encontrar arquivos extraídos
DB_BACKUP=$(find "$RESTORE_DIR" -name "*_db.sql" | head -1)
UPLOADS_BACKUP=$(find "$RESTORE_DIR" -name "*_uploads.tar.gz" | head -1)
CONFIG_BACKUP=$(find "$RESTORE_DIR" -name "*_config.tar.gz" | head -1)

# Restore database
if [ -f "$DB_BACKUP" ] && command -v psql > /dev/null; then
    echo "💾 Restaurando banco de dados..."
    psql "$DATABASE_URL" < "$DB_BACKUP"
    echo "✅ Database restaurado"
else
    echo "⚠️  Backup do database não encontrado ou psql não disponível"
fi

# Restore uploads
if [ -f "$UPLOADS_BACKUP" ]; then
    echo "📁 Restaurando uploads..."
    rm -rf ./uploads
    tar -xzf "$UPLOADS_BACKUP"
    echo "✅ Uploads restaurados"
else
    echo "⚠️  Backup de uploads não encontrado"
fi

# Restore configurações (opcional - pode sobrescrever mudanças locais)
if [ -f "$CONFIG_BACKUP" ] && [ "$2" = "--config" ]; then
    echo "⚙️  Restaurando configurações..."
    tar -xzf "$CONFIG_BACKUP" --exclude="backups" --exclude="node_modules"
    echo "✅ Configurações restauradas"
    echo "🔄 Reinstalando dependências..."
    npm install
else
    echo "⏭️  Pulando restore de configurações (use --config para incluir)"
fi

# Limpar arquivos temporários
echo "🧹 Limpando arquivos temporários..."
rm -rf "$RESTORE_DIR"

echo "🎉 Restore concluído!"

# Verificar health check
echo "🔍 Verificando integridade..."
if command -v curl > /dev/null; then
    sleep 2
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Sistema funcionando corretamente"
    else
        echo "⚠️  Sistema pode precisar de restart"
    fi
fi
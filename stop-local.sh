#!/bin/bash
# Limpar Plus - Stop Local Development

echo "🛑 Stopping Limpar Plus services..."

# Kill processes on common ports
pkill -f "next dev" || true
pkill -f "tsx watch" || true
pkill -f "node.*main.ts" || true

echo "✅ Services stopped"

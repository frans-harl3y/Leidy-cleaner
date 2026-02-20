#!/bin/bash

echo "🛑 Parando aplicação single-port..."

# Parar processos
pkill -f "next dev" 2>/dev/null || echo "Next.js não estava rodando"
pkill -f "tsx watch" 2>/dev/null || echo "Backend não estava rodando"

echo "✅ Aplicação parada"
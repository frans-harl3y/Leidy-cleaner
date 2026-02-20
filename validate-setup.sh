#!/bin/bash

echo "🔍 Validando setup do projeto Vammos..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node > /dev/null 2>&1; then
    echo "❌ Node.js não está instalado."
    exit 1
fi

echo "✅ Pré-requisitos OK"

# Verificar dependências backend
echo "📦 Verificando dependências backend..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências backend..."
    npm install
fi

# Verificar dependências frontend
echo "📦 Verificando dependências frontend..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências frontend..."
    npm install
fi

cd ..

echo "✅ Dependências OK"

# Verificar se .env existe
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Criando .env de exemplo..."
    cp backend/.env.example backend/.env
    echo "📝 Configure as variáveis em backend/.env"
fi

echo "🎉 Setup validado! Use 'docker-compose -f docker-compose.dev.yml up -d' para iniciar."
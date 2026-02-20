#!/bin/bash

# Limpar Plus - Setup Local Development Environment
# Works on any machine without Docker dependency

set -e

echo "🚀 Limpar Plus - Local Setup (No Docker Required)"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "✓ Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}❌ npm not found. Please install npm.${NC}"; exit 1; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18+ required. Current: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK (Node.js $(node -v))${NC}"
echo ""

# Detect OS for specific instructions
OS="$(uname -s)"
case "$OS" in
    Linux*)     OS_NAME="Linux";;
    Darwin*)    OS_NAME="macOS";;
    CYGWIN*)    OS_NAME="Cygwin";;
    MINGW*)     OS_NAME="MinGW";;
    *)          OS_NAME="Unknown";;
esac

echo "🖥️  Detected OS: $OS_NAME"
echo ""

# Backend setup
echo "🔧 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Create .env file for local development
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file for local development..."
    cat > .env << EOF
# Local development with SQLite (no Docker needed)
PORT=3001
NODE_ENV=development
DB_TYPE=sqlite
DATABASE_LOCAL=./database.sqlite

# JWT
JWT_SECRET=dev_jwt_secret_local_development_only
JWT_REFRESH_SECRET=dev_refresh_secret_local_development_only
JWT_EXPIRES_IN=24h

# Email (optional - set to console for local dev)
SMTP_HOST=console
SMTP_PORT=587

# App URL
APP_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping creation${NC}"
fi

echo "📋 Running database migrations..."
npm run migrate 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Migration failed, trying to create database...${NC}"
    # Create database file if it doesn't exist
    touch database.sqlite
    npm run migrate || echo -e "${RED}❌ Migration failed. Check database setup.${NC}"
}

echo "🌱 Seeding database..."
npm run seed 2>/dev/null || echo -e "${YELLOW}⚠️  Seeding failed, continuing...${NC}"

echo -e "${GREEN}✓ Backend ready${NC}"
echo ""

# Frontend setup
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend ready${NC}"
echo ""

# Create startup scripts
echo "📜 Creating startup scripts..."

# Create start-local.sh
cat > ../start-local.sh << 'EOF'
#!/bin/bash
# Limpar Plus - Start Local Development

echo "🚀 Starting Limpar Plus (Local Development)"
echo "============================================"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🔧 Starting Backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend in background
echo "🎨 Starting Frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services starting..."
echo "📊 Backend: http://localhost:3001"
echo "🖥️  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait
EOF

chmod +x ../start-local.sh

# Create stop-local.sh
cat > ../stop-local.sh << 'EOF'
#!/bin/bash
# Limpar Plus - Stop Local Development

echo "🛑 Stopping Limpar Plus services..."

# Kill processes on common ports
pkill -f "next dev" || true
pkill -f "tsx watch" || true
pkill -f "node.*main.ts" || true

echo "✅ Services stopped"
EOF

chmod +x ../stop-local.sh

echo -e "${GREEN}✓ Startup scripts created${NC}"
echo ""

# Summary
echo "=================================================="
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "🚀 Quick Start:"
echo "   ./start-local.sh"
echo ""
echo "🛑 Stop Services:"
echo "   ./stop-local.sh"
echo ""
echo "📊 URLs:"
echo "   🖥️  Frontend: http://localhost:3000"
echo "   🔧 Backend:  http://localhost:3001"
echo "   💚 Health:   http://localhost:3001/health"
echo ""
echo "🔧 Manual Start:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "📝 Test Credentials:"
echo "   Email: admin@limparplus.com"
echo "   Password: admin123456"
echo ""
echo "💡 Tips:"
echo "   - No Docker required!"
echo "   - Works on Windows, Mac, Linux"
echo "   - SQLite database (no PostgreSQL needed)"
echo "   - All dependencies included"
echo ""
echo "🎉 Ready to code!"
echo "=================================================="
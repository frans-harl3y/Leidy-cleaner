# 🔧 Troubleshooting Guide

Soluções rápidas para problemas comuns.

## 🚨 Servidor não inicia

### Erro: `EADDRINUSE: address already in use :::3001`
```bash
# Encerre o processo usando a porta
lsof -ti:3001 | xargs kill -9

# Ou mude a porta
PORT=3002 npm run dev
```

### Erro: `Cannot find module dotenv`
```bash
# Backend dependencies não instaladas
cd backend && npm install && npm run dev
```

---

## 💾 Banco de Dados

### Erro: `Error: connect ECONNREFUSED 127.0.0.1:5432`
```bash
# PostgreSQL não está rodando
docker-compose up -d postgres

# Ou altere DATABASE_URL para SQLite (dev)
DATABASE_URL=sqlite:./database.sqlite npm run dev
```

### Erro: `FATAL: database "leidy_cleaner" does not exist`
```bash
# Rode as migrações
npm run migrate

# Ou seed completo
npm run seed
```

### Como resetar o banco completamente
```bash
# CUIDADO: Apaga todos os dados!
rm database.sqlite
npm run db:init
npm run seed
```

---

## 📡 Redis / Cache

### Erro: `Error: connect ECONNREFUSED 127.0.0.1:6379`
```bash
# Redis não está rodando
docker-compose up -d redis

# Ou desabilitar cache (env var)
REDIS_URL="" npm run dev
```

### Limpar cache manualmente
```bash
redis-cli FLUSHALL
# Ou por pattern
redis-cli KEYS "booking:*" | xargs redis-cli DEL
```

---

## 🔌 Frontend Issues

### Erro: `ENOENT: no such file or directory`
```bash
# Frontend dependencies não instaladas
cd frontend && npm install

# Ou limpar cache Next.js
rm -rf .next node_modules
npm install
npm run dev
```

### Build falhando: `Module not found`
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port 3000 já em uso
```bash
# Mude a porta
PORT=3002 npm run dev

# Ou mate o processo
lsof -ti:3000 | xargs kill -9
```

---

## 🔐 Autenticação

### Erro: `jwt expired`
```bash
# Limpar cookies
# Dev Tools → Application → Cookies → Delete all

# Ou refazer login
```

### Erro: `invalid token`
```bash
# JWT_SECRET mudou? Atualize compatibilidade
# Regenere tokens com: npm run dev (inicia fresh)
```

---

## 💳 Pagamentos

### Erro: `Error: Invalid API Key`
```bash
# Stripe keys faltando em .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...

# Use chaves de TESTE, não produção!
```

### Webhook não recebendo
```bash
# Verificar logs
tail -f backend_data/logs/*.log

# Sentry Dashboard: https://sentry.io/[seu_projeto]
```

---

## 📧 Email

### Emails não sendo enviados
```bash
# Verificar fila
cd backend && npm run queue:stats

# Começar worker se parado
npm run queue:worker

# Limpar fila de emails com erro
npm run queue:clean
```

### Erro: `Invalid login: 535-5.7.8 Invalid`
```bash
# Gmail App Password errado
# Gere nova em: https://accounts.google.com/b/0/AppPasswords

# EMAIL_USER deve ser seu Gmail
# EMAIL_PASS é password de APP, não senha da conta
```

---

## 🧪 Testes

### Testes falhando: `Cannot find module`
```bash
cd backend && npm install
npm test
```

### E2E tests timeout
```bash
# Aumentar timeout
PLAYWRIGHT_TEST_TIMEOUT=60000 npm run e2e

# Ou rodar com UI
npm run e2e:headed
```

### Jest coverage faltando
```bash
npm run test:coverage
# Abra: coverage/lcov-report/index.html
```

---

## 🌐 CORS / Network

### Erro: `Access to XMLHttpRequest blocked by CORS`
```bash
# Frontend enviando request para domínio diferente

# Solução 1: Adicionar domínio em CORS_ORIGIN
CORS_ORIGIN=http://seu-dominio.com npm run dev

# Solução 2: Usar proxy em development
# next.config.js:
async rewrites() {
  return {
    fallback: [{
      source: '/api/:path*',
      destination: 'http://localhost:3001/api/:path*'
    }]
  }
}
```

### Erro 502 Bad Gateway
```bash
# Backend não está respondendo
curl http://localhost:3001/health/full

# Se retornar erro:
cd backend && npm run dev

# Verificar logs do uptime
tail -f backend_data/logs/*.log
```

---

## 📊 Performance

### Aplicação lenta (>2s response time)
```bash
# Verificar queries lentas
cd backend && npm run "db:slow-queries"

# Ou ligar profiling
NODE_OPTIONS="--prof" npm start
# Depois: node --prof-process isolate-*.log > profile.txt
```

### Uso de memória alto
```bash
# Verificar vazamentos
node --inspect backend/src/index.js
# Chrome DevTools > Memory > Heap snapshots

# Ou limpar cache Redis
redis-cli FLUSHALL
```

---

## 🔄 Git Issues

### Commit não passa (lint error)
```bash
# Corrigir automaticamente
cd backend && npm run lint:fix
cd ../frontend && npm run lint:fix

git add .
git commit -m "fix: linting errors"
```

### Merge conflict
```bash
# Editar arquivo com conflito, depois
git add conflicted-file.js
git commit -m "resolve: merge conflict"
git push
```

---

## 🆘 Nuclear Options

### Tudo está quebrado, reset completo
```bash
# Backend reset
cd backend
rm -rf node_modules package-lock.json
npm install
npm run migrate

# Frontend reset
cd ../frontend
rm -rf node_modules package-lock.json .next
npm install
npm run build

# Limpar Docker
docker-compose down -v
docker-compose up -d
```

### Ainda não funciona?
```bash
# Debug com verbose logs
DEBUG=* npm run dev

# Ou procure em:
# - backend_data/logs/error.log
# - Sentry Dashboard
# - Browser DevTools Console
```

---

## 📞 Se nada funcionar

1. **Verifique status de todos os serviços**:
   ```bash
   curl http://localhost:3001/health/full    # Backend
   curl http://localhost:3000                 # Frontend
   redis-cli PING                             # Redis
   pg_isready                                 # PostgreSQL
   ```

2. **Limpe cache e reinstale**:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Reporte em Issues** com:
   - Node version: `node --version`
   - Output de: `npm run dev` (primeria 50 linhas de erro)
   - Output de: `/health/full`
   - SO: Windows/Mac/Linux
   - Reprodução steps

---

**Problema não está aqui?** Abra uma Issue! 🚀

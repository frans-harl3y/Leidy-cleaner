# CONTRIBUTING.md

Guia para contribuir com o projeto Chega (Limpeza Pro).

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- npm 9+
- Git

### Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/dleci9150-ops/chega.git
cd chega

# 2. Instale dependências
cd backend && npm install
cd ../frontend && npm install
cd ..

# 3. Configure variáveis de ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Inicie o banco de dados (se usar PostgreSQL)
docker-compose up -d postgres redis

# 5. Rode migrações
cd backend && npm run migrate && npm run seed

# 6. Inicie servers em terminais separados
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 📋 Branch Naming

Prefixos obrigatórios:
- `feature/` — Nova funcionalidade (ex: `feature/booking-notifications`)
- `fix/` — Correção de bug (ex: `fix/cors-error-on-login`)
- `docs/` — Mudança em documentação (ex: `docs/update-readme`)
- `refactor/` — Refatoração de código (ex: `refactor/database-queries`)
- `test/` — Adições de testes (ex: `test/payment-integration`)

❌ **Evite**: `fix-bug`, `new-feature`, `temp`, etc.

## ✍️ Commits

Use conventional commits:

```
[TYPE] Short description (max 50 chars)

Optional longer description explaining:
- What was changed
- Why it was changed
- How it impacts the project

Examples:
[FEATURE] Add email notification system
[FIX] Resolve CORS error on booking creation
[TEST] Add E2E tests for payment flow
[DOCS] Update deployment guide for Vercel
```

## 🧪 Testes

**Antes de fazer PR, execute:**

```bash
# Backend tests (devem passar 100%)
cd backend
npm run lint
npm run test
npm run test:coverage

# Frontend build (sem erros)
cd ../frontend
npm run build

# E2E tests
npm run e2e
```

**Coverage mínimo**: 80% (verificamos com Jest)

## 🔍 Code Reviews

1. **Crie um Draft PR** enquanto estiver desenvolvendo
2. **Marque como pronto** quando terminar
3. **Aguarde 1 aprovação** antes de merge
4. **Resolva comentários** antes de fazer merge

### O que revisamos:
- ✅ Código segue o padrão do projeto
- ✅ Sem hardcoded secrets ou credentials
- ✅ Testes inclusos e passando
- ✅ Sem console.logs em produção
- ✅ Performance (sem N+1 queries, etc)
- ✅ Acessibilidade no frontend

## 📦 Dependências

### Adicionar nova dependência

```bash
# Backend
cd backend && npm install meu-pacote --save

# Frontend
cd frontend && npm install meu-pacote --save
```

**Importante**: Envie separadamente do código principal em um PR específico. Não faça npm audit fix junto com outras mudanças.

## 🔐 Segurança

- ❌ Nunca commitear `.env` ou arquivos com secrets
- ✅ Use `process.env.VAR_NAME` para valores sensíveis
- ✅ Sempre validate input no backend
- ✅ Use helmet, CORS configurado, rate limiting
- ✅ Hash de senhas com bcrypt (rounds: 12)

## 📝 Documentação

Se sua mudança afeta:
- **API**: Atualize em `backend/docs/API.md`
- **Deploy**: Atualize em `docs/DEPLOY.md`
- **Features**: Atualize em `frontend/docs/FEATURES.md`

## 🐛 Reportando Bugs

Use Issues do GitHub com template:

```
**Descrição**
[Descreva o bug]

**Steps to Reproduce**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Comportamento Esperado**
[O que deveria acontecer]

**Comportamento Atual**
[O que está acontecendo]

**Screenshots**
[Se aplicável]

**Environment**
- OS: [ex: Windows 11]
- Node: [ex: 18.12.0]
- Browser: [ex: Chrome 118]
```

## 💡 Dica de Pro

### Debug rápido
```bash
# Backend com debugger
node --inspect-brk backend/src/index.js
# Abra: chrome://inspect

# Logs com Sentry
curl http://localhost:3001/health/full

# E2E com UI
cd backend && npm run e2e:headed
```

## 📞 Suporte

- 📖 Leia [README.md](./README.md)
- 🔧 Confira [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 💬 Abra uma Issue
- 📧 Contate: [seu-email@seu-dominio.com]

---

**Obrigado por contribuir! 🙌**

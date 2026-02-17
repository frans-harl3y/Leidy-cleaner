# 🚀 VAMMOS - Sistema Completo

> **Status:** Em desenvolvimento | **v1.0.0** | Fevereiro 2026

## 📋 O que é VAMMOS?

VAMMOS é um **sistema web completo** com:
- 🎨 **Frontend moderno** - Next.js + React + Tailwind CSS
- ⚙️ **Backend robusto** - Node.js + TypeScript + Express
- 🗄️ **Banco de dados** - PostgreSQL + Supabase
- 🐳 **DevOps** - Docker, GitHub Actions, CI/CD completo
- 🧪 **Testes** - Jest, Cypress, Playwright
- 📚 **Documentação** - Guias completos de boas práticas

---

## ⚡ Quick Start (5 minutos)

### Pré-requisitos
```bash
✓ Node.js 18+
✓ Docker & Docker Compose
✓ Git
```

### Iniciar
```bash
# 1. Clone
git clone git@github.com:ahri98h/vammos.git
cd vammos

# 2. Setup automático
bash scripts/setup.sh

# 3. Rodar
docker-compose -f docker-compose.dev.yml up

# 4. Acessar
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

✅ **Pronto em 5 minutos!**

---

## 📚 Documentação Completa

### Para Novatos
**→ Leia:** [GUIA_SETUP_INICIAL.md](GUIA_SETUP_INICIAL.md) (30 min)
- Setup passo-a-passo
- Configurar variáveis de ambiente
- Troubleshooting

### Para Desenvolvimento
**→ Leia:** [GUIA_RAPIDO.md](GUIA_RAPIDO.md) (15 min)
- Comandos essenciais
- Padrões de código
- Git workflow

### Para Arquitetura
**→ Leia:** [RESUMO_VISUAL.md](RESUMO_VISUAL.md) (20 min)
- Diagramas da arquitetura
- Pipeline CI/CD
- Stack tecnológico

### Para Detalhes Técnicos
**→ Leia:** [GUIA_BOAS_PRATICAS_COMPLETO.md](GUIA_BOAS_PRATICAS_COMPLETO.md) (2-3 horas)
- 14 seções técnicas completas
- Exemplos de código
- Boas práticas por camada

### Índice Mestre
**→ Consulte:** [INDICE_MESTRE_GUIDES.md](INDICE_MESTRE_GUIDES.md)
- Mapa de toda documentação
- Guias por caso de uso
- Referência cruzada

---

## 🛠️ Stack Tecnológico

### Backend
```
Node.js 18+
├── TypeScript 5.x
├── Express.js
├── PostgreSQL 15
├── Redis (cache)
├── Jest (testes)
└── Winston (logs)
```

### Frontend
```
Next.js 14+
├── React 18+
├── TypeScript 5.x
├── Tailwind CSS
├── Jest + Cypress
└── Playwright (E2E)
```

### DevOps
```
Docker & Docker Compose
├── Multi-stage builds
├── GitHub Actions
├── CI/CD Pipeline
└── Multiple environments
```

---

## 📁 Estrutura do Projeto

```
vammos/
├── 📂 backend/              # Node.js/TypeScript
│   ├── src/
│   │   ├── controllers/     # HTTP controllers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access
│   │   └── middleware/      # Middlewares
│   ├── migrations/          # Database
│   ├── tests/               # Unit tests
│   ├── e2e/                 # E2E tests
│   └── Dockerfile
│
├── 📂 frontend/             # Next.js/React
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Next.js routes
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API calls
│   │   └── styles/          # Tailwind/CSS
│   ├── cypress/             # E2E tests
│   ├── e2e/                 # Playwright
│   └── Dockerfile
│
├── 📂 database/             # Database scripts
│   ├── schema.sql           # Schema
│   ├── migrations/          # Migrations
│   └── seeds/               # Test data
│
├── 📂 config/               # Shared config
│   ├── ci-cd/               # GitHub Actions
│   ├── docker/              # Docker configs
│   └── env/                 # Environment
│
├── 📂 scripts/              # Automation scripts
│   ├── setup.sh             # Initial setup
│   ├── backup.sh            # Database backup
│   └── deploy.sh            # Deployment
│
├── 📚 Documentação (Guides)
│   ├── INDICE_MESTRE_GUIDES.md
│   ├── GUIA_SETUP_INICIAL.md
│   ├── GUIA_RAPIDO.md
│   ├── RESUMO_VISUAL.md
│   └── GUIA_BOAS_PRATICAS_COMPLETO.md
│
└── 📋 Configuration Files
    ├── docker-compose.dev.yml
    ├── docker-compose.prod.yml
    ├── package.json
    ├── tsconfig.json
    └── README.md (este arquivo)
```

---

## 🚀 Comandos Principais

### Setup & Development
```bash
# Setup inicial
npm run setup

# Desenvolvimento com Docker
npm run dev:docker

# Desenvolvimento local
npm run dev

# Build
npm run build

# Parar tudo
npm run stop
```

### Testes
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# E2E (Cypress)
cd frontend && npm run cypress:open

# E2E (Playwright)
cd frontend && npm run playwright:test

# Coverage
npm run test:coverage
```

### Database
```bash
# Setup banco
npm run db:setup

# Migrações
npm run migrate

# Seed data
npm run seed

# Cleanup
npm run db:drop
```

### Code Quality
```bash
# Lint tudo
npm run lint

# Format
npm run format

# Type check
npm run type-check
```

---

## 🔧 Variáveis de Ambiente

### Setup Rápido
```bash
# Copiar templates
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### Backend (.env)
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=dev-secret
REDIS_URL=redis://localhost:6379
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=VAMMOS
```

**⚠️ Nunca committar arquivos .env!**

---

## 🐳 Docker

### Desenvolvimento
```bash
docker-compose -f docker-compose.dev.yml up
```

### Staging
```bash
docker-compose -f docker-compose.staging.yml up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🧪 Testes

### Backend
```bash
cd backend
npm test              # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage # With coverage
```

### Frontend
```bash
cd frontend
npm test              # Unit + Component tests
npm run cypress:open  # UI tests
npm run playwright:test  # E2E tests
```

### Meta
- ✅ Coverage mínima: **70%**
- ✅ Todos os testes passando em CI/CD
- ✅ Lint sem erros

---

## 📊 Pipeline CI/CD

Cada push ativa automaticamente:
```
1. ✅ Testes (Backend + Frontend)
2. ✅ Linting (Code quality)
3. ✅ Coverage (70%+ required)
4. ✅ Build (Sem erros)
5. ✅ Deploy (Se main branch)
6. ✅ Monitoring (Health checks)
```

Ver: [.github/workflows/](.github/workflows/)

---

## 🔒 Segurança

### Implementado
- ✅ JWT Authentication
- ✅ HTTPS/TLS (prod)
- ✅ CORS Protection
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ CSRF Tokens
- ✅ Security Headers (Helmet)

Ver: [GUIA_BOAS_PRATICAS_COMPLETO.md#10-segurança](GUIA_BOAS_PRATICAS_COMPLETO.md#10-segurança)

---

## 🚀 Deployment

### Requisitos
- ✅ Todos os testes passando
- ✅ Coverage ≥ 70%
- ✅ Sem linting errors
- ✅ .env configurado
- ✅ Backup do BD

### Processo
```bash
# 1. Feature completa com PR merged
# 2. Tag release
git tag v1.0.0

# 3. Push
git push origin v1.0.0

# 4. GitHub Actions dispara deploy automático
# 5. Monitoramento ativo

# 6. Se problema:
npm run rollback
```

Ver: [backend/DEPLOY.md](backend/DEPLOY.md)

---

## 📈 Monitoramento

### URLs de Monitoramento
- **Health Check:** `GET /health`
- **API Docs:** `http://localhost:3001/api-docs`
- **Logs:** `logs/combined.log`
- **Metrics:** [Seu provider]

### Alertas Importantes
- ⚠️ API response time > 1s
- ⚠️ Error rate > 1%
- ⚠️ Database connection failed
- ⚠️ Memory usage > 80%

---

## 🤝 Contributing

### Workflow
1. 📋 Criar issue
2. 🔄 Fork / branch feature
3. 💻 Implementar com testes
4. ✅ Lint e testes passando
5. 📝 Abrir PR com descrição
6. 👀 Code review
7. ✨ Merge

### Padrões Obrigatórios
```bash
# Commits
feat: nova funcionalidade
fix: corrigir bug
docs: atualizar documentação

# PRs
title: [tipo] descrição breve
body: Explicação detalhada + links para issues

# Branches
feature/nome-feature
hotfix/bug-crítico
release/1.0.0
```

Ver: [CONTRIBUTING.md](CONTRIBUTING.md) | [GUIA_RAPIDO.md](GUIA_RAPIDO.md#git-workflow)

---

## 📞 Suporte & FAQ

### Não consegue fazer setup?
→ Ler [GUIA_SETUP_INICIAL.md](GUIA_SETUP_INICIAL.md) - Seção Troubleshooting

### Dúvida técnica?
→ Consultar [GUIA_BOAS_PRATICAS_COMPLETO.md](GUIA_BOAS_PRATICAS_COMPLETO.md)

### Comandos rápidos?
→ Ver [GUIA_RAPIDO.md](GUIA_RAPIDO.md)

### Entender arquitetura?
→ Consultar [RESUMO_VISUAL.md](RESUMO_VISUAL.md)

### Reportar bug?
→ Abrir [GitHub Issue](https://github.com/ahri98h/vammos/issues)

---

## 📅 Roadmap

### Fase 1 (Atual)
- [x] Estrutura base
- [x] Documentação completa
- [x] Testes automatizados
- [ ] Deploy em staging

### Fase 2
- [ ] Otimizações de performance
- [ ] Dashboard admin
- [ ] Análises avançadas

### Fase 3
- [ ] Mobile app
- [ ] Integrações terceiros
- [ ] (Seus planos aqui)

---

## 📊 Estatísticas

```
Backend
├── Controllers: 10+
├── Services: 15+
├── Tests: 50+
└── Coverage: 75%+

Frontend
├── Components: 30+
├── Pages: 20+
├── Tests: 40+
└── Lighthouse: 90+

Database
├── Tables: 8+
├── Migrations: 15+
└── Indexes: 20+

Documentação
├── Guias: 5
├── Páginas: 40+
└── Exemplos: 50+
```

---

## 📋 License

[Escolha sua licença aqui - MIT, Apache 2.0, etc]

---

## 👨‍💻 Team

| Role | GitHub | Email |
|------|--------|-------|
| Lead Backend | [@user](https://github.com) | backend@vammos.com |
| Lead Frontend | [@user](https://github.com) | frontend@vammos.com |
| DevOps | [@user](https://github.com) | devops@vammos.com |

---

## 🙏 Reconhecimentos

Agradeço a:
- 🤝 Todos os contribuidores
- 📚 Comunidade open source
- 💡 Feedback do team

---

## 🎯 Próximas Ações

### Você é novo?
→ Leia [GUIA_SETUP_INICIAL.md](GUIA_SETUP_INICIAL.md)

### Vai desenvolver?
→ Leia [GUIA_RAPIDO.md](GUIA_RAPIDO.md)

### Quer entender tudo?
→ Leia [INDICE_MESTRE_GUIDES.md](INDICE_MESTRE_GUIDES.md)

---

## 📌 Links Importantes

- 📖 Documentação: [Guias](./GUIA_BOAS_PRATICAS_COMPLETO.md)
- 🐛 Issues: [GitHub Issues](https://github.com/ahri98h/vammos/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/ahri98h/vammos/discussions)
- 📊 Board: [GitHub Projects](https://github.com/ahri98h/vammos/projects)
- 🔄 CI/CD: [GitHub Actions](https://github.com/ahri98h/vammos/actions)

---

**Bem-vindo ao VAMMOS! 🚀**

Made with ❤️ pelo time de desenvolvimento

Last updated: Fevereiro, 2026

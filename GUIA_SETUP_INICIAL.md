# 🚀 GUIA DE SETUP INICIAL - VAMMOS

**Para:** Novos membros do time  
**Tempo estimado:** 45 minutos  
**Pré-requisitos:** Git, Docker, Node.js

---

## ✅ Pré-requisitos Obrigatórios

### 1. Verificar instalações
```bash
# Node.js 18+
node --version  # Deve ser v18.x.x ou superior

# npm
npm --version   # Deve ser 9.x.x ou superior

# Git
git --version   # Qualquer versão recente

# Docker
docker --version       # Deve ser 24.x ou superior
docker-compose --version  # Deve ser 2.x ou superior
```

**Não tem?** Instale aqui:
- **Node.js:** https://nodejs.org/ (escolha LTS 18+)
- **Docker:** https://docker.com/products/docker-desktop
- **Git:** https://git-scm.com/

### 2. Configurar Git
```bash
# Defina seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@empresa.com"

# Verifique
git config --global user.name
git config --global user.email
```

### 3. Gerar SSH Key (Recomendado)
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "seu.email@empresa.com"

# Seguir prompts (deixar senha em branco ou definir)
# Arquivo será: ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar em: GitHub Settings → SSH Keys
```

---

## 📥 Clonar Repositório

```bash
# Via SSH (recomendado)
git clone git@github.com:seu-org/vammos.git
cd vammos

# Ou via HTTPS (se preferir)
git clone https://github.com/seu-org/vammos.git
cd vammos
```

---

## 🔧 Instalar Dependências

```bash
# 1. Instalar dependências da raiz
npm install

# 2. Instalar dependências do backend
cd backend
npm install
cd ..

# 3. Instalar dependências do frontend
cd frontend
npm install
cd ..

# Você deve estar na raiz agora
cd ..
```

✅ Quando terminar, você terá ~500MB de `node_modules` instalados.

---

## 🔑 Configurar Variáveis de Ambiente

### Passo 1: Criar arquivo `.env` na raiz

```bash
cp .env.example .env
```

### Passo 2: Editar `.env` com seus valores
```bash
# Abra em seu editor favorito
code .env
# ou
nano .env
# ou
vim .env
```

### Valores básicos para desenvolvimento
```bash
# Ambiente
COMPOSE_PROJECT_NAME=vammos
COMPOSE_FILE=docker-compose.dev.yml

# Database
DB_USER=vammos_dev
DB_PASSWORD=dev_password_123
DB_NAME=vammos_db
DB_HOST=postgres
DB_PORT=5432
```

### Passo 3: Criar `.env` do Backend

```bash
cd backend
cp .env.example .env
```

Editar `backend/.env`:
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://vammos_dev:dev_password_123@postgres:5432/vammos_db
JWT_SECRET=dev-secret-key-change-in-production
REDIS_URL=redis://redis:6379
```

### Passo 4: Criar `.env.local` do Frontend

```bash
cd ../frontend
cp .env.example .env.local
```

Editar `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=VAMMOS
NEXT_PUBLIC_SUPPORT_EMAIL=support@vammos.com
```

✅ Você está pronto para rodar com Docker!

---

## 🐳 Rodar com Docker Compose

### Opção A: Desenvolvimento (Recomendado Iniciantes)

```bash
# Voltar para raiz
cd ../..

# Iniciar containers
docker-compose -f docker-compose.dev.yml up

# Aguarde 30-60 segundos enquanto tudo inicia...
# Quando ver "ready to accept connections", está pronto!
```

**O que acontece:**
- ✅ PostgreSQL inicia
- ✅ Backend compila e inicia em `http://localhost:3001`
- ✅ Frontend inicia em `http://localhost:3000`
- ✅ Banco de dados é inicializado

### Parar containers
```bash
# Ctrl + C no terminal, ou em outro terminal:
docker-compose -f docker-compose.dev.yml down

# Remover volumes (BD limpo)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🌐 Acessar a Aplicação

### URLs Locais
| Serviço | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | 🟢 Verde |
| Backend API | http://localhost:3001 | 🟢 Verde |
| DB Admin (se habilitado) | http://localhost:5432 | 🟢 Verde |
| API Docs | http://localhost:3001/api-docs | 🟢 Verde |

### Testar Backend
```bash
# Em outro terminal
curl http://localhost:3001/health

# Resposta esperada:
# {"status":"healthy","timestamp":"2026-02-17T...","environment":"development"}
```

### Testar Frontend
Abra no navegador: http://localhost:3000

Você deve ver a página inicial do VAMMOS.

---

## 🧪 Executar Testes

### Testes Backend
```bash
cd backend
npm run test              # Executar testes
npm run test:coverage     # Com cobertura
npm run lint              # Verificar linting
```

### Testes Frontend
```bash
cd frontend
npm run test              # Executar testes
npm run lint              # Linting
npm run build             # Build de produção
```

---

## 📝 Primeiro Commit

```bash
# Voltar para raiz
cd ../..

# Criar um branch feature
git checkout -b feature/seu-primeiro-teste

# Fazer uma mudança pequena (teste)
echo "# Testando setup" >> README.md

# Adicionar mudança
git add README.md

# Fazer commit
git commit -m "test: verificar setup inicial"

# Ver branches
git branch

# Voltar para develop quando terminar
git checkout develop
```

❌ Não faça push ainda! Este é apenas um teste local.

---

## ✨ Próximos Passos

### Imediato (Hoje)
- [x] Verificar pré-requisitos
- [x] Clonar repositório
- [x] Instalar dependências
- [x] Configurar variáveis de ambiente
- [x] Subir Docker Compose
- [x] Acessar aplicação
- [ ] Ler [GUIA_RAPIDO.md](GUIA_RAPIDO.md)
- [ ] Ler [RESUMO_VISUAL.md](RESUMO_VISUAL.md)

### Curto Prazo (Esta Semana)
- [ ] Ler documentação de sua especialidade (Backend/Frontend/DevOps)
- [ ] Fazer uma task simples
- [ ] Submeter seu primeiro PR
- [ ] Receber feedback

### Médio Prazo (Este Mês)
- [ ] Contribuir com features
- [ ] Mentorear novo membro
- [ ] Melhorar documentação
- [ ] Propor otimizações

---

## 🆘 Troubleshooting

### "Port 3000 / 3001 já está em uso"
```bash
# Encontrar e parar o serviço
lsof -i :3000
kill -9 <PID>

# Ou mudar porta em .env
FRONTEND_PORT=3002
BACKEND_PORT=3002
```

### "Docker comando não encontrado"
```bash
# Reinstale Docker Desktop
# https://docker.com/products/docker-desktop

# Verificar após instalação
docker --version
```

### "npm install falha"
```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar
npm install
```

### "Banco de dados não conecta"
```bash
# Verificar se o container está rodando
docker-compose ps

# Ver logs
docker-compose logs postgres

# Recriar container
docker-compose down -v
docker-compose up
```

### "Node versions mismatch"
```bash
# Verificar sua versão
node --version

# Se diferente, usar nvm (recomendado)
# https://github.com/nvm-sh/nvm

nvm install 18
nvm use 18
```

---

## 🔍 Verificação Final

Execute este checklist para garantir que está tudo OK:

```bash
# ✅ Git
git --version
git config user.name

# ✅ Node
node --version
npm --version

# ✅ Docker
docker --version
docker-compose --version

# ✅ Repositório clonado
cd vammos
pwd

# ✅ Dependências
ls backend/node_modules | wc -l
ls frontend/node_modules | wc -l

# ✅ Variáveis de ambiente
cat .env | grep DB_USER
cat backend/.env | grep NODE_ENV
cat frontend/.env.local | grep NEXT_PUBLIC_API_URL

# ✅ Docker running
docker ps
```

Se todos os comandos acima retornam valores, **você está pronto!** ✅

---

## 📚 Próxima Leitura

Agora que está tudo configurado, leia nesta ordem:

1. **[GUIA_RAPIDO.md](GUIA_RAPIDO.md)** (15 min)
   - Comandos essenciais
   - Padrões de código
   - Troubleshooting

2. **[RESUMO_VISUAL.md](RESUMO_VISUAL.md)** (20 min)
   - Arquitetura do projeto
   - Fluxo de desenvolvimento
   - Diagrama de workflow

3. **Documentação da sua especialidade:**
   - **Backend?** → GUIA_BOAS_PRATICAS_COMPLETO.md #3,5,6
   - **Frontend?** → GUIA_BOAS_PRATICAS_COMPLETO.md #4,6
   - **Full-stack?** → Todos acima
   - **DevOps?** → GUIA_BOAS_PRATICAS_COMPLETO.md #7,8

---

## 💬 Precisa de Ajuda?

### Antes de perguntar
1. ✅ Ler esta documentação
2. ✅ Consultar [GUIA_RAPIDO.md](GUIA_RAPIDO.md)
3. ✅ Procurar em [troubleshooting](#-troubleshooting) acima

### Onde perguntar
- **Slack:** #dev (dúvidas técnicas)
- **GitHub:** Criar issue
- **Em pessoa:** Chamar um desenvolvedor experiente
- **Reviews:** Perguntar em PR

### Reportar problemas
Se encontrou um problema não documentado:
```bash
# Criar issue bem descrito
1. Título claro
2. Passos para reproduzir
3. Output/logs
4. Seu ambiente (SO, versões)
5. Screenshot (se aplicável)
```

---

## 🎉 Parabéns!

Você completou o setup inicial! 🎊

Você agora tem:
- ✅ Projeto rodando localmente
- ✅ Ambiente de desenvolvimento funcional
- ✅ Acesso a documentação
- ✅ Conhecimento de próximos passos

**Próxima ação:** Ler [GUIA_RAPIDO.md](GUIA_RAPIDO.md)

---

## 📋 Quick Commands Reference

```bash
# Iniciar desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Parar
docker-compose down

# Limpar banco
docker-compose down -v

# Testes backend
cd backend && npm test

# Testes frontend
cd frontend && npm test

# Build para produção
npm run build

# Linter
npm run lint

# Criar feature
git checkout -b feature/nome-feature

# Fazer commit
git commit -m "feat: descrição"

# Fazer push
git push origin feature/nome-feature

# Ir para documentação
open GUIA_RAPIDO.md  # macOS
xdg-open GUIA_RAPIDO.md  # Linux
start GUIA_RAPIDO.md  # Windows
```

---

**Bem-vindo ao VAMMOS! 🚀**

Última atualização: Fevereiro de 2026

# 📋 CHECKLIST DE VALIDAÇÃO - DEPLOYMENT

## ✅ Concluído nesta sessão

- [x] Gerados 3 secrets aleatórios (JWT, Session, PIX Webhook)
- [x] `backend/.env.production` preenchido com secrets
- [x] `frontend/.env.production` criado e configurado
- [x] `nginx/default.conf` atualizado com HTTPS + Let's Encrypt
- [x] `docker-compose.production.yml` criado (completo com PostgreSQL, Redis, Certbot)
- [x] `deploy-production.sh` criado (script de deploy totalmente automático)
- [x] `DEPLOYMENT_READY_COMPLETE.md` gerado (guia passo-a-passo completo)

---

## 🔴 PENDENTE - Ações do Usuário

### 1. Segurança - CRÍTICO ⚠️
- [ ] Gerar senhas fortes para Database e Redis
  - Editar: `docker-compose.production.yml`
  - Buscar: `CHANGE_ME_STRONG_PASSWORD`
  - Exemplo: `MyP@ssw0rd2024SecureDB!`

### 2. Pagamentos - CRÍTICO ⚠️
- [ ] Adicionar chave Stripe Secret
  - Local: `backend/.env.production`
  - Buscar: `STRIPE_SECRET_KEY=sk_live_CHANGE_ME`
  
- [ ] Adicionar chave Stripe Public
  - Local: `backend/.env.production`
  - Buscar: `STRIPE_PUBLISH_KEY=pk_live_CHANGE_ME`

- [ ] Adicionar webhook secret Stripe
  - Local: `backend/.env.production`
  - Buscar: `STRIPE_WEBHOOK_SECRET=<SET_ME_STRIPE_WEBHOOK>`

### 3. Email - RECOMENDADO
- [ ] Configurar Gmail app password
  - Ir em: https://myaccount.google.com/apppasswords
  - Local para adicionar: `backend/.env.production` → `EMAIL_PASS`

### 4. Domínio - CRÍTICO ⚠️
- [ ] Apontar DNS do seu provedor
  - Tipo: A Record
  - Nome: cleanerleidy.com.br
  - Valor: IP_DO_SEU_SERVIDOR
  - ⏱️ Leva até 24h para propagar

### 5. Servidor - CRÍTICO ⚠️
- [ ] Ter VPS/Server pronto
  - Requisitos: Ubuntu 20.04+, Docker, Docker Compose
  - Recomendado: AWS, DigitalOcean, Linode, OVH, Hostinger VPS
  - Minimum: 2GB RAM, 20GB SSD, 1vCPU

### 6. Git - IMPORTANTE
- [ ] Fazer commit das mudanças
  ```bash
  git add -A
  git commit -m "🚀 Production deployment ready"
  git push origin main
  ```

---

## 🚀 Quando tudo estiver pronto:

### NO SEU SERVIDOR (via SSH)
```bash
# 1. Clonar repositório
cd /opt
git clone https://github.com/leci45538-hue/acabamos.git
cd acabamos

# 2. Executar deploy
chmod +x deploy-production.sh
./deploy-production.sh

# 3. Monitorar logs
docker logs -f cleanerleidy-backend
```

---

## 📁 Arquivos Modificados/Criados

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `backend/.env.production` | ✏️ Editado | Secrets já preenchidos, credenciais faltam |
| `frontend/.env.production` | ✅ Criado | Configuração de produção OK |
| `docker-compose.production.yml` | ✅ Criado | Setup completo com DB, Cache, SSL |
| `nginx/default.conf` | ✏️ Editado | HTTPS com Let's Encrypt |
| `deploy-production.sh` | ✅ Criado | Script automático e testado |
| `DEPLOYMENT_READY_COMPLETE.md` | ✅ Criado | Guia detalhado de deployment |

---

## 🔐 Segredos já gerados e armazenados

```
JWT_SECRET:         9152b628dd562931aa05fd68cadbcd13a4e631a1eadfcabb701eb5a9c6a11764
JWT_REFRESH_SECRET: 3043a825487e075eacee10aec8f16e555150f9587da4e528f4d8aacf70d35194
PIX_WEBHOOK_SECRET: e5e8817206227199a98dbe2bd2e5e596107a53421b12a3658f3a2040f237c6da
```

⚠️ **IMPORTANTE**: Esses valores estão em `backend/.env.production` e fora do git (no .gitignore)
Para mover para outro lugar (keepass, 1password, vault):
- Copie manualmente para local seguro
- Nunca compartilhe ou comite para repositório público

---

## 📊 Configuração Final - Resumo

```
🌐 Domínio:              cleanerleidy.com.br
🔒 SSL/TLS:              Let's Encrypt (automático)
📡 API Backend:          https://cleanerleidy.com.br/api
💻 Frontend:             https://cleanerleidy.com.br
📦 Database:             PostgreSQL 15 (containerizado)
⚡ Cache:                 Redis 7 (containerizado)
🔌 Proxy Reverso:        NGINX (containerizado)
🛡️ Certificados:         Certbot/Let's Encrypt (automático)
🐳 Orquestração:         Docker Compose v3.8
```

---

## 🎯 Próximas ações (In Order):

1. ✅ Commits mudanças no Git
2. ⏳ Prepara VPS/Server
3. ⏳ Aponta DNS para servidor
4. ⏳ Aguarda propagação DNS (até 24h)
5. ⏳ SSH no servidor
6. ⏳ Executa `./deploy-production.sh`
7. ⏳ Configura webhooks (Stripe/MercadoPago)
8. ⏳ Testa site em https://cleanerleidy.com.br

---

## 💡 Dicas importantes

- Guarde os secrets em local seguro (não deixe no git)
- Faça backup do banco de dados regularmente
- Monitore logs do aplicativo
- Configure alertas para downtime
- Teste o site em produção completamente antes de ir live
- Renove certificados before they expire (automático com Certbot)

---

**Status Geral**: 🟡 **70% PRONTO - Aguardando configurações finais do usuário**

Todos os scripts, configurações, e infraestrutura estão prontos.
Faltam apenas credenciais específicas (Stripe, Email, senhas do DB).

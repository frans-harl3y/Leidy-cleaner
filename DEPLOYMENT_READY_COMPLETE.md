# 🚀 GUIA PRONTO PARA DEPLOY - CLEANERLEIDY.COM.BR

## 📋 Status de Preparação

✅ **JWT Secrets**: Gerados e configurados
✅ **Backend .env.production**: Configurado com domínio correto
✅ **Frontend .env.production**: Configurado com domínio correto
✅ **NGINX**: Configurado com HTTPS (Let's Encrypt)
✅ **Docker Compose**: Production-ready com PostgreSQL, Redis, Certbot
✅ **Deploy Script**: Automático pronto para usar

---

## 🔐 SEGREDOS GERADOS E ARMAZENADOS

```
JWT_SECRET:           9152b628dd562931aa05fd68cadbcd13a4e631a1eadfcabb701eb5a9c6a11764
JWT_REFRESH_SECRET:   3043a825487e075eacee10aec8f16e555150f9587da4e528f4d8aacf70d35194
PIX_WEBHOOK_SECRET:   e5e8817206227199a98dbe2bd2e5e596107a53421b12a3658f3a2040f237c6da

⚠️  IMPORTANTE: Guarde esses valores em um local seguro!
    Nunca compartilhe ou coloque em públic repositories.
```

---

## ✅ O QUE AINDA PRECISA SER FEITO

### 1️⃣ **Senha do Banco de Dados** (OBRIGATÓRIO)
Edite `docker-compose.production.yml`:
```yaml
environment:
  POSTGRES_PASSWORD: CHANGE_ME_STRONG_PASSWORD  # Mude isso!
  REDIS_PASSWORD: CHANGE_ME_STRONG_PASSWORD      # E isso!
```

Escolha senhas fortes (20+ caracteres com números e símbolos).

---

### 2️⃣ **Credenciais de Pagamento** (OBRIGATÓRIO)

Edite `backend/.env.production`:

#### Stripe
```env
STRIPE_SECRET_KEY=sk_live_YOUR_REAL_KEY_HERE
STRIPE_PUBLIC_KEY=pk_live_YOUR_REAL_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_REAL_KEY_HERE
```

**Encontre em**: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys

#### MercadoPago (Opcional)
```env
MERCADOPAGO_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
```

#### PIX (Se usar banco específico)
```env
PIX_PROVIDER_KEY=YOUR_PIX_KEY
PIX_PROVIDER_SECRET=YOUR_PIX_SECRET
```

---

### 3️⃣ **Email/SMTP** (Para notificações)

Edite `backend/.env.production`:
```env
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=seu-app-password  # Gerar em: https://myaccount.google.com/apppasswords
```

---

### 4️⃣ **Domínio DNS** (CRÍTICO)

Configure seu registrador (registro A):
```
cleanerleidy.com.br  →  SEU_IP_DO_SERVIDOR
```

Leva até 24h para propagar.

---

### 5️⃣ **SSL/HTTPS Certificate** (Automático com Certbot)

O certificado será gerado automaticamente quando o deploy rodar:
```bash
# Let's Encrypt vai criar em /certbot/conf/
# Renovação automática a cada 60 dias
```

---

## 🎯 PASSO A PASSO DO DEPLOY

### **ANTES DE COMEÇAR**
1. Tenha acesso SSH ao servidor
2. Servidor deve ter Docker + Docker Compose instalados
3. Ter redigido TODAS as credenciais acima
4. Ter Git clone do repositório no servidor

---

### **NO SEU COMPUTADOR (Local)**

#### Passo 1: Finalizar configuração local
```bash
# Editar e fechar todos os arquivos CHANGE_ME
vim backend/.env.production
vim docker-compose.production.yml
```

#### Passo 2: Commitar mudanças
```bash
cd /workspaces/acabamos
git add -A
git commit -m "🚀 Production deployment configuration ready"
git push origin main
```

---

### **NO SERVIDOR (VPS/Hosting)**

#### Passo 1: SSH no servidor
```bash
ssh root@SEU_IP_DO_SERVIDOR
```

#### Passo 2: Clonar repositório (primeira vez)
```bash
cd /opt
git clone https://github.com/leci45538-hue/acabamos.git
cd acabamos
```

#### Passo 3: Pull das mudanças
```bash
git pull origin main
```

#### Passo 4: Executar deploy automático
```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

O script vai:
- ✅ Validar tudo
- ✅ Fazer build do Docker
- ✅ Iniciar containers
- ✅ Testar conexões
- ✅ Validar deploy

---

### **Após o Deploy**

#### Verificar Status
```bash
# Ver containers rodando
docker ps

# Ver logs do backend
docker logs -f cleanerleidy-backend

# Ver logs do nginx
docker logs -f cleanerleidy-nginx
```

#### Configurar Webhooks de Pagamento

**Stripe**:
1. [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Endpoint: `https://cleanerleidy.com.br/api/webhooks/stripe`
3. Events: `charge.succeeded`, `charge.failed`, `customer.subscription.created`

**MercadoPago**:
1. [MercadoPago Panel](https://www.mercadopago.com.br/account/notifications)
2. Tema: Pagamentos
3. URL: `https://cleanerleidy.com.br/api/webhooks/mercadopago`

---

## 🔍 CHECKLIST FINAL

```
[ ] Docker + Docker Compose instalados no servidor
[ ] DNS apontando para servidor (verificar com: ping cleanerleidy.com.br)
[ ] .env.production com TODOS os valores reais
[ ] Senhas do DB fortes e guardadas em local seguro
[ ] Credenciais Stripe/MercadoPago validadas
[ ] Email SMTP testado
[ ] SSH acesso ao servidor confirmado
[ ] Repositório git clonado no servidor
[ ] deploy-production.sh é executável
[ ] docker-compose.production.yml validado
[ ] NGINX config com SSL paths corretos
```

---

## 🚨 POSSÍVEIS ERROS E SOLUÇÕES

### "Connection refused" no Backend
```bash
# O backend pode estar iniciando, aguarde 1 minuto
docker logs cleanerleidy-backend

# Se persistir, reinicie manualmente
docker restart cleanerleidy-backend
```

### "Certificate not found" no NGINX
```bash
# Certbot precisa gerar primeiro
docker exec cleanerleidy-certbot certbot certonly --webroot \
  -w /var/www/certbot \
  -d cleanerleidy.com.br \
  -d www.cleanerleidy.com.br

# Depois reinicie nginx
docker restart cleanerleidy-nginx
```

### "Database connection refused"
```bash
# Verifica se PostgreSQL iniciou
docker logs cleanerleidy-db

# Reinicia se necessário
docker restart cleanerleidy-db
```

### "No space left on device"
```bash
# Limpar imagens não usadas
docker system prune -a

# Limpar volumes não usados
docker volume prune
```

---

## 📊 MONITORAMENTO PÓS-DEPLOY

### Logs em Tempo Real
```bash
# Backend
docker logs -f cleanerleidy-backend

# Frontend
docker logs -f cleanerleidy-frontend

# NGINX
docker logs -f cleanerleidy-nginx

# Todos
docker-compose -f docker-compose.production.yml logs -f
```

### Backup do Banco de Dados
```bash
# Backup completo
docker exec cleanerleidy-db pg_dump -U cleanerleidy cleanerleidy > backup-$(date +%Y%m%d).sql

# Restaurar de backup
docker exec -i cleanerleidy-db psql -U cleanerleidy cleanerleidy < backup-20260212.sql
```

### Atualizar Aplicação (Nova Release)
```bash
# No servidor
cd /opt/acabamos
git pull origin main
docker-compose -f docker-compose.production.yml build --no-cache
docker-compose -f docker-compose.production.yml up -d
```

---

## 🆘 SUPORTE E PRÓXIMOS PASSOS

### Documentação
- [Docker Docs](https://docs.docker.com)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [Stripe Integration](https://stripe.com/docs/plugins/web-development)

### Monitoramento Recomendado
- Sentry para rastrear erros
- New Relic para performance
- Verificação de SSL: https://www.ssllabs.com/ssltest/

---

## ✨ RESUMO RÁPIDO

```bash
# Tudo preparado! Apenas execute no servidor:
cd /opt/acabamos && ./deploy-production.sh

# Acesse após deployo:
# https://cleanerleidy.com.br ✅
```

**Status**: 🟢 PRONTO PARA DEPLOY

Boa sorte! 🚀

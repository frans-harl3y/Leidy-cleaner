# ✅ Pre-Deployment Production Checklist

**All 10 critical tasks must be completed before deploying to production.**

---

## Critical Path (Do First)

These tasks must be completed in order:

### 1. ✅ Sentry Setup
- [ ] Create Sentry account
- [ ] Get DSN key
- [ ] Add to `.env`
- [ ] Test error capture
- [ ] Configure email alerts

**Guide:** [SENTRY_SETUP.md](./docs/SENTRY_SETUP.md)

### 2. ✅ Database Configuration
- [ ] Choose PostgreSQL provider (Railway/Supabase)
- [ ] Create database
- [ ] Get connection string
- [ ] Run migrations
- [ ] Seed test data (optional)

**Guide:** [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)

### 3. ✅ Email Setup
- [ ] Enable 2FA on Gmail
- [ ] Generate App Password
- [ ] Add EMAIL_USER and EMAIL_PASS to `.env`
- [ ] Test email sending
- [ ] Verify templates render correctly

**Guide:** [EMAIL_SETUP.md](./docs/EMAIL_SETUP.md)

### 4. ✅ Stripe Configuration
- [ ] Create Stripe account
- [ ] Get test keys
- [ ] Add STRIPE_SECRET_KEY to `.env`
- [ ] Create payment endpoints
- [ ] Test with test cards
- [ ] Setup webhooks

**Guide:** [STRIPE_SETUP.md](./docs/STRIPE_SETUP.md)

### 5. ✅ JWT Secrets
- [ ] Generate new secrets
- [ ] JWT_SECRET (access tokens)
- [ ] JWT_REFRESH_SECRET (refresh tokens)
- [ ] Add to `.env`
- [ ] Rotate quarterly

**Command:** `npm run generate:secrets`

---

## High Priority (Before First Week)

### 6. ✅ SSL/TLS
- [ ] Certificate installed (Let's Encrypt)
- [ ] HTTPS redirect configured
- [ ] HSTS headers enabled
- [ ] SSL Labs rating: A or better
- [ ] Auto-renewal setup

**Guide:** [SSL_TLS_SETUP.md](./docs/SSL_TLS_SETUP.md)

### 7. ✅ Load Testing
- [ ] Run baseline tests
- [ ] Identify bottlenecks
- [ ] Database pooling configured (DB_POOL_MAX=30)
- [ ] Cache strategy enabled (Redis)
- [ ] Performance acceptable (>100 req/sec)

**Command:** `./scripts/load-test.sh`

### 8. ✅ Backup Automation
- [ ] Backup script tested
- [ ] Retention policy: 30 days
- [ ] S3 upload configured (optional)
- [ ] Restore tested
- [ ] Cron job scheduled (daily 2 AM)

**Command:** `./scripts/backup-database.sh --help`

### 9. ✅ Monitoring
- [ ] Sentry dashboard active
- [ ] Error alerts configured
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (optional: Datadog)
- [ ] Slack notifications enabled

**Guide:** [docs/MONITORING_SETUP.md](./docs/MONITORING_SETUP.md)

### 10. ✅ Deployment
- [ ] Deploy backend (Railway)
- [ ] Deploy frontend (Vercel)
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] Smoke tests passing

**Guide:** [DEPLOY_RAILWAY_GUIDE.md](./docs/DEPLOY_RAILWAY_GUIDE.md)

---

## Environment Variables (Complete List)

```bash
# ===== SERVER =====
NODE_ENV=production
PORT=3001
APP_URL=https://chega-backend-prod.railway.app

# ===== DATABASE =====
DATABASE_URL=postgresql://user:pass@host:5432/chega
DB_POOL_MIN=2
DB_POOL_MAX=30
DB_IDLE_TIMEOUT_MS=30000

# ===== AUTHENTICATION =====
JWT_SECRET=your-64-byte-secret-here-xxxxxxxxxxxxxxxxxxxxxxxxxx
JWT_REFRESH_SECRET=your-refresh-secret-xxxxxxxxxxxxxxxxxxxxxxxx
JWT_EXPIRY=1h
JWT_REFRESH_EXPIRY=7d

# ===== ENCRYPTION =====
ENCRYPTION_KEY=your-encryption-key-xxxxxxxxxxxxxxxxxxxxxxxx

# ===== STRIPE =====
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXX  # or sk_test_
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_live_XXXXXXXXXXXXX

# ===== EMAIL =====
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-from-google
EMAIL_FROM=noreply@seu-dominio.com

# ===== CORS =====
CORS_ORIGIN=https://chega.vercel.app,https://seu-dominio.com

# ===== RATE LIMITING =====
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
AUTH_LIMIT_MAX_REQUESTS=10
API_LIMIT_WINDOW_MS=60000
API_LIMIT_MAX_REQUESTS=60

# ===== MONITORING =====
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_ENVIRONMENT=production

# ===== REDIS (Optional) =====
REDIS_URL=redis://default:password@redis.railway.internal:6379

# ===== SSL/TLS (Optional) =====
SSL_ENABLED=true
SSL_KEY_PATH=/etc/letsencrypt/live/domain.com/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/domain.com/fullchain.pem
```

---

## Pre-Deployment Validation

### 1. Test Build
```bash
cd backend && npm run lint && npm run test
cd frontend && npm run lint && npm run build
```

### 2. Validate Environment
```bash
./scripts/validate-production.sh
```

### 3. Test Database Connection
```bash
psql $DATABASE_URL -c "SELECT NOW();"
```

### 4. Test Email Service
```bash
curl -X POST http://localhost:3001/api/test-email
```

### 5. Test Payment System
```
Stripe dashboard → Test cards → 4242 4242 4242 4242
```

### 6. Health Checks
```bash
curl https://chega-backend.railway.app/health/full
curl https://chega-backend.railway.app/api-docs
```

---

## Go Live Checklist

Before flipping the switch:

### 24 Hours Before
- [ ] Last backup taken
- [ ] Database verified
- [ ] SSL certificate renewed
- [ ] Team notified
- [ ] Rollback plan documented

### Day Of
- [ ] All services health: green ✅
- [ ] Monitoring alerting: active
- [ ] Backup script: running
- [ ] Support contact: available
- [ ] Deployment window: scheduled

### Day After
- [ ] Error rate normal
- [ ] Performance metrics good
- [ ] Customer feedback: positive
- [ ] All features working
- [ ] No urgent issues

---

## Rollback Plan

If something goes wrong:

```bash
# 1. Stop traffic
# Disable health check OR redirect to backup

# 2. Restore database
gunzip -c backups/chega-db-latest.sql.gz | psql $DATABASE_URL

# 3. Restore backend image
# railway deploy --from previous-version

# 4. Clear cache
redis-cli FLUSHALL

# 5. Verify health
curl https://chega-backend.railway.app/health/full
```

---

## Post-Deployment (First Week)

### Daily
- [ ] Check error rate in Sentry
- [ ] Monitor API response times
- [ ] Review database performance
- [ ] Check backup completion

### Weekly
- [ ] Review analytics
- [ ] Customer feedback review
- [ ] Security audit
- [ ] Performance optimization

---

## Cost Estimation

| Service | Plan | Cost |
|---------|------|------|
| Backend (Railway) | Standard | $0.50/GB/hr (~$10-20/mo) |
| Frontend (Vercel) | Hobby | Free |
| Database (Railway) | PostgreSQL | $5/mo |
| Redis (Railway) | Standard | $2/mo |
| Sentry | Free | $0 |
| Let's Encrypt | - | Free |
| UptimeRobot | Free | $0 |
| **Total** | - | **~$20-30/month** |

---

## Monitoring Dashboard URLs

After deployment:

- Sentry Dashboard: https://sentry.io
- Railway Dashboard: https://railway.app
- Vercel Dashboard: https://vercel.com
- Stripe Dashboard: https://dashboard.stripe.com
- UptimeRobot: https://uptimerobot.com

---

## Emergency Contacts

Keep this info accessible:

| Role | Contact | On-Call |
|------|---------|---------|
| DevOps | [Your name] | Yes |
| Backend | [Your name] | Yes |
| Frontend | [Your name] | Yes |
| Database | [Your name] | Yes |

---

## Success Metrics

After 1 week, should see:

```
✅ Uptime: 99.9%+
✅ Error rate: < 0.1%
✅ Response time: < 200ms (p95)
✅ Customer satisfaction: Positive feedback
✅ Support tickets: Minimal
```

---

## Next Steps

1. ✅ Complete all 10 critical tasks
2. ✅ Run pre-deployment validation
3. ✅ Deploy to staging (if available)
4. ✅ Run smoke tests
5. ✅ Deploy to production
6. ✅ Monitor first 24 hours
7. ✅ Celebrate 🎉

---

**Questions?** Check the specific setup guides for your section.

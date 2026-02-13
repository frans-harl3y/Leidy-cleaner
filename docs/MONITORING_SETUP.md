# 🚨 Setup Monitoring & Alerts

Guia para configurar monitoring e alertas em produção.

## 1. Sentry (Error Tracking)

### Setup Sentry

1. **Crie conta** em https://sentry.io
2. **Crie novo projeto** → Node.js
3. **Copie o DSN**:
   ```bash
   SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```

4. **Configure em seu servidor**:
   ```bash
   # Railway
   railway secrets set SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   
   # Vercel (Frontend)
   vercel env add NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
   ```

### Sentry Features
- ✅ Captura exceções automaticamente
- ✅ Rastreia performance (traces)
- ✅ Source maps para debugger (local.js → local-HASH.js)
- ✅ Alertas por email/Slack
- ✅ Session replay (últimos 60 min de ação do usuário)

### Configurar Alertas no Sentry

1. Vá em **Alerts**
2. **Create Alert Rule**:
   - Evento: `When an event is first seen OR an event's frequency increases by X times`
   - Ação: `Send email to team@seu-dominio.com`

---

## 2. Railway Alerts (Infrastructure)

Se usar Railway para backend:

1. **Vá em Project → Alerts**
2. **Add Alert**:
   ```
   - CPU Usage > 80% → Email
   - Memory Usage > 90% → Email  
   - Disk Usage > 85% → Email
   - HTTP Status 5xx rate > 1% → Email
   ```

---

## 3. Uptime Monitoring (Statuspage.io / UptimeRobot)

### UptimeRobot (Gratuito)

1. Acesse https://uptimerobot.com
2. **Add Monitor**:
   - Type: HTTP(S)
   - URL: `https://seu-dominio.com/health/full`
   - Interval: 5 minutes
   - Alert: Email

Config exemplo:
```
Monitor Name: Chega API Health
URL: https://api.seu-dominio.com/health/full
Method: GET
Expected Response: 200
Timeout: 30s
Alert Contacts: alertas@seu-dominio.com
```

---

## 4. Datadog (Advanced Monitoring)

Se precisa de monitoramento mais robusto:

1. **Setup Datadog Agent**:
   ```bash
   DD_SITE=datadoghq.com \
   DD_API_KEY=seu_api_key \
   datadog-agent status
   ```

2. **Enviar Custom Metrics**:
   ```javascript
   const StatsD = require('node-dogstatsd').StatsD;
   const statsd = new StatsD();
   
   statsd.gauge('booking.processing_time', processingTime);
   statsd.increment('payment.processed');
   ```

---

## 5. Log Aggregation (Papertrail / Loggly)

### Papertrail Setup

1. Acesse https://papertrailapp.com
2. **Setup → Systems → Add system**
3. Copy config:
   ```bash
   npm install winston-papertrail
   ```

4. Configure em seu logger:
   ```javascript
   const winston = require('winston');
   const Papertrail = require('winston-papertrail').Papertrail;
   
   const winstonPapertrail = new Papertrail({
     host: 'logs.papertrailapp.com',
     port: 12345  // Seu port único
   });
   
   logger.add(winstonPapertrail);
   ```

---

## 6. Health Check Cron Job

Execute verificações de saúde automaticamente:

### Local/Docker Compose
```bash
# Adicionar ao crontab
*/5 * * * * cd /workspaces/chega && bash scripts/monitor.sh >> /tmp/chega-monitor.log 2>&1
```

### Railway/Vercel
Use GitHub Actions:

```yaml
name: Health Check

on:
  schedule:
    - cron: '*/5 * * * *'  # A cada 5 minutos

jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - name: Check API Health
        run: |
          RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://api.seu-dominio.com/health/full)
          if [ "$RESPONSE" != "200" ]; then
            echo "❌ Health check failed: HTTP $RESPONSE"
            exit 1
          fi
          echo "✅ Health check passed"
```

---

## 7. Slack Notifications

### Sentry → Slack

1. **Sentry Integrations → Slack**
2. **Authorize** seu workspace
3. **Select channel**: #alerts
4. **Test**: Envie um erro manual

### Datadog → Slack

```
@slack-notifications-chega
@slack-oncall-team

Mensagem: API error rate exceeded 5%
```

---

## 8. Alerting Thresholds

### Recomendado:

| Métrica | Threshold | Ação |
|---------|-----------|------|
| Error Rate | > 5% | Slack + Email |
| Response Time | > 1000ms (p99) | Slack |
| CPU Usage | > 80% | Email |
| Memory | > 90% | Email + Page |
| Database Connections | > 15/20 | Slack |
| Disk Usage | > 85% | Email |
| API Availability | < 99.9% | Page |

### Response Time Targets:
- p50: < 100ms
- p95: < 500ms
- p99: < 1000ms

---

## 9. Runbooks (On-Call Guides)

Crie guias para responder alertas:

### Example Runbook: High Error Rate
```
**Alert**: Error rate > 5%

**Step 1**: Check Sentry
  - https://seu-proj.sentry.io/alerts
  - Identificar padrão do erro

**Step 2**: Check Logs
  - Railway Dashboard → Logs
  - Procure por stack traces

**Step 3**: Check Database
  - SELECT count(*) FROM pg_stat_activity;
  - Se > 15 conexões → SQL issue

**Step 4**: Escalate
  - Se não encontrar causa → chamar devs
  - Postmortem depois: /docs/postmortem.md
```

---

## 10. Monitoramento Customizado

### Endpoint para Métricas

Adicione em seu `backend/src/index.js`:

```javascript
app.get('/api/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date(),
    health: {
      database: HealthCheckService.db,
      redis: HealthCheckService.redis,
      email_queue: HealthCheckService.emailQueue
    }
  });
});
```

### Chamar de Datadog/Grafana:
```
GET https://api.seu-dominio.com/api/metrics
```

---

## Checklist de Setup

- [ ] Sentry DSN configurado
- [ ] Alertas do Sentry testados
- [ ] UptimeRobot monitoring ativo
- [ ] Railway alerts configurados
- [ ] Log aggregation (Papertrail/Loggly)
- [ ] Slack integrado
- [ ] Cron job de health check rodando
- [ ] Runbooks documentados
- [ ] On-call schedule configurado
- [ ] Alertas testados (chamadas reais)

---

**Alertas bem configurados = Você dorme tranquilo 😴**

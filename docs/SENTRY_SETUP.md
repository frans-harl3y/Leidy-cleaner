# 📊 Sentry Setup Guide - Error Tracking

**Estimated time**: 15 minutes  
**Difficulty**: Very easy  
**Cost**: Free tier covers millions of events

---

## 1️⃣ Create Sentry Account

1. Go to https://sentry.io
2. Click "Get started" → Sign up with GitHub
3. Confirm email

---

## 2️⃣ Create Project

1. Dashboard → Projects → "Create Project"
2. **Platform**: Node.js (Express/Backend)
3. **Environment**: Production
4. Click "Create Project"

---

## 3️⃣ Get Your DSN (Data Source Name)

After creating project:

```
Settings → Client Keys (DSN)

# You'll see something like:
https://1234567890abcdef@sentry.io/1234567
```

This is your `SENTRY_DSN` value.

---

## 4️⃣ Configure Backend

### Update `.env`

```bash
SENTRY_DSN=https://YOUR_DSN_HERE@sentry.io/YOUR_PROJECT_ID
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1  # 10% of events
SENTRY_PROFILES_SAMPLE_RATE=0.1  # 10% profiles
```

### Verify in `backend/src/config/sentry.js`

```javascript
const SentryConfig = {
  init: (app) => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT,
      integrations: [
        Sentry.Handlers.requestHandler(),
        Sentry.Handlers.errorHandler(),
      ],
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
      profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE) || 0.1,
    });
  }
};
```

---

## 5️⃣ Capture User Context

When user logs in (`backend/src/routes/auth.js`):

```javascript
const setUserContext = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
    ip_address: "{{ ip_address }}",
  });
};

// In login endpoint:
app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // ... validation ...
  setUserContext(user);
  // ... return token ...
});
```

---

## 6️⃣ Test Sentry Integration

### Option 1: Send test event via API

```bash
curl -X POST http://localhost:3001/api/test-sentry \
  -H "Content-Type: application/json"
```

### Option 2: Manual test in code

```javascript
// Add to backend/src/routes/test.js
app.get('/api/test-sentry', (req, res) => {
  try {
    throw new Error('Test Sentry error');
  } catch (error) {
    Sentry.captureException(error);
    res.json({ status: 'Error sent to Sentry' });
  }
});
```

### Option 3: Via CLI
```bash
curl https://your-backend.railway.app/api/test-sentry
```

---

## 7️⃣ Configure Sentry Alerts

### Email Alerts

1. Sentry Dashboard → Settings → Alerts
2. Click "Create Alert Rule"
3. Configure:
   - **Condition**: When an event is first seen OR every time
   - **Filter**: All environments
   - **Action**: Send email to your@email.com

**When to alert:**
- ❌ First occurrence (too noisy)
- ✅ It's regressed (new after fix)
- ✅ Critical errors only (500s)
- ✅ More than 5 in 1 minute

### Slack Alerts (Optional)

1. Sentry → Integrations → Slack
2. Connect workspace
3. Create alert rule with action "Send to Slack"
4. Post to: #alerts or #errors

---

## 8️⃣ Dashboard Overview

After deployment, Sentry shows:

### Real-Time Feed
```
Error: TypeError: Cannot read property 'id' of undefined
  User: user@example.com
  URL: POST /api/bookings
  Timestamp: 2024-01-15 14:32:15 UTC
  Status: Resolved ✓
```

### Key Metrics
```
Events (24h):     2,341
Issues:           23 (12 new)
Affected Users:   154
Crash Rate:       0.02%
Frontend vs Backend: 45% vs 55%
```

### Filters
- Environment: production, staging, development
- Browser, Platform, Release Version
- User ID, Email, Custom tags

---

## 9️⃣ Advanced: Custom Tags & Context

Add to errors for better triaging:

```javascript
// In service methods
Sentry.captureException(error, {
  tags: {
    service: 'booking',
    operation: 'create',
    severity: 'critical',
    database: 'postgres',
  },
  contexts: {
    booking: {
      id: bookingId,
      customer_id: customerId,
      status: 'pending',
    },
    request: {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    },
  },
});
```

---

## 🔟 Integration with GitHub Issues

1. Sentry → Integrations → GitHub
2. Authorize access
3. In issue view → "Link to GitHub Issue"
4. Auto-creates issues in your repo

---

## ⚡ Ignored Errors (Already Configured)

These are NOT sent to Sentry (reduce noise):

```javascript
// From sentry.js
beforeSend(event) {
  // Ignore rate limit errors
  if (event.exception?.values?.[0]?.type === 'RateLimitError') {
    return null;
  }
  
  // Ignore 404 health checks
  if (event.request?.url?.includes('/health')) {
    return null;
  }
  
  // Ignore expected 400s
  if (event.status === 400 && !event.exception) {
    return null;
  }
  
  return event;
}
```

---

## Pricing & Quota

| Tier | Events/Month | Cost |
|------|------------|------|
| Free | 10,000 | $0 |
| Team | 100,000 | $29 |
| Pro | 1,000,000 | $299 |
| Custom | Unlimited | Custom |

**Tip**: Start on free, upgrade if > 10k errors/month

---

## Next Steps

1. ✅ Create Sentry account
2. ✅ Set DSN in `.env`
3. ✅ Deploy backend
4. ✅ Test error capture
5. ✅ Configure email alerts
6. ✅ Add Slack integration
7. ✅ Monitor dashboard daily

---

## Troubleshooting

### Errors not appearing in Sentry?

```bash
# Check DSN is set
echo $SENTRY_DSN

# Verify format: https://KEY@sentry.io/PROJECT_ID
# Missing PROJECT_ID? Re-check in Sentry Settings

# Test endpoint manually
curl -X POST http://localhost:3001/api/test-sentry
```

### "Invalid DSN" error?

```bash
# Correct format:
https://KEY1@KEY2.ingest.sentry.io/PROJECT_ID

# Wrong format (old):
https://KEY@sentry.io/PROJECT_ID

# Get correct DSN from: Settings → Client Keys (DSN)
```

### Too many alerts?

```bash
# Tune alert rules:
1. Higher threshold (not every error)
2. Only critical severity
3. Exclude known services
4. Hours-only (business hours)
```

### Rate limiting showing as errors?

```bash
# Already filtered in sentry.js
# Verify beforeSend function is active:

if (event.status === 429) {
  return null;  // Don't send
}
```

---

**Questions?** Check Sentry docs: https://docs.sentry.io/product/

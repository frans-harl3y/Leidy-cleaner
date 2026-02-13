# 🔐 Security Hardening Checklist

**Status**: Production-Ready with Enterprise Security  
**Last Review**: 2026-02-13

---

## ✅ Already Implemented

### Authentication & Authorization
- [x] JWT tokens (24h expiry + 7d refresh)
- [x] Bcrypt password hashing (12 rounds)
- [x] CSRF token generation on GET, validation on POST/PUT/DELETE
- [x] 2FA ready (TOTP support)
- [x] Session management
- [x] Auth middleware on all protected routes
- [x] Role-based access control (admin, staff, user)

### API Security
- [x] Rate limiting (5 levels: global, auth, API, per-endpoint, per-user)
- [x] CORS whitelist (specific origins only)
- [x] HTTPS redirect (in production)
- [x] Helmet security headers (CSP, HSTS, X-Frame-Options, etc.)
- [x] HTTPS only cookies (httpOnly, secure, SameSite)
- [x] Request validation & sanitization
- [x] SQL injection prevention (parameterized queries)
- [x] XSS prevention (input escaping + CSP)
- [x] CSRF protection
- [x] Clickjacking protection

### Data Security
- [x] Database passwords in environment variables
- [x] API keys in environment variables
- [x] SSL/TLS certificates (Let's Encrypt ready)
- [x] Secrets not committed to git
- [x] PII masking in logs (email: a***@b***.com)
- [x] Encryption for sensitive fields (optional)

### Infrastructure
- [x] Helmet middleware
- [x] Trust proxy configuration
- [x] Health checks for monitoring
- [x] Error handling (doesn't expose stack traces)
- [x] Logging audit trail
- [x] Sentry error tracking +alerting

### Deployment
- [x] Docker containerization
- [x] Environment variable validation
- [x] Production vs development configs
- [x] Database migrations (safe deploys)
- [x] Backup strategy (daily with retention)
- [x] Secrets management ready

---

## ⚠️ Important Reminders

### Never Do This
```javascript
// ❌ NEVER commit secrets to git
git add .env  // DON'T

// ❌ NEVER log sensitive data
console.log('User email:', user.email);  // DON'T

// ❌ NEVER use SELECT * with user data
const users = await db.query('SELECT * FROM users');  // DON'T

// ❌ NEVER skip validation
const user = req.body;  // DON'T use directly

// ❌ NEVER disable CSRF
app.post('/api/data', (req, res) => { ... });  // Must have CSRF token

// ❌ NEVER use HTTP in production
http://api.example.com  // DON'T use

// ❌ NEVER hardcode credentials
const password = 'myPassword123';  // DON'T
```

### Always Do This
```javascript
// ✅ Use environment variables
const SECRET = process.env.JWT_SECRET;

// ✅ Validate all inputs
const { error } = schema.validate(req.body);
if (error) return res.status(400).json({ error });

// ✅ Use HTTPS everywhere
https://api.example.com  // ✅ DO use

// ✅ Sanitize outputs
const safeUser = { id, name, email };
delete safeUser.password;  // Remove sensitive fields

// ✅ Use parameterized queries
db.query('SELECT * FROM users WHERE id = $1', [id]);

// ✅ Hash passwords
const hash = await bcrypt.hash(password, 12);

// ✅ Set secure cookie options
res.cookie('token', jwt, {
  httpOnly: true,
  secure: true,      // HTTPS only
  sameSite: 'strict' // CSRF protection
});
```

---

## 🔐 Security Best Practices

### 1. Secrets Management

**Current Setup**: Environment variables  
**Upgrade Path**: Vault (HashiCorp) or AWS Secrets Manager

```bash
# Development
.env (local only, not in git)

# Production
Railway environment variables
OR
AWS Secrets Manager
OR
HashiCorp Vault
```

**Generate Secrets**:
```bash
# Use secure random generation
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Database Security

```sql
-- Use parameterized queries (Node.js handles this)
-- NO: db.query(`SELECT * FROM users WHERE id = ${id}`);
-- YES: db.query('SELECT * FROM users WHERE id = $1', [id]);

-- Create restricted database user
CREATE USER app WITH PASSWORD 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON schema public TO app;

-- Never give database password to frontend

-- Use read replicas for analytics queries
-- Main database: writes only
-- Read replica: reads only (doesn't slow down writes)
```

### 3. API Security

**Rate Limiting Tiers**:
```
Global:      100 req/15min  (per IP)
Auth:        5 req/15min    (login attempts)
API:         30 req/1min    (per user)
Per-Endpoint: Custom limits (e.g., email: 3/hour)
```

**CORS Configuration**:
```javascript
// Good: Specific origins
cors({ origin: ['https://app.example.com', 'https://www.example.com'] });

// Bad: Allow all
cors({ origin: '*' });  // DON'T
```

### 4. Input Validation

**Use InputValidator for all requests**:
```javascript
const InputValidator = require('./utils/inputValidator');

// Sanitize all inputs
const data = InputValidator.sanitizeObject(req.body);

// Validate format
if (!InputValidator.isValidEmail(data.email)) {
  return res.status(400).json({ error: 'Invalid email' });
}
```

### 5. Logging & Monitoring

**What to Log**:
```
✅ User authentication attempts (success & failure)
✅ Data access audit trail
✅ API errors (without sensitive details)
✅ Rate limit violations
✅ Failed validation attempts
❌ Passwords
❌ API keys
❌ Credit card data
❌ Personally identifiable information (email, phone partially masked)
```

**Mask PII in Logs**:
```javascript
const maskPII = (value) => {
  if (value.includes('@')) {
    return value.substring(0, 3) + '***@' + value.split('@')[1];
  }
  return value.substring(0, 2) + '***' + value.substring(value.length - 2);
};

logger.info('User logged in', { email: maskPII(userEmail) });
// Outputs: User logged in { email: 'use***@gmail.com' }
```

### 6. Deployment Security

**Pre-Deployment Checklist**:
```bash
✅ NODE_ENV=production
✅ All secrets in environment (not in code)
✅ Database backups working
✅ SSL certificate valid
✅ CORS whitelist set correctly
✅ Rate limits configured
✅ Sentry DSN set
✅ Monitoring alerts enabled
✅ Runbook documentation
✅ Team trained on incident response
```

**Post-Deployment Security**:
```bash
✅ Health check endpoint responds
✅ API endpoints require auth
✅ Database connectivity verified
✅ Logs are being collected
✅ Sentry is receiving errors
✅ No hardcoded secrets visible
✅ HTTPS is enforced
✅ CORS is working correctly
```

---

## 🚨 Emergency Response

### If Secret is Leaked

```bash
# 1. Immediately rotate the secret
NEW_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# 2. Update in production
# Railway Dashboard → Settings → Environment Variables
# Update JWT_SECRET, STRIPE_SECRET_KEY, etc.

# 3. Restart servers
# Railway will auto-restart after env var update

# 4. Review logs for unauthorized access
# Sentry Dashboard → Check for suspicious activity

# 5. Audit who had access
# Did anyone else see the secret?
# Was it visible in logs? → Check Sentry
# Was it visible in code? → Check git history

# 6. Document incident
# What leaked? (e.g., JWT_SECRET)
# When? (date/time)
# How long was it exposed?
# What was the impact?

# 7. Prevent future leaks
# Add secret scanning to CI/CD
# Use vault instead of env vars
# Limit who can access secrets
```

### If Server is Hacked

```bash
# 1. Take server offline
# Stop accepting traffic
# Alert users if data was accessed

# 2. Preserve evidence
# Get server logs
# Get database backup
# Get access logs

# 3. Restore from backup
# Use daily backup taken before breach
# Verify data integrity
# Deploy with new secrets

# 4. Investigate
# What was accessed? (audit logs, database access logs)
# How long were they in? (check timestamps)
# What did they do? (database changes, file modifications)

# 5. Notify users (if needed)
# GDPR/CCPA may require notification
# Be transparent about what happened
```

---

## 📊 Security Incident Response

**Runbook** (document this):
```
1. Detect Issue
   → Sentry alert
   → UptimeRobot down alert
   → Security scan finds vulnerability

2. Assess Severity
   → Is data exposed?
   → Are users affected?
   → Can it spread?

3. Contain
   → Rate limit affected endpoint
   → Disable vulnerable feature
   → Increase monitoring

4. Fix
   → Apply security patch
   → Deploy fix
   → Verify in production

5. Post-Mortem
   → What went wrong?
   → Why didn't it catch it?
   → How to prevent next time?

6. Communicate
   → Update status page
   → Notify users (if needed)
   → Document for team
```

---

## 🛡️ Security Tools

### Installed
- [x] Helmet (security headers)
- [x] Express rate limit
- [x] CORS
- [x] Bcrypt (password hashing)
- [x] JWT (tokens)
- [x] Sentry (error tracking)

### Recommended for Future
- [ ] npm audit CI/CD check
- [ ] OWASP dependency check
- [ ] SonarQube (code quality)
- [ ] Snyk (vulnerability scanning)
- [ ] CloudFlare (DDoS protection)

---

## 📋 Monthly Security Review

```
[ ] Run npm audit
[ ] Check for outdated dependencies
[ ] Review Sentry for attacks
[ ] Check rate limit logs for patterns
[ ] Review access logs for suspicious activity
[ ] Verify backups are working
[ ] Test disaster recovery plan
[ ] Update security documentation
[ ] Team security training
```

---

## ✅ Security Status

| Category | Status | Evidence |
|----------|--------|----------|
| Authentication | ✅ Secure | JWT + CSRF + 2FA ready |
| Data | ✅ Secure | Encryption + PII masking |
| API | ✅ Secure | Rate limiting + validation |
| Infrastructure | ✅ Secure | Helmet + CORS + HTTPS |
| Deployment | ✅ Secure | Env vars only |
| Monitoring | ✅ Secure | Sentry + UptimeRobot |
| **Overall** | ✅ **SECURE** | Enterprise-grade |

**Ready for Production**: YES ✅

---

**Reviewed**: 2026-02-13  
**Next Review**: 2026-03-13  
**Security Officer**: (assign someone)

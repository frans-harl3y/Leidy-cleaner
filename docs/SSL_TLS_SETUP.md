# 🔒 SSL/TLS Setup Guide - HTTPS for Production

**Estimated time**: 15 minutes  
**Difficulty**: Intermediate  
**Cost**: Free with Let's Encrypt

---

## 1️⃣ Understanding SSL/TLS

### What is SSL/TLS?

- **SSL** (deprecated): Old encryption protocol
- **TLS**: Modern secure connection standard
- **HTTPS**: HTTP over TLS
- **Certificate**: Proves your domain identity

### Why needed?

```
❌ Without HTTPS:
  POST /api/auth/login
  Password sent in plain text
  → Attacker can intercept

✅ With HTTPS:
  POST https://api.example.com/auth/login
  Password encrypted end-to-end
  → Safe from interception
```

---

## 2️⃣ Get Free Certificate (Let's Encrypt)

### Option A: Railway (Automatic)

Railway auto-generates HTTPS certificates:

```
https://chega-backend.railway.app
✅ Auto-renewed
✅ No configuration needed
```

### Option B: Vercel (Frontend)

Vercel auto-generates HTTPS:

```
https://chega.vercel.app
✅ Auto-renewed
✅ No configuration needed
```

### Option C: Manual with Certbot

For self-hosted or manual setup:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate for your domain
sudo certbot certonly --standalone \
  -d chega-app.com \
  -d www.chega-app.com

# Generates: /etc/letsencrypt/live/chega-app.com/
```

---

## 3️⃣ Configure HTTPS in Backend

### Express.js with HTTPS

Create `backend/src/https-server.js`:

```javascript
const https = require('https');
const fs = require('fs');
const app = require('./index');

// Read certificate files
const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8'),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8'),
};

// Create HTTPS server
https.createServer(options, app).listen(process.env.PORT, () => {
  console.log(`✅ Server running on https://localhost:${process.env.PORT}`);
});
```

### Add to `backend/.env`:

```bash
# HTTPS/TLS Configuration
SSL_ENABLED=true
SSL_KEY_PATH=/etc/letsencrypt/live/chega-app.com/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/chega-app.com/fullchain.pem

# Or for development
SSL_ENABLED=false
```

### Update `package.json` script:

```json
{
  "scripts": {
    "start:https": "node backend/src/https-server.js"
  }
}
```

---

## 4️⃣ Force HTTPS Redirect

### Add middleware to `backend/src/index.js`:

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.protocol !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
  }
  next();
});

// Trust proxy (Railway/Vercel set X-Forwarded-Proto)
app.set('trust proxy', 1);
```

---

## 5️⃣ Verify SSL Configuration

### Test your HTTPS setup:

```bash
# Test with curl
curl -I https://chega-app.com
# Output:
# HTTP/2 200
# strict-transport-security: max-age=31536000

# Check certificate details
openssl s_client -connect chega-app.com:443 -showcerts

# Verify certificate chain
openssl x509 -in /path/to/cert.pem -text -noout
```

### Online Certificate Checker

1. Go to https://www.ssllabs.com/ssltest/
2. Enter your domain: chega-app.com
3. Check rating (A or higher = good)

---

## 6️⃣ Configure HSTS (HTTP Strict Transport Security)

### Add to `backend/src/index.js`:

```javascript
const helmet = require('helmet');

app.use(helmet({
  hsts: {
    maxAge: 31536000,  // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
}));
```

This header tells browsers:
- Always use HTTPS (never HTTP)
- For 1 year
- Include subdomains

---

## 7️⃣ Configure CSP (Content Security Policy)

### Add security headers:

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.API_URL],
    },
  },
}));
```

---

## 8️⃣ Enable HTTP/2

### Nginx configuration example:

```nginx
server {
    listen 443 ssl http2;
    server_name chega-app.com;

    ssl_certificate /etc/letsencrypt/live/chega-app.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chega-app.com/privkey.pem;

    # Modern configuration
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
}
```

---

## 9️⃣ Auto-Renewal with Certbot

### Setup auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Check renewal is scheduled
sudo systemctl list-timers --all | grep certbot
```

### Cron alternative:

```bash
# Add to crontab
0 3 * * * certbot renew --quiet && systemctl reload nginx
```

---

## 🔟 Configuration Checklist

| Item | Status | Notes |
|------|--------|-------|
| SSL Certificate | ✅ | Let's Encrypt valid |
| HTTPS Redirect | ✅ | HTTP → HTTPS 301 |
| HSTS Header | ✅ | 1-year max-age |
| CSP Header | ✅ | Security policy set |
| TLS 1.3 | ✅ | Modern encryption |
| Certificate Chain | ✅ | Full chain included |
| Auto-renewal | ✅ | Certbot enabled |
| SSL Labs | A+ | Good rating |

---

## Troubleshooting

### "Certificate not found"

```bash
# Check path exists
ls /etc/letsencrypt/live/chega-app.com/

# Set correct permissions (root needs to read)
sudo chmod 644 /etc/letsencrypt/live/chega-app.com/fullchain.pem
sudo chmod 644 /etc/letsencrypt/live/chega-app.com/privkey.pem
```

### "Mixed Content Warning"

```
Your HTTPS page loads HTTP resources
❌ <img src="http://cdn.example.com/image.jpg">
✅ <img src="https://cdn.example.com/image.jpg">

Solution: Use HTTPS for all resources
```

### "Certificate expires"

```bash
# Check expiration
sudo certbot certificates

# Renew immediately
sudo certbot renew

# Check renewal schedule
sudo systemctl status certbot.timer
```

### "Domain not resolving"

```bash
# Verify DNS points to server
dig chega-app.com

# Should show your server IP
```

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Auto-renew certificates** (don't rely on manual renewal)
3. **Use TLS 1.3** (not older versions)
4. **Implement HSTS** (force HTTPS)
5. **Monitor expiration** calendar.google.com/reminders
6. **Test with SSL Labs** (at least A)
7. **Set CSP headers** (prevent XSS)
8. **Enable HTTP/2** (performance)

---

## Performance Impact

HTTPS is NOT slower anymore:

| Protocol | Latency | Throughput |
|----------|---------|-----------|
| HTTP/1.1 | +5ms | Similar |
| HTTPS/1.1 | ±0ms | Similar |
| HTTP/2 | - | 25% faster |
| HTTPS/2 | ±2ms | 30% faster |

---

## Certificate Pinning (Optional)

For mobile apps, pin certificate:

```javascript
// Prevent MITM attacks
const ssl_pinning = {
  hosts: ['chega-app.com'],
  certificates: ['sha256/AAAAAAAAAAAAAAAA...'],
};
```

---

## Next Steps

1. ✅ Deploy on Railway/Vercel (auto HTTPS)
2. ✅ Verify SSL Labs rating
3. ✅ Enable HSTS
4. ✅ Configure CSP
5. ✅ Monitor certificate expiration
6. ✅ Test on mobile devices

---

**Resources:**
- Let's Encrypt: https://letsencrypt.org
- SSL Labs: https://www.ssllabs.com/
- Mozilla SSL Configuration: https://ssl-config.mozilla.org/
- OWASP HSTS: https://owasp.org/www-project-secure-headers/

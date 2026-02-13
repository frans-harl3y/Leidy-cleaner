# 📧 Email Setup Guide - Gmail App Passwords

**Estimated time**: 10 minutes  
**Difficulty**: Easy  
**Recommended for**: Notifications, password resets, booking confirmations

---

## 1️⃣ Enable Gmail 2-Factor Authentication

### Prerequisites
- Google account
- SMS-capable phone

### Steps

1. Go to https://myaccount.google.com
2. Left sidebar → Security
3. Under "Signing in to Google" → **2-Step Verification**
4. Click "Get started"
5. Choose verification method (Phone SMS recommended)
6. Follow Google's prompts

**Leave this page open - we need it next**

---

## 2️⃣ Generate App Password

### After 2FA is enabled

1. Same page (Security → https://myaccount.google.com/security)
2. Under "Your Google Account" → **App passwords**
3. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or any option)
4. Click **Generate**

```
⚠️  Google will show a 16-character password
COPY THIS IMMEDIATELY!
(It only shows once)

Example:
scxz qwer tyui opas
```

---

## 3️⃣ Add to Backend Configuration

### Update `backend/.env`:

```bash
# ===== EMAIL CONFIGURATION =====
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=scxz qwer tyui opas  # App Password (with spaces)
EMAIL_FROM=noreply@seu-dominio.com
EMAIL_PROVIDER=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false  # Use TLS, not SSL
```

### Example `.env` entry:
```bash
EMAIL_USER=chega.app.notificacoes@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
EMAIL_FROM=noreply@chegaapp.com
```

---

## 4️⃣ Create Email Service

### Create `backend/src/services/emailService.js`:

```javascript
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // false for TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection on startup
    this.verify();
  }

  async verify() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service connected');
    } catch (err) {
      console.error('❌ Email service error:', err.message);
    }
  }

  // ===== SEND BOOKING CONFIRMATION =====
  async sendBookingConfirmation(email, booking) {
    const html = `
      <h1>Booking Confirmation</h1>
      <p>Hi ${booking.customer_name},</p>
      <p>Your booking has been confirmed:</p>
      <ul>
        <li><strong>Service:</strong> ${booking.service}</li>
        <li><strong>Date:</strong> ${new Date(booking.scheduled_at).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${new Date(booking.scheduled_at).toLocaleTimeString()}</li>
        <li><strong>Reference:</strong> #${booking.id}</li>
      </ul>
      <p>
        <a href="https://chega.app/bookings/${booking.id}" 
           style="background:blue;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">
          View Booking
        </a>
      </p>
      <p>Thanks for choosing Chega!</p>
    `;

    return this.send({
      to: email,
      subject: `Booking Confirmed - #${booking.id}`,
      html,
    });
  }

  // ===== SEND PAYMENT RECEIPT =====
  async sendPaymentReceipt(email, payment) {
    const html = `
      <h1>Payment Receipt</h1>
      <p>Payment of <strong>R$ ${(payment.amount_cents / 100).toFixed(2)}</strong> received.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr style="border-bottom:1px solid #ddd;">
          <td><strong>Date:</strong></td>
          <td>${new Date(payment.created_at).toLocaleString()}</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td><strong>Reference:</strong></td>
          <td>#${payment.id}</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td><strong>Status:</strong></td>
          <td>${payment.status.toUpperCase()}</td>
        </tr>
      </table>
    `;

    return this.send({
      to: email,
      subject: 'Payment Receipt',
      html,
    });
  }

  // ===== SEND PASSWORD RESET =====
  async sendPasswordReset(email, resetToken) {
    const resetUrl = `https://chega.app/reset-password?token=${resetToken}`;
    const html = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <p>
        <a href="${resetUrl}" 
           style="background:blue;color:white;padding:10px 20px;text-decoration:none;border-radius:5px">
          Reset Password
        </a>
      </p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `;

    return this.send({
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }

  // ===== SEND NOTIFICATION =====
  async sendNotification(email, title, message) {
    const html = `
      <h2>${title}</h2>
      <p>${message}</p>
      <p style="color:#999;font-size:12px;">Chega App Notifications</p>
    `;

    return this.send({
      to: email,
      subject: title,
      html,
    });
  }

  // ===== GENERIC SEND =====
  async send({ to, subject, html, attachments = [] }) {
    try {
      const result = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        attachments,
      });

      console.log(`✅ Email sent to ${to}`);
      return result;

    } catch (error) {
      console.error(`❌ Email error to ${to}:`, error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
```

---

## 5️⃣ Integrate into Routes

### Example: Booking confirmation email

#### Update `backend/src/routes/bookings.js`:

```javascript
const emailService = require('../services/emailService');

router.post('/create', authenticateToken, async (req, res) => {
  try {
    // ... validate and create booking ...
    const booking = await createBooking(req.body);

    // Send confirmation email
    await emailService.sendBookingConfirmation(
      req.user.email,
      {
        id: booking.id,
        customer_name: req.user.name,
        service: booking.service_type,
        scheduled_at: booking.scheduled_at,
      }
    );

    res.json({ success: true, booking });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
```

---

## 6️⃣ Test Email

### Option 1: Test endpoint

Create `backend/src/routes/test.js`:

```javascript
router.post('/api/send-test-email', authenticateToken, async (req, res) => {
  try {
    const result = await emailService.send({
      to: req.user.email,
      subject: '🧪 Test Email from Chega',
      html: `
        <h1>Test Email</h1>
        <p>If you received this, email is working!</p>
        <p>User: ${req.user.email}</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    });

    res.json({ success: true, message: 'Test email sent' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Option 2: Test via terminal

```bash
# Test email connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((err, success) => {
  console.log(err ? '❌ ' + err.message : '✅ Email connected');
  process.exit(0);
});
"
```

---

## 7️⃣ Advanced: SendGrid (Alternative)

For higher volume or enterprise:

### 1. Create SendGrid account
```
https://sendgrid.com → Sign up → Free tier
```

### 2. Create API Key
```
Settings → API Keys → Create API Key
Copy the key (shown only once)
```

### 3. Update `.env`
```bash
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
```

### 4. Update EmailService
```javascript
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    if (process.env.EMAIL_PROVIDER === 'sendgrid') {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
  }

  async send({ to, subject, html }) {
    if (process.env.EMAIL_PROVIDER === 'sendgrid') {
      return sgMail.send({
        to,
        from: process.env.EMAIL_FROM,
        subject,
        html,
      });
    }
    // ... existing nodemailer code ...
  }
}
```

---

## 8️⃣ Email Templates

### Password Reset Email
```html
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:20px;background:#f5f5f5;border-radius:5px;">
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="[RESET_URL]" 
         style="display:inline-block;padding:12px 24px;background:#007bff;color:white;text-decoration:none;border-radius:5px;font-weight:bold;">
        Reset Password
      </a>
      <p style="margin-top:20px;font-size:12px;color:#999;">
        This link expires in 1 hour.
      </p>
    </td>
  </tr>
</table>
```

### Booking Confirmation Email
```html
<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td style="padding:20px;background:#f5f5f5;border-radius:5px;">
      <h2>✅ Booking Confirmed</h2>
      <p>Thank you! Your booking is confirmed.</p>
      <table style="margin:20px 0;width:100%;border-collapse:collapse;">
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px;font-weight:bold;">Service:</td>
          <td style="padding:10px;">[SERVICE_NAME]</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px;font-weight:bold;">Date & Time:</td>
          <td style="padding:10px;">[SCHEDULED_AT]</td>
        </tr>
        <tr style="border-bottom:1px solid #ddd;">
          <td style="padding:10px;font-weight:bold;">Location:</td>
          <td style="padding:10px;">[ADDRESS]</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## 9️⃣ Troubleshooting

### "Username and password not accepted"

```bash
# Common issue: Wrong password format
# Use 16-character APP PASSWORD, not account password!

# Correct:
EMAIL_PASS=scxz qwer tyui opas  ✅

# Wrong (account password):
EMAIL_PASS=MyAccountPassword123  ❌
```

### "Email not sending silently"

```bash
# Check 2FA is enabled
# https://myaccount.google.com/security

# Check less secure apps is OFF
# https://myaccount.google.com/lesssecureapps  (should not exist if 2FA on)

# Create NEW app password (if multiple attempts)
```

### "SMTP connection timeout"

```bash
# Check network firewall
# Port 587 must be open

# Test connection:
nc -zv smtp.gmail.com 587
```

### "HTML not rendering in Gmail"

```bash
# Gmail clips some styles by default
# Keep emails simple, test before sending

# Use: https://litmus.com or https://www.emailonacid.com for testing
```

---

## Configuration Summary

| Setting | Value |
|---------|-------|
| SMTP Host | smtp.gmail.com |
| SMTP Port | 587 |
| Security | TLS (not SSL) |
| Auth | Email + App Password |
| From Address | Your Gmail or custom domain |

---

## Next Steps

1. ✅ Enable 2FA on Google account
2. ✅ Generate App Password
3. ✅ Add to `.env`
4. ✅ Test email service
5. ✅ Integrate into booking flows
6. ✅ Monitor email quota

---

**Common Email Limits:**
- Gmail: 500/day
- SendGrid free: 400/day
- Upgrade for higher volumes

**Next**: Setup [JWT Secret Regeneration](./JWT_SETUP.md)

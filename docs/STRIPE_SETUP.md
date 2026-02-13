# 💳 Stripe Setup Guide - Payments

**Estimated time**: 25 minutes  
**Difficulty**: Intermediate  
**Test mode first**: Yes

---

## 1️⃣ Create Stripe Account

1. Go to https://stripe.com
2. Click "Start now" → Sign up
3. Verify email
4. Choose account type: **Business**

---

## 2️⃣ Get API Keys

### Test Environment (Development)
```
Dashboard → Developers → API Keys

Publishable Key:    pk_test_XXXXX...
Secret Key:         sk_test_XXXXX...

Keep these tabs open for next step!
```

### Live Environment (Production)
```
After going live (not needed yet)
Dashboard → Developers → API Keys (toggle "View test data")

These are different from test keys
Only use AFTER business verification
```

---

## 3️⃣ Configure Backend

### Add to `backend/.env`:

```bash
# ===== STRIPE TEST KEYS (Development) =====
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_test_XXXXXXXXXXXXXX

# ===== STRIPE SETTINGS =====
STRIPE_ENVIRONMENT=test  # or 'live' in production
STRIPE_API_VERSION=2024-01-01  # Latest API version
```

### For Webhook Secret
```
Skip for now, we'll set it up after webhook configuration
Use a placeholder: whsec_test_placeholder
```

---

## 4️⃣ Create Payment Endpoint

### Create `backend/src/routes/payments.js`:

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Middleware: Auth check
const authenticateToken = require('../middleware/auth');

// ===== CREATE PAYMENT INTENT =====
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { amount_cents, description, metadata } = req.body;
    
    // Validate amount
    if (!amount_cents || amount_cents < 50) {
      return res.status(400).json({ error: 'Amount must be at least $0.50' });
    }
    
    // Create intent
    const intent = await stripe.paymentIntents.create({
      amount: amount_cents,
      currency: 'brl', // Brazilian Real
      description: description,
      metadata: {
        user_id: req.user.id,
        booking_id: metadata?.booking_id,
        ...metadata
      },
      statement_descriptor: 'CHEGA BOOKING', // Shows on bank statement
    });
    
    res.json({
      clientSecret: intent.client_secret,
      intentId: intent.id,
    });
    
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== CONFIRM PAYMENT =====
router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { payment_method_id, intent_id } = req.body;
    
    // Confirm with payment method
    const result = await stripe.paymentIntents.confirm(intent_id, {
      payment_method: payment_method_id,
    });
    
    if (result.status === 'succeeded') {
      // Payment successful - update booking status
      // Call your booking service here
      res.json({ success: true, intent: result });
    } else if (result.status === 'requires_action') {
      // 3D Secure or other additional auth required
      res.json({
        success: false,
        requiresAction: true,
        clientSecret: result.client_secret,
      });
    } else {
      res.status(400).json({ error: 'Payment failed: ' + result.status });
    }
    
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== RETRIEVE PAYMENT =====
router.get('/:intent_id', authenticateToken, async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(req.params.intent_id);
    
    // Verify user owns this payment
    if (intent.metadata.user_id !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.json(intent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== REFUND =====
router.post('/:intent_id/refund', authenticateToken, async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(req.params.intent_id);
    
    // Verify ownership
    if (intent.metadata.user_id !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Only refund if already charged
    if (intent.charges.data.length === 0) {
      return res.status(400).json({ error: 'Nothing to refund' });
    }
    
    const refund = await stripe.refunds.create({
      charge: intent.charges.data[0].id,
      reason: req.body.reason || 'requested_by_customer',
    });
    
    res.json({ refund });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 5️⃣ Setup Frontend Payment Form

### Create `frontend/app/components/StripePaymentForm.tsx`:

```typescript
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function StripePaymentForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create payment intent
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: amount * 100,
          description: 'Booking payment',
        }),
      });

      const { clientSecret } = await res.json();

      // 2. Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name', // Get from form
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/bookings'; // Redirect after 2s
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 border rounded">
      <h2 className="text-2xl font-bold mb-4">Pay R$ {amount.toFixed(2)}</h2>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />

      {error && <div className="text-red-500 mt-4">{error}</div>}
      {success && <div className="text-green-500 mt-4">✅ Payment received!</div>}

      <button
        disabled={!stripe || loading || success}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay R$ ${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
```

### Create `frontend/app/components/StripeProvider.tsx`:

```typescript
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

export default function StripeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

---

## 6️⃣ Test with Test Cards

### Valid Test Cards

| Card Number | Success | CVC | Date |
|-------------|---------|-----|------|
| 4242 4242 4242 4242 | ✅ | Any 3 digits | Any future date |
| 4000 0000 0000 0002 | ❌ (Declined) | Any 3 digits | Any future date |
| 4000 0025 0000 3155 | ✅ | Any 3 digits | Any future date |

### Test 3D Secure

| Card | Result |
|------|--------|
| 4000 0027 6000 3184 | Requires auth |
| 4000 0082 6000 3184 | Always fails |

---

## 7️⃣ Setup Webhooks

### Webhook Configuration

1. Stripe Dashboard → Developers → Webhooks
2. Click "+ Add endpoint"
3. **Endpoint URL**: `https://your-backend.railway.app/api/webhooks/stripe`
4. **Events**: Select:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

5. Copy **Signing Secret** → Add to `.env` as `STRIPE_WEBHOOK_SECRET`

### Create Webhook Handler

`backend/src/routes/webhooks.js`:

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Stripe webhook signature verification
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ Payment succeeded:', event.data.object.id);
      // Update booking status to PAID
      // Update user balance
      break;

    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object.id);
      // Send user notification
      break;

    case 'charge.refunded':
      console.log('💰 Refund processed:', event.data.object.id);
      // Update payment status
      break;

    default:
      console.log('Unhandled event type:', event.type);
  }

  res.status(200).json({ received: true });
});

module.exports = router;
```

---

## 8️⃣ Test Webhook Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# Or from: https://github.com/stripe/stripe-cli

# Login
stripe login

# Forward events to local server
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# In another terminal, trigger test event
stripe trigger payment_intent.succeeded

# You should see event logged in your backend
```

---

## 9️⃣ Frontend Integration

### Create Payment Page

`frontend/app/checkout/page.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import StripePaymentForm from '@/app/components/StripePaymentForm';
import StripeProvider from '@/app/components/StripeProvider';

export default function CheckoutPage() {
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    // Get booking amount from URL params or state
    const params = new URLSearchParams(window.location.search);
    setAmount(parseFloat(params.get('amount') || '0'));
  }, []);

  return (
    <StripeProvider>
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto">
          <StripePaymentForm amount={amount} />
        </div>
      </div>
    </StripeProvider>
  );
}
```

---

## 🔟 Configuration for Production

### Migrate to Live Keys

1. Complete Stripe verification
2. Update `backend/.env`:

```bash
# Change to live keys
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_live_XXXXX
STRIPE_ENVIRONMENT=live
```

3. No code changes needed - SDK auto-uses correct environment

---

## Troubleshooting

### "Invalid API Key"
```bash
# Check key format
echo $STRIPE_SECRET_KEY
# Should start with: sk_test_ or sk_live_

# Copy from dashboard, not from old emails
# Keys in docs/emails may be outdated
```

### "Webhook Signature Verification Failed"
```bash
# Webhook secret mismatch
# Get correct one from: Stripe → Developers → Webhooks
# Not the same as API Secret Key!
```

### "Card declined in test mode"
```bash
# Use test card: 4242 4242 4242 4242
# CVC: Any 3 digits (e.g., 123)
# Date: Any future date (e.g., 12/25)

# For all possible test cards: https://stripe.com/docs/testing
```

### "Amount too small"
```bash
# Minimum charge in USD: $0.50
# Minimum charge in BRL: R$ 1.00

// In code:
if (amount_cents < 100) { // 100 cents = $1.00
  throw new Error('Minimum amount must be $1.00');
}
```

### "CORS Error accessing Stripe"
```bash
# Stripe.js loads from CDN
# Check CORS_ORIGIN includes your frontend domain
CORS_ORIGIN=https://frontend.railway.app,https://localhost:3000

# Verify in backend/src/index.js
```

---

## Next Steps

1. ✅ Create Stripe account
2. ✅ Get test keys
3. ✅ Add to `.env`
4. ✅ Test with test cards
5. ✅ Setup webhooks
6. ✅ Go live with live keys

**Questions?** See: https://stripe.com/docs/payments/quickstart

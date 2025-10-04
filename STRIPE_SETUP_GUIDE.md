# Stripe Setup Guide - Complete Walkthrough

## 🎯 Overview

This guide will walk you through setting up Stripe for the ticketing system, including test mode setup, webhook configuration, and production deployment.

---

## ✅ Step 1: Create Stripe Account

1. **Sign Up:**
   - Go to: https://dashboard.stripe.com/register
   - Enter your email and create a password
   - Verify your email address

2. **Complete Business Profile (Optional for Testing):**
   - You can skip this for now and use test mode
   - Required before going live with real payments

---

## ✅ Step 2: Get API Keys (Test Mode)

1. **Navigate to API Keys:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - You should see two keys:
     * **Publishable key** (starts with `pk_test_`)
     * **Secret key** (starts with `sk_test_`)

2. **Copy Keys to Environment Variables:**

Create or update `event-management-platform/.env.local`:

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Will add webhook secret in Step 3
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Service Role Key (for webhooks to bypass RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find Supabase Service Role Key:**
1. Go to: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/settings/api
2. Copy the "service_role" key (⚠️ Keep this secret!)

---

## ✅ Step 3: Set Up Webhooks

### Option A: Production Webhook (After Deployment)

1. **Deploy to Vercel:**
   ```bash
   cd event-management-platform
   vercel --prod
   ```
   Note your production URL (e.g., `https://wecon-masawaaat.vercel.app`)

2. **Create Webhook Endpoint:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Description: "Event Management Platform - Ticket Payments"

3. **Select Events to Listen:**
   Click "Select events" and choose:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `charge.refunded`

4. **Add Endpoint:**
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)
   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

5. **Redeploy with Webhook Secret:**
   ```bash
   # Add STRIPE_WEBHOOK_SECRET to Vercel environment variables
   vercel env add STRIPE_WEBHOOK_SECRET
   # Paste the whsec_... value
   
   # Redeploy
   vercel --prod
   ```

### Option B: Local Development Webhook

1. **Install Stripe CLI:**
   
   **macOS:**
   ```bash
   brew install stripe/stripe-cli/stripe
   ```
   
   **Windows:**
   ```bash
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe
   ```
   
   **Linux:**
   ```bash
   wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
   tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
   sudo mv stripe /usr/local/bin
   ```

2. **Login to Stripe:**
   ```bash
   stripe login
   ```
   This will open a browser to authorize the CLI.

3. **Forward Webhooks to Local Server:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   
   You'll see output like:
   ```
   > Ready! Your webhook signing secret is whsec_1234... (^C to quit)
   ```

4. **Copy Webhook Secret:**
   - Copy the `whsec_...` value
   - Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

5. **Keep the Terminal Open:**
   - Leave this terminal running while developing
   - You'll see webhook events logged here

6. **Test Webhook:**
   ```bash
   # In another terminal
   stripe trigger checkout.session.completed
   ```

---

## ✅ Step 4: Test the Integration

### 1. Start Development Server

```bash
cd event-management-platform
npm run dev
```

### 2. Create Test Ticket Types

Run this SQL in Supabase SQL Editor:

```sql
-- First, get an event ID
SELECT id, name FROM em_events LIMIT 1;

-- Then insert ticket types (replace YOUR_EVENT_ID)
INSERT INTO em_ticket_types (
  event_id, name, type, description, price, currency,
  total_quantity, available_quantity, min_purchase, max_purchase,
  features, is_active, is_visible
)
VALUES
  (
    'YOUR_EVENT_ID',
    'Early Bird',
    'early_bird',
    'Get your tickets early and save!',
    79.99,
    'USD',
    100,
    100,
    1,
    5,
    '["Early access", "Welcome gift", "Priority seating"]'::jsonb,
    true,
    true
  ),
  (
    'YOUR_EVENT_ID',
    'VIP Pass',
    'vip',
    'Premium experience',
    299.99,
    'USD',
    50,
    50,
    1,
    2,
    '["VIP lounge", "Meet & greet", "Premium seating", "Networking dinner"]'::jsonb,
    true,
    true
  );
```

### 3. Test Purchase Flow

1. **Navigate to Event:**
   - Go to: `http://localhost:3000/events/YOUR_EVENT_ID`
   - Or wherever you display ticket selection

2. **Select Ticket:**
   - Choose a ticket type
   - Adjust quantity
   - Click "Proceed to Checkout"

3. **Complete Stripe Checkout:**
   - You'll be redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Expiry: `12/34` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)
   - Click "Pay"

4. **Verify Success:**
   - You should be redirected to `/dashboard/tickets?success=true`
   - Check webhook terminal - you should see events logged
   - Verify tickets were created in database:
   ```sql
   SELECT * FROM em_tickets ORDER BY created_at DESC LIMIT 5;
   ```

---

## ✅ Step 5: Test Discount Codes

1. **Create Test Discount Code:**
```sql
INSERT INTO em_discount_codes (
  event_id, code, description, discount_type, discount_value,
  max_uses, max_uses_per_user, is_active
)
VALUES
  (
    'YOUR_EVENT_ID',
    'WELCOME20',
    '20% off for new attendees',
    'percentage',
    20,
    100,
    1,
    true
  );
```

2. **Test in Checkout:**
   - Select a ticket
   - Enter code: `WELCOME20`
   - Click "Apply"
   - Verify discount is applied
   - Complete checkout

---

## 🧪 Stripe Test Cards

### Successful Payments

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Visa - Succeeds |
| 5555 5555 5555 4444 | Mastercard - Succeeds |
| 3782 822463 10005 | American Express - Succeeds |

### Failed Payments

| Card Number | Error |
|-------------|-------|
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0000 0000 0002 | Generic decline |
| 4000 0000 0000 9987 | Lost card |
| 4000 0000 0000 9979 | Stolen card |

### Special Cases

| Card Number | Behavior |
|-------------|----------|
| 4000 0025 0000 3155 | Requires 3D Secure authentication |
| 4000 0000 0000 0341 | Charge succeeds, dispute created |

**For all cards:**
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

---

## 🔍 Debugging Webhooks

### View Webhook Logs in Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your webhook endpoint
3. Click "Events" tab
4. See all received events and their status

### Common Webhook Issues

**Issue: Webhook returns 401 Unauthorized**
- **Cause:** Missing or invalid `SUPABASE_SERVICE_ROLE_KEY`
- **Fix:** Verify the service role key is correct in environment variables

**Issue: Webhook returns 400 Bad Request**
- **Cause:** Invalid webhook signature
- **Fix:** Verify `STRIPE_WEBHOOK_SECRET` matches the endpoint's signing secret

**Issue: Tickets not created after payment**
- **Cause:** Error in webhook handler
- **Fix:** Check server logs and Stripe webhook logs for error details

**Issue: Webhook not receiving events locally**
- **Cause:** Stripe CLI not running
- **Fix:** Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Test Webhook Manually

```bash
# Trigger a test event
stripe trigger checkout.session.completed

# Or send a specific event
stripe events resend evt_1234567890
```

---

## 🚀 Going to Production

### 1. Activate Stripe Account

1. Go to: https://dashboard.stripe.com/account/onboarding
2. Complete business verification
3. Add bank account for payouts
4. Submit for review

### 2. Get Production API Keys

1. Go to: https://dashboard.stripe.com/apikeys (note: no "/test")
2. Copy production keys:
   - `pk_live_...` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `sk_live_...` → `STRIPE_SECRET_KEY`

### 3. Create Production Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-production-domain.com/api/webhooks/stripe`
3. Select same events as test mode
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

### 4. Update Environment Variables in Vercel

```bash
# Update production environment variables
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production

# Redeploy
vercel --prod
```

### 5. Test Production Payment

⚠️ **Use a real card for testing, but immediately refund:**

1. Make a small test purchase ($1)
2. Verify webhook receives event
3. Verify tickets are created
4. Refund the payment in Stripe Dashboard

---

## 📊 Monitoring

### Stripe Dashboard

Monitor your payments:
- **Payments:** https://dashboard.stripe.com/test/payments
- **Customers:** https://dashboard.stripe.com/test/customers
- **Webhooks:** https://dashboard.stripe.com/test/webhooks
- **Logs:** https://dashboard.stripe.com/test/logs

### Key Metrics to Watch

- **Successful payments:** Should match ticket count
- **Failed payments:** Investigate reasons
- **Webhook delivery:** Should be 100% successful
- **Refunds:** Track and investigate

---

## ✅ Final Checklist

- [ ] Stripe account created
- [ ] Test API keys added to `.env.local`
- [ ] Webhook endpoint created
- [ ] Webhook secret added to environment
- [ ] Stripe CLI installed (for local dev)
- [ ] Test purchase completed successfully
- [ ] Webhook received and processed
- [ ] Tickets generated in database
- [ ] QR codes display correctly
- [ ] Discount codes work
- [ ] Ready for production (when needed)

---

## 📞 Support

**Stripe Documentation:**
- Checkout: https://stripe.com/docs/payments/checkout
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

**Stripe Support:**
- Email: support@stripe.com
- Chat: Available in dashboard

---

**Setup Status:** Ready for testing  
**Next Step:** Test complete purchase flow with test cards


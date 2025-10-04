# Phase 1, Feature 2: Advanced Ticketing System

## ✅ Implementation Complete

This document covers the implementation of the advanced ticketing system with Stripe integration, QR code validation, discount codes, and seat selection.

---

## 📋 Features Implemented

### 1. Database Schema
- ✅ Created `em_ticket_types` table with pricing and availability
- ✅ Created `em_discount_codes` table for promotional codes
- ✅ Created `em_discount_code_usage` tracking table
- ✅ Created `em_seats` table for workshop seat selection
- ✅ Extended `em_orders` table with payment fields
- ✅ Extended `em_tickets` table with QR code fields
- ✅ Implemented RLS policies for security
- ✅ Created validation functions and triggers

### 2. API Endpoints
- ✅ `/api/tickets/validate` - POST: Validate QR code, PUT: Check-in ticket
- ✅ `/api/discount/validate` - Validate discount codes
- ✅ `/api/checkout/create` - Create Stripe checkout session
- ✅ `/api/webhooks/stripe` - Handle Stripe payment webhooks

### 3. Frontend Components
- ✅ Ticket selection with pricing and availability
- ✅ Discount code validation UI
- ✅ Quantity selector with limits
- ✅ My Tickets page with QR codes
- ✅ Ticket download functionality
- ✅ Check-in status display

### 4. Payment Integration
- ✅ Stripe Checkout integration
- ✅ Webhook handler for payment confirmation
- ✅ Automatic ticket generation
- ✅ Order tracking and status updates

---

## 🗄️ Database Schema

### New Tables

#### 1. em_ticket_types
```sql
CREATE TABLE em_ticket_types (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES em_events(id),
  name VARCHAR(100),
  type VARCHAR(50), -- 'early_bird', 'vip', 'sponsor', 'student', 'group', 'general'
  description TEXT,
  price DECIMAL(10, 2),
  currency VARCHAR(3),
  discount_percentage DECIMAL(5, 2),
  discount_amount DECIMAL(10, 2),
  total_quantity INTEGER,
  available_quantity INTEGER,
  min_purchase INTEGER,
  max_purchase INTEGER,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  features JSONB,
  includes_sessions BOOLEAN,
  includes_workshops BOOLEAN,
  includes_meals BOOLEAN,
  is_active BOOLEAN,
  is_visible BOOLEAN,
  sort_order INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 2. em_discount_codes
```sql
CREATE TABLE em_discount_codes (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES em_events(id),
  code VARCHAR(50) UNIQUE,
  description TEXT,
  discount_type VARCHAR(20), -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10, 2),
  currency VARCHAR(3),
  max_uses INTEGER,
  current_uses INTEGER,
  max_uses_per_user INTEGER,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  min_purchase_amount DECIMAL(10, 2),
  applicable_ticket_types JSONB,
  is_active BOOLEAN,
  created_by UUID REFERENCES em_profiles(id),
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 3. em_seats
```sql
CREATE TABLE em_seats (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES em_events(id),
  session_id UUID,
  section VARCHAR(50),
  row VARCHAR(10),
  seat_number VARCHAR(10),
  seat_type VARCHAR(50), -- 'standard', 'accessible', 'vip', 'reserved'
  price_modifier DECIMAL(10, 2),
  status VARCHAR(20), -- 'available', 'reserved', 'occupied', 'blocked'
  reserved_by UUID REFERENCES em_profiles(id),
  reserved_at TIMESTAMPTZ,
  reservation_expires_at TIMESTAMPTZ,
  ticket_id UUID REFERENCES em_tickets(id),
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Extended Tables

**em_orders:**
- ticket_type_id, discount_code_id
- subtotal, discount_amount, tax_amount, total_amount
- payment_method, payment_status
- stripe_payment_intent_id, stripe_session_id

**em_tickets:**
- ticket_type_id, seat_id
- price_paid, currency
- qr_code_data, qr_code_expires_at
- check_in_location, check_in_by

---

## 📁 Files Created

### Database
- `supabase/migrations/002_advanced_ticketing_system.sql`

### Types
- `src/types/ticketing.ts`

### API Routes
- `src/app/api/tickets/validate/route.ts`
- `src/app/api/discount/validate/route.ts`
- `src/app/api/checkout/create/route.ts`
- `src/app/api/webhooks/stripe/route.ts`

### Components
- `src/components/tickets/ticket-selection.tsx`
- `src/components/tickets/my-tickets.tsx`

### Pages
- `src/app/dashboard/tickets/page.tsx`

---

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
cd event-management-platform

# Install Stripe SDK
npm install stripe @stripe/stripe-js

# Install QR code library
npm install qrcode
npm install --save-dev @types/qrcode

# Install date utilities (if not already installed)
npm install date-fns
```

### Step 2: Configure Environment Variables

Add to `.env.local`:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase Service Role Key (for webhooks)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Database Migration

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/sql
2. Copy contents of `supabase/migrations/002_advanced_ticketing_system.sql`
3. Execute the SQL
4. Verify success message

**Via CLI:**
```bash
supabase db push
```

### Step 4: Set Up Stripe

1. **Create Stripe Account:**
   - Go to: https://dashboard.stripe.com/register
   - Complete registration

2. **Get API Keys:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → `STRIPE_SECRET_KEY`

3. **Set Up Webhook:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events:
     * `checkout.session.completed`
     * `payment_intent.succeeded`
     * `payment_intent.payment_failed`
     * `charge.refunded`
   - Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET`

4. **For Local Development:**
   ```bash
   # Install Stripe CLI
   stripe login
   
   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   
   # Copy the webhook signing secret to .env.local
   ```

### Step 5: Create Sample Ticket Types

Run this SQL to create sample ticket types:

```sql
INSERT INTO em_ticket_types (event_id, name, type, description, price, currency, total_quantity, available_quantity, min_purchase, max_purchase, features, is_active, is_visible)
VALUES
  (
    'YOUR_EVENT_ID_HERE',
    'Early Bird',
    'early_bird',
    'Get your tickets early and save 20%!',
    79.99,
    'USD',
    100,
    100,
    1,
    5,
    '["Early access to venue", "Welcome gift", "Priority seating"]'::jsonb,
    true,
    true
  ),
  (
    'YOUR_EVENT_ID_HERE',
    'VIP Pass',
    'vip',
    'Premium experience with exclusive perks',
    299.99,
    'USD',
    50,
    50,
    1,
    2,
    '["VIP lounge access", "Meet & greet", "Premium seating", "Networking dinner", "Swag bag"]'::jsonb,
    true,
    true
  ),
  (
    'YOUR_EVENT_ID_HERE',
    'General Admission',
    'general',
    'Standard event access',
    99.99,
    'USD',
    500,
    500,
    1,
    10,
    '["Event access", "Digital materials"]'::jsonb,
    true,
    true
  );
```

### Step 6: Create Sample Discount Codes

```sql
INSERT INTO em_discount_codes (event_id, code, description, discount_type, discount_value, max_uses, max_uses_per_user, is_active)
VALUES
  (
    'YOUR_EVENT_ID_HERE',
    'WELCOME20',
    '20% off for new attendees',
    'percentage',
    20,
    100,
    1,
    true
  ),
  (
    'YOUR_EVENT_ID_HERE',
    'SAVE50',
    '$50 off your purchase',
    'fixed_amount',
    50,
    50,
    1,
    true
  );
```

---

## 🧪 Testing Guide

### Test 1: View Ticket Types
1. Navigate to an event page
2. Click "Get Tickets" or similar button
3. **Expected:** See list of available ticket types with pricing

### Test 2: Select Ticket and Adjust Quantity
1. Click on a ticket type
2. Use +/- buttons to adjust quantity
3. **Expected:** Quantity respects min/max limits, price updates

### Test 3: Apply Discount Code
1. Enter discount code (e.g., "WELCOME20")
2. Click "Apply"
3. **Expected:** Discount applied, total price reduced

### Test 4: Complete Checkout (Test Mode)
1. Click "Proceed to Checkout"
2. Use Stripe test card: `4242 4242 4242 4242`
3. Expiry: Any future date, CVC: Any 3 digits
4. Complete payment
5. **Expected:** Redirected to tickets page with success message

### Test 5: View Purchased Tickets
1. Go to `/dashboard/tickets`
2. **Expected:** See purchased tickets with QR codes

### Test 6: Download Ticket
1. Click "Download Ticket" button
2. **Expected:** QR code image downloads

### Test 7: Validate Ticket (Admin/Speaker Only)
1. Login as admin or speaker
2. Use ticket validation endpoint:
```bash
curl -X POST https://your-domain.com/api/tickets/validate \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "TKT-...", "event_id": "..."}'
```
3. **Expected:** Returns ticket validation status

### Test 8: Check-in Ticket (Admin/Speaker Only)
```bash
curl -X PUT https://your-domain.com/api/tickets/validate \
  -H "Content-Type: application/json" \
  -d '{"ticket_id": "...", "location": "Main Entrance"}'
```
3. **Expected:** Ticket marked as checked in, points awarded

---

## 🔧 Stripe Test Cards

Use these test cards in Stripe test mode:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0000 0000 0002 | Declined (generic decline) |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

**For all cards:**
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

---

## 📊 API Documentation

### POST /api/checkout/create

Creates a Stripe checkout session for ticket purchase.

**Request:**
```json
{
  "event_id": "uuid",
  "ticket_type_id": "uuid",
  "quantity": 2,
  "discount_code": "WELCOME20",
  "seat_ids": ["uuid1", "uuid2"]
}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.stripe.com/...",
  "session_id": "cs_test_...",
  "order_id": "uuid"
}
```

### POST /api/discount/validate

Validates a discount code.

**Request:**
```json
{
  "code": "WELCOME20",
  "ticket_type_id": "uuid",
  "subtotal": 199.98
}
```

**Response:**
```json
{
  "is_valid": true,
  "discount_id": "uuid",
  "discount_amount": 39.99,
  "error_message": null
}
```

### POST /api/tickets/validate

Validates a ticket QR code.

**Request:**
```json
{
  "qr_code": "TKT-1234567890-ABC",
  "event_id": "uuid",
  "location": "Main Entrance"
}
```

**Response:**
```json
{
  "is_valid": true,
  "ticket": { ... },
  "can_check_in": true,
  "error_message": null
}
```

### PUT /api/tickets/validate

Checks in a validated ticket.

**Request:**
```json
{
  "ticket_id": "uuid",
  "location": "Main Entrance"
}
```

**Response:**
```json
{
  "success": true,
  "ticket": { ... }
}
```

---

## 🐛 Troubleshooting

### Issue: Stripe webhook not receiving events
**Solution:**
1. Verify webhook URL is correct
2. Check webhook signing secret matches
3. Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Issue: Tickets not generated after payment
**Solution:**
1. Check Stripe webhook logs in dashboard
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Check server logs for errors

### Issue: Discount code not applying
**Solution:**
1. Verify code is active and not expired
2. Check usage limits haven't been reached
3. Ensure minimum purchase amount is met

### Issue: QR code not displaying
**Solution:**
1. Verify `qrcode` package is installed
2. Check ticket has `qr_code` field populated
3. Check browser console for errors

---

## ✅ Verification Checklist

- [ ] Database migration executed successfully
- [ ] All 4 new tables created
- [ ] Stripe API keys configured
- [ ] Stripe webhook endpoint created
- [ ] Sample ticket types created
- [ ] Sample discount codes created
- [ ] Ticket selection page works
- [ ] Discount code validation works
- [ ] Checkout redirects to Stripe
- [ ] Test payment completes successfully
- [ ] Tickets generated after payment
- [ ] QR codes display correctly
- [ ] Ticket download works
- [ ] Ticket validation API works
- [ ] Check-in updates ticket status
- [ ] Points awarded on check-in

---

## 📝 Next Steps

After confirming this feature works:
1. Test complete purchase flow with test cards
2. Verify webhook receives payment events
3. Confirm tickets are generated correctly
4. Test QR code validation and check-in
5. Ready to proceed to **Phase 1, Feature 3: Multi-Track Agenda & Scheduling**

---

**Status:** ✅ **READY FOR TESTING**  
**Last Updated:** 2025-10-03


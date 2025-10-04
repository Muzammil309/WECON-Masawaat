-- =====================================================
-- Migration: Advanced Ticketing System
-- Description: Ticket types, discount codes, seat selection,
--              and enhanced QR validation
-- Version: 002
-- Date: 2025-10-03
-- =====================================================

-- =====================================================
-- 1. CREATE TICKET TYPES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_ticket_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'early_bird', 'vip', 'sponsor', 'student', 'group', 'general'
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Discount settings
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Availability
  total_quantity INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL,
  min_purchase INTEGER DEFAULT 1,
  max_purchase INTEGER DEFAULT 10,
  
  -- Validity period
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  
  -- Features
  features JSONB DEFAULT '[]'::jsonb, -- ['Early access', 'VIP lounge', 'Networking dinner']
  includes_sessions BOOLEAN DEFAULT true,
  includes_workshops BOOLEAN DEFAULT false,
  includes_meals BOOLEAN DEFAULT false,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_quantity CHECK (available_quantity >= 0),
  CONSTRAINT valid_price CHECK (price >= 0),
  CONSTRAINT valid_discount_percentage CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON em_ticket_types (event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_type ON em_ticket_types (type);
CREATE INDEX IF NOT EXISTS idx_ticket_types_active ON em_ticket_types (is_active, is_visible);
CREATE INDEX IF NOT EXISTS idx_ticket_types_validity ON em_ticket_types (valid_from, valid_until);

-- =====================================================
-- 2. CREATE DISCOUNT CODES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  
  -- Discount settings
  discount_type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Usage limits
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  max_uses_per_user INTEGER DEFAULT 1,
  
  -- Validity
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  
  -- Restrictions
  min_purchase_amount DECIMAL(10, 2),
  applicable_ticket_types JSONB DEFAULT '[]'::jsonb, -- Array of ticket_type_ids
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_by UUID REFERENCES em_profiles(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_discount_value CHECK (discount_value > 0),
  CONSTRAINT valid_max_uses CHECK (max_uses IS NULL OR max_uses > 0),
  CONSTRAINT valid_uses CHECK (current_uses <= COALESCE(max_uses, current_uses))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON em_discount_codes (code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_event_id ON em_discount_codes (event_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON em_discount_codes (is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_validity ON em_discount_codes (valid_from, valid_until);

-- =====================================================
-- 3. CREATE DISCOUNT CODE USAGE TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS em_discount_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id UUID NOT NULL REFERENCES em_discount_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES em_profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES em_orders(id) ON DELETE SET NULL,
  discount_amount DECIMAL(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(discount_code_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_discount_usage_code ON em_discount_code_usage (discount_code_id);
CREATE INDEX IF NOT EXISTS idx_discount_usage_user ON em_discount_code_usage (user_id);

-- =====================================================
-- 4. CREATE SEATS TABLE (for workshops/sessions)
-- =====================================================

CREATE TABLE IF NOT EXISTS em_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  session_id UUID, -- Will reference em_sessions when created in Feature 3
  
  -- Seat location
  section VARCHAR(50) NOT NULL,
  row VARCHAR(10) NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  
  -- Seat details
  seat_type VARCHAR(50) DEFAULT 'standard', -- 'standard', 'accessible', 'vip', 'reserved'
  price_modifier DECIMAL(10, 2) DEFAULT 0, -- Additional cost for premium seats
  
  -- Status
  status VARCHAR(20) DEFAULT 'available', -- 'available', 'reserved', 'occupied', 'blocked'
  
  -- Reservation
  reserved_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL,
  reserved_at TIMESTAMPTZ,
  reservation_expires_at TIMESTAMPTZ,
  ticket_id UUID REFERENCES em_tickets(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(event_id, session_id, section, row, seat_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_seats_event_id ON em_seats (event_id);
CREATE INDEX IF NOT EXISTS idx_seats_session_id ON em_seats (session_id);
CREATE INDEX IF NOT EXISTS idx_seats_status ON em_seats (status);
CREATE INDEX IF NOT EXISTS idx_seats_reserved_by ON em_seats (reserved_by);
CREATE INDEX IF NOT EXISTS idx_seats_location ON em_seats (section, row, seat_number);

-- =====================================================
-- 5. EXTEND EXISTING TABLES
-- =====================================================

-- Extend em_orders table
ALTER TABLE em_orders
ADD COLUMN IF NOT EXISTS ticket_type_id UUID REFERENCES em_ticket_types(id),
ADD COLUMN IF NOT EXISTS discount_code_id UUID REFERENCES em_discount_codes(id),
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Extend em_tickets table
ALTER TABLE em_tickets
ADD COLUMN IF NOT EXISTS ticket_type_id UUID REFERENCES em_ticket_types(id),
ADD COLUMN IF NOT EXISTS seat_id UUID REFERENCES em_seats(id),
ADD COLUMN IF NOT EXISTS price_paid DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS qr_code_data TEXT,
ADD COLUMN IF NOT EXISTS qr_code_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS check_in_location VARCHAR(255),
ADD COLUMN IF NOT EXISTS check_in_by UUID REFERENCES em_profiles(id),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON em_orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent ON em_orders (stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_code ON em_tickets (qr_code);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_type ON em_tickets (ticket_type_id);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE em_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_discount_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_seats ENABLE ROW LEVEL SECURITY;

-- em_ticket_types policies
CREATE POLICY "Anyone can view active ticket types"
  ON em_ticket_types FOR SELECT
  USING (is_active = true AND is_visible = true);

CREATE POLICY "Admins can manage ticket types"
  ON em_ticket_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- em_discount_codes policies
CREATE POLICY "Users can view active discount codes"
  ON em_discount_codes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage discount codes"
  ON em_discount_codes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- em_discount_code_usage policies
CREATE POLICY "Users can view their own discount usage"
  ON em_discount_code_usage FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert discount usage"
  ON em_discount_code_usage FOR INSERT
  WITH CHECK (true);

-- em_seats policies
CREATE POLICY "Anyone can view available seats"
  ON em_seats FOR SELECT
  USING (status = 'available' OR reserved_by = auth.uid());

CREATE POLICY "Users can reserve seats"
  ON em_seats FOR UPDATE
  USING (status = 'available' OR reserved_by = auth.uid())
  WITH CHECK (reserved_by = auth.uid());

CREATE POLICY "Admins can manage all seats"
  ON em_seats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 7. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to generate unique QR code data
CREATE OR REPLACE FUNCTION generate_qr_code_data(p_ticket_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_qr_data TEXT;
BEGIN
  v_qr_data := encode(
    digest(
      p_ticket_id::text || NOW()::text || random()::text,
      'sha256'
    ),
    'base64'
  );
  RETURN v_qr_data;
END;
$$ LANGUAGE plpgsql;

-- Function to validate discount code
CREATE OR REPLACE FUNCTION validate_discount_code(
  p_code VARCHAR,
  p_user_id UUID,
  p_ticket_type_id UUID,
  p_subtotal DECIMAL
)
RETURNS TABLE (
  is_valid BOOLEAN,
  discount_id UUID,
  discount_amount DECIMAL,
  error_message TEXT
) AS $$
DECLARE
  v_discount em_discount_codes%ROWTYPE;
  v_user_usage_count INTEGER;
  v_calculated_discount DECIMAL;
BEGIN
  -- Get discount code
  SELECT * INTO v_discount
  FROM em_discount_codes
  WHERE code = p_code AND is_active = true;

  -- Check if code exists
  IF v_discount.id IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Invalid discount code';
    RETURN;
  END IF;

  -- Check validity period
  IF v_discount.valid_from IS NOT NULL AND NOW() < v_discount.valid_from THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Discount code not yet valid';
    RETURN;
  END IF;

  IF v_discount.valid_until IS NOT NULL AND NOW() > v_discount.valid_until THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Discount code expired';
    RETURN;
  END IF;

  -- Check max uses
  IF v_discount.max_uses IS NOT NULL AND v_discount.current_uses >= v_discount.max_uses THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Discount code usage limit reached';
    RETURN;
  END IF;

  -- Check user usage
  SELECT COUNT(*) INTO v_user_usage_count
  FROM em_discount_code_usage
  WHERE discount_code_id = v_discount.id AND user_id = p_user_id;

  IF v_user_usage_count >= v_discount.max_uses_per_user THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'You have already used this code';
    RETURN;
  END IF;

  -- Check minimum purchase amount
  IF v_discount.min_purchase_amount IS NOT NULL AND p_subtotal < v_discount.min_purchase_amount THEN
    RETURN QUERY SELECT false, NULL::UUID, 0::DECIMAL, 'Minimum purchase amount not met';
    RETURN;
  END IF;

  -- Calculate discount
  IF v_discount.discount_type = 'percentage' THEN
    v_calculated_discount := p_subtotal * (v_discount.discount_value / 100);
  ELSE
    v_calculated_discount := v_discount.discount_value;
  END IF;

  -- Ensure discount doesn't exceed subtotal
  v_calculated_discount := LEAST(v_calculated_discount, p_subtotal);

  RETURN QUERY SELECT true, v_discount.id, v_calculated_discount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update ticket_types available_quantity
CREATE OR REPLACE FUNCTION update_ticket_type_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE em_ticket_types
    SET available_quantity = available_quantity - 1
    WHERE id = NEW.ticket_type_id AND available_quantity > 0;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE em_ticket_types
    SET available_quantity = available_quantity + 1
    WHERE id = OLD.ticket_type_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_ticket_quantity ON em_tickets;
CREATE TRIGGER trigger_update_ticket_quantity
  AFTER INSERT OR DELETE ON em_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_type_quantity();

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT ON em_ticket_types TO authenticated;
GRANT SELECT ON em_discount_codes TO authenticated;
GRANT SELECT, INSERT ON em_discount_code_usage TO authenticated;
GRANT SELECT, UPDATE ON em_seats TO authenticated;

-- =====================================================
-- END OF MIGRATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 002 completed successfully!';
  RAISE NOTICE 'Tables created: em_ticket_types, em_discount_codes, em_discount_code_usage, em_seats';
  RAISE NOTICE 'Extended tables: em_orders, em_tickets';
  RAISE NOTICE 'Functions created: generate_qr_code_data, validate_discount_code';
  RAISE NOTICE 'Next step: Create Stripe webhook handler and ticket purchase API';
END $$;


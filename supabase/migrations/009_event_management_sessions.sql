-- =====================================================
-- EVENT MANAGEMENT SESSIONS MIGRATION
-- =====================================================
-- This migration creates tables for comprehensive event management
-- including conference sessions, learning labs, roundtables, skill clinics,
-- startup stories, exhibitors, and food vendors.
--
-- Author: WECON Platform Team
-- Date: 2025-01-06
-- =====================================================

-- =====================================================
-- CREATE TRIGGER FUNCTION FOR AUTO-UPDATING updated_at
-- =====================================================
-- This function automatically updates the updated_at timestamp
-- whenever a row is modified in any table that uses it

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 1. CONFERENCE SESSIONS TABLE
-- =====================================================
-- Stores keynote speeches, panel discussions, and individual presentations

CREATE TABLE IF NOT EXISTS em_conference_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  session_type VARCHAR(100) NOT NULL, -- 'keynote', 'panel', 'presentation'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'happening_now', 'completed', 'cancelled', 'pre_conference'
  speaker_ids JSONB DEFAULT '[]'::jsonb, -- Array of speaker UUIDs
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_session_type CHECK (session_type IN ('keynote', 'panel', 'presentation')),
  CONSTRAINT valid_status CHECK (status IN ('upcoming', 'happening_now', 'completed', 'cancelled', 'pre_conference'))
);

-- Indexes for performance
CREATE INDEX idx_conference_sessions_event_id ON em_conference_sessions(event_id);
CREATE INDEX idx_conference_sessions_start_time ON em_conference_sessions(start_time);
CREATE INDEX idx_conference_sessions_status ON em_conference_sessions(status);
CREATE INDEX idx_conference_sessions_session_type ON em_conference_sessions(session_type);

-- Updated_at trigger
CREATE TRIGGER update_conference_sessions_updated_at
  BEFORE UPDATE ON em_conference_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. LEARNING LABS TABLE
-- =====================================================
-- Stores workshop and hands-on learning sessions

CREATE TABLE IF NOT EXISTS em_learning_labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  instructor_ids JSONB DEFAULT '[]'::jsonb, -- Array of instructor UUIDs
  max_capacity INTEGER NOT NULL DEFAULT 30,
  registered_count INTEGER DEFAULT 0,
  registration_status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'full', 'waitlist'
  prerequisites TEXT,
  materials_needed TEXT,
  difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_lab_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_lab_status CHECK (status IN ('upcoming', 'happening_now', 'completed', 'cancelled', 'pre_conference')),
  CONSTRAINT valid_registration_status CHECK (registration_status IN ('open', 'closed', 'full', 'waitlist')),
  CONSTRAINT valid_difficulty CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced'))
);

-- Indexes
CREATE INDEX idx_learning_labs_event_id ON em_learning_labs(event_id);
CREATE INDEX idx_learning_labs_start_time ON em_learning_labs(start_time);
CREATE INDEX idx_learning_labs_status ON em_learning_labs(status);
CREATE INDEX idx_learning_labs_registration_status ON em_learning_labs(registration_status);

-- Updated_at trigger
CREATE TRIGGER update_learning_labs_updated_at
  BEFORE UPDATE ON em_learning_labs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. ROUNDTABLES TABLE
-- =====================================================
-- Stores roundtable discussion sessions

CREATE TABLE IF NOT EXISTS em_roundtables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  topic VARCHAR(500),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  moderator_ids JSONB DEFAULT '[]'::jsonb, -- Array of moderator UUIDs
  max_participants INTEGER DEFAULT 12,
  current_participants INTEGER DEFAULT 0,
  formation_status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'forming', 'ready', 'in_progress', 'completed'
  discussion_format VARCHAR(100), -- 'open', 'structured', 'fishbowl'
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_roundtable_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_roundtable_status CHECK (status IN ('upcoming', 'happening_now', 'completed', 'cancelled', 'pre_conference')),
  CONSTRAINT valid_formation_status CHECK (formation_status IN ('planning', 'forming', 'ready', 'in_progress', 'completed'))
);

-- Indexes
CREATE INDEX idx_roundtables_event_id ON em_roundtables(event_id);
CREATE INDEX idx_roundtables_start_time ON em_roundtables(start_time);
CREATE INDEX idx_roundtables_status ON em_roundtables(status);
CREATE INDEX idx_roundtables_formation_status ON em_roundtables(formation_status);

-- Updated_at trigger
CREATE TRIGGER update_roundtables_updated_at
  BEFORE UPDATE ON em_roundtables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. SKILL CLINICS TABLE
-- =====================================================
-- Stores skill training and clinic sessions

CREATE TABLE IF NOT EXISTS em_skill_clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  skill_category VARCHAR(255), -- 'technical', 'business', 'soft_skills', 'leadership'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  trainer_ids JSONB DEFAULT '[]'::jsonb, -- Array of trainer UUIDs
  max_participants INTEGER DEFAULT 20,
  registered_count INTEGER DEFAULT 0,
  orientation_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'scheduled', 'completed'
  certification_offered BOOLEAN DEFAULT false,
  hands_on_practice BOOLEAN DEFAULT true,
  equipment_needed TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_clinic_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_clinic_status CHECK (status IN ('upcoming', 'happening_now', 'completed', 'cancelled', 'pre_conference')),
  CONSTRAINT valid_orientation_status CHECK (orientation_status IN ('pending', 'scheduled', 'completed'))
);

-- Indexes
CREATE INDEX idx_skill_clinics_event_id ON em_skill_clinics(event_id);
CREATE INDEX idx_skill_clinics_start_time ON em_skill_clinics(start_time);
CREATE INDEX idx_skill_clinics_status ON em_skill_clinics(status);
CREATE INDEX idx_skill_clinics_skill_category ON em_skill_clinics(skill_category);

-- Updated_at trigger
CREATE TRIGGER update_skill_clinics_updated_at
  BEFORE UPDATE ON em_skill_clinics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. STARTUP STORIES TABLE
-- =====================================================
-- Stores startup pitch and story sessions

CREATE TABLE IF NOT EXISTS em_startup_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  startup_name VARCHAR(500) NOT NULL,
  founder_name VARCHAR(255),
  description TEXT,
  pitch_duration INTEGER DEFAULT 10, -- Duration in minutes
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming',
  industry VARCHAR(255),
  funding_stage VARCHAR(100), -- 'pre_seed', 'seed', 'series_a', 'series_b', etc.
  registration_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'declined'
  confirmation_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  website_url VARCHAR(500),
  pitch_deck_url VARCHAR(500),
  demo_video_url VARCHAR(500),
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_startup_time_range CHECK (end_time > start_time),
  CONSTRAINT valid_startup_status CHECK (status IN ('upcoming', 'happening_now', 'completed', 'cancelled', 'pre_conference')),
  CONSTRAINT valid_startup_registration CHECK (registration_status IN ('pending', 'confirmed', 'declined')),
  CONSTRAINT valid_startup_confirmation CHECK (confirmation_status IN ('pending', 'confirmed', 'cancelled'))
);

-- Indexes
CREATE INDEX idx_startup_stories_event_id ON em_startup_stories(event_id);
CREATE INDEX idx_startup_stories_start_time ON em_startup_stories(start_time);
CREATE INDEX idx_startup_stories_status ON em_startup_stories(status);
CREATE INDEX idx_startup_stories_industry ON em_startup_stories(industry);

-- Updated_at trigger
CREATE TRIGGER update_startup_stories_updated_at
  BEFORE UPDATE ON em_startup_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. EXHIBITORS TABLE
-- =====================================================
-- Stores exhibiting companies with tier information

CREATE TABLE IF NOT EXISTS em_exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  company_name VARCHAR(500) NOT NULL,
  tier VARCHAR(50) NOT NULL, -- 'diamond', 'platinum', 'gold', 'silver', 'bronze'
  description TEXT,
  booth_number VARCHAR(50),
  booth_size VARCHAR(50), -- 'small', 'medium', 'large', 'premium'
  industry VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  products_services TEXT,
  special_offers TEXT,
  social_media JSONB DEFAULT '{}'::jsonb, -- {linkedin, twitter, facebook, instagram}
  booth_staff_count INTEGER DEFAULT 1,
  setup_requirements TEXT,
  status VARCHAR(50) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled'
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_exhibitor_tier CHECK (tier IN ('diamond', 'platinum', 'gold', 'silver', 'bronze')),
  CONSTRAINT valid_exhibitor_status CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  CONSTRAINT valid_booth_size CHECK (booth_size IN ('small', 'medium', 'large', 'premium'))
);

-- Indexes
CREATE INDEX idx_exhibitors_event_id ON em_exhibitors(event_id);
CREATE INDEX idx_exhibitors_tier ON em_exhibitors(tier);
CREATE INDEX idx_exhibitors_status ON em_exhibitors(status);
CREATE INDEX idx_exhibitors_industry ON em_exhibitors(industry);

-- Updated_at trigger
CREATE TRIGGER update_exhibitors_updated_at
  BEFORE UPDATE ON em_exhibitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- 7. FOOD VENDORS TABLE
-- =====================================================
-- Stores food court vendor information

CREATE TABLE IF NOT EXISTS em_food_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES em_events(id) ON DELETE CASCADE,
  vendor_name VARCHAR(500) NOT NULL,
  cuisine_type VARCHAR(255), -- 'pakistani', 'chinese', 'italian', 'fast_food', etc.
  description TEXT,
  menu_items JSONB DEFAULT '[]'::jsonb, -- Array of {name, price, description, dietary_info}
  location VARCHAR(255),
  booth_number VARCHAR(50),
  operating_hours_start TIME,
  operating_hours_end TIME,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(50),
  logo_url VARCHAR(500),
  accepts_cash BOOLEAN DEFAULT true,
  accepts_card BOOLEAN DEFAULT true,
  accepts_mobile_payment BOOLEAN DEFAULT false,
  dietary_options JSONB DEFAULT '[]'::jsonb, -- ['vegetarian', 'vegan', 'halal', 'gluten_free']
  average_price_range VARCHAR(50), -- 'budget', 'moderate', 'premium'
  status VARCHAR(50) DEFAULT 'confirmed', -- 'pending', 'confirmed', 'cancelled'
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES em_profiles(id),

  -- Constraints
  CONSTRAINT valid_vendor_status CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  CONSTRAINT valid_price_range CHECK (average_price_range IN ('budget', 'moderate', 'premium'))
);

-- Indexes
CREATE INDEX idx_food_vendors_event_id ON em_food_vendors(event_id);
CREATE INDEX idx_food_vendors_cuisine_type ON em_food_vendors(cuisine_type);
CREATE INDEX idx_food_vendors_status ON em_food_vendors(status);

-- Updated_at trigger
CREATE TRIGGER update_food_vendors_updated_at
  BEFORE UPDATE ON em_food_vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE em_conference_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_learning_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_roundtables ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_skill_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_startup_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_food_vendors ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CONFERENCE SESSIONS RLS POLICIES
-- =====================================================

-- Public can view only published sessions (exclude cancelled and pre_conference)
CREATE POLICY "Public can view published conference sessions"
  ON em_conference_sessions FOR SELECT
  USING (status IN ('upcoming', 'happening_now', 'completed'));

-- Admins have full access to all sessions
CREATE POLICY "Admins have full access to conference sessions"
  ON em_conference_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- LEARNING LABS RLS POLICIES
-- =====================================================

-- Public can view only published labs (exclude cancelled and pre_conference)
CREATE POLICY "Public can view published learning labs"
  ON em_learning_labs FOR SELECT
  USING (status IN ('upcoming', 'happening_now', 'completed'));

-- Admins have full access to all labs
CREATE POLICY "Admins have full access to learning labs"
  ON em_learning_labs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- ROUNDTABLES RLS POLICIES
-- =====================================================

-- Public can view only published roundtables (exclude cancelled and pre_conference)
CREATE POLICY "Public can view published roundtables"
  ON em_roundtables FOR SELECT
  USING (status IN ('upcoming', 'happening_now', 'completed'));

-- Admins have full access to all roundtables
CREATE POLICY "Admins have full access to roundtables"
  ON em_roundtables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- SKILL CLINICS RLS POLICIES
-- =====================================================

-- Public can view only published clinics (exclude cancelled and pre_conference)
CREATE POLICY "Public can view published skill clinics"
  ON em_skill_clinics FOR SELECT
  USING (status IN ('upcoming', 'happening_now', 'completed'));

-- Admins have full access to all clinics
CREATE POLICY "Admins have full access to skill clinics"
  ON em_skill_clinics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- STARTUP STORIES RLS POLICIES
-- =====================================================

-- Public can view only confirmed and registered startup stories
CREATE POLICY "Public can view confirmed startup stories"
  ON em_startup_stories FOR SELECT
  USING (
    status != 'cancelled'
    AND confirmation_status = 'confirmed'
    AND registration_status = 'confirmed'
  );

-- Admins have full access to all startup stories
CREATE POLICY "Admins have full access to startup stories"
  ON em_startup_stories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- EXHIBITORS RLS POLICIES
-- =====================================================

-- Public can view only confirmed exhibitors
CREATE POLICY "Public can view confirmed exhibitors"
  ON em_exhibitors FOR SELECT
  USING (status = 'confirmed');

-- Admins have full access to all exhibitors
CREATE POLICY "Admins have full access to exhibitors"
  ON em_exhibitors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- FOOD VENDORS RLS POLICIES
-- =====================================================

-- Public can view only confirmed food vendors
CREATE POLICY "Public can view confirmed food vendors"
  ON em_food_vendors FOR SELECT
  USING (status = 'confirmed');

-- Admins have full access to all food vendors
CREATE POLICY "Admins have full access to food vendors"
  ON em_food_vendors FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE em_profiles.id = auth.uid()
      AND em_profiles.role = 'admin'
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE em_conference_sessions IS 'Stores conference sessions including keynotes, panels, and presentations';
COMMENT ON TABLE em_learning_labs IS 'Stores hands-on workshop and learning lab sessions';
COMMENT ON TABLE em_roundtables IS 'Stores roundtable discussion sessions';
COMMENT ON TABLE em_skill_clinics IS 'Stores skill training and clinic sessions';
COMMENT ON TABLE em_startup_stories IS 'Stores startup pitch and story sessions';
COMMENT ON TABLE em_exhibitors IS 'Stores exhibiting companies with tier information';
COMMENT ON TABLE em_food_vendors IS 'Stores food court vendor information';



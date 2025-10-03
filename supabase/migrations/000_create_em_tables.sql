-- =====================================================
-- Create EM (Event Management) Base Tables
-- This creates the em_* prefixed tables needed for the platform
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================

-- Create profiles table with optional auth.users reference
-- If auth.users exists, it will create the foreign key
-- If not, it will create a standalone table
DO $$
BEGIN
    -- Try to create with auth.users reference
    CREATE TABLE IF NOT EXISTS em_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        avatar_url TEXT,
        company TEXT,
        job_title TEXT,
        phone TEXT,
        bio TEXT,
        role TEXT DEFAULT 'attendee', -- attendee, organizer, speaker, admin, exhibitor
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Try to add foreign key to auth.users if it exists
    IF EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'auth' AND table_name = 'users'
    ) THEN
        -- Add foreign key constraint if auth.users exists
        ALTER TABLE em_profiles
        DROP CONSTRAINT IF EXISTS em_profiles_id_fkey;

        ALTER TABLE em_profiles
        ADD CONSTRAINT em_profiles_id_fkey
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If any error, just create the table without the foreign key
        CREATE TABLE IF NOT EXISTS em_profiles (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            company TEXT,
            job_title TEXT,
            phone TEXT,
            bio TEXT,
            role TEXT DEFAULT 'attendee',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
END $$;

-- =====================================================
-- 2. EVENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    venue_name TEXT,
    venue_address TEXT,
    max_attendees INTEGER,
    organizer_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft', -- draft, published, cancelled, completed
    is_virtual BOOLEAN DEFAULT FALSE,
    is_hybrid BOOLEAN DEFAULT FALSE,
    timezone TEXT DEFAULT 'UTC',
    cover_image_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. TICKET TIERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_ticket_tiers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    quantity_available INTEGER,
    quantity_sold INTEGER DEFAULT 0,
    sale_start_date TIMESTAMP WITH TIME ZONE,
    sale_end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    tier_order INTEGER DEFAULT 0,
    benefits JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TICKETS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_tickets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    ticket_tier_id UUID REFERENCES em_ticket_tiers(id) ON DELETE CASCADE NOT NULL,
    order_id UUID, -- Will be added when orders table is created
    qr_code TEXT UNIQUE,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, refunded
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. SESSIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    room TEXT,
    track TEXT,
    session_type TEXT DEFAULT 'talk', -- talk, workshop, panel, networking, keynote
    max_attendees INTEGER,
    is_virtual BOOLEAN DEFAULT FALSE,
    virtual_link TEXT,
    recording_url TEXT,
    status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. SPEAKERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_speakers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    company TEXT,
    job_title TEXT,
    email TEXT,
    social_links JSONB DEFAULT '{}',
    expertise_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. SESSION SPEAKERS (Many-to-Many)
-- =====================================================

CREATE TABLE IF NOT EXISTS em_session_speakers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL,
    speaker_id UUID REFERENCES em_speakers(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'speaker', -- speaker, moderator, panelist
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, speaker_id)
);

-- =====================================================
-- 8. ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- pending, completed, cancelled, refunded
    payment_method TEXT,
    payment_intent_id TEXT,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add order_id foreign key to tickets
ALTER TABLE em_tickets 
ADD COLUMN IF NOT EXISTS order_id_fk UUID REFERENCES em_orders(id) ON DELETE SET NULL;

-- =====================================================
-- 9. CREATE INDEXES
-- =====================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_em_profiles_email ON em_profiles(email);
CREATE INDEX IF NOT EXISTS idx_em_profiles_role ON em_profiles(role);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_em_events_organizer ON em_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_em_events_status ON em_events(status);
CREATE INDEX IF NOT EXISTS idx_em_events_dates ON em_events(start_date, end_date);

-- Ticket tiers indexes
CREATE INDEX IF NOT EXISTS idx_em_ticket_tiers_event ON em_ticket_tiers(event_id);
CREATE INDEX IF NOT EXISTS idx_em_ticket_tiers_active ON em_ticket_tiers(is_active);

-- Tickets indexes
CREATE INDEX IF NOT EXISTS idx_em_tickets_user ON em_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_em_tickets_tier ON em_tickets(ticket_tier_id);
CREATE INDEX IF NOT EXISTS idx_em_tickets_order ON em_tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_em_tickets_qr ON em_tickets(qr_code);
CREATE INDEX IF NOT EXISTS idx_em_tickets_status ON em_tickets(status);
CREATE INDEX IF NOT EXISTS idx_em_tickets_checked_in ON em_tickets(checked_in);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_em_sessions_event ON em_sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_em_sessions_times ON em_sessions(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_em_sessions_status ON em_sessions(status);

-- Speakers indexes
CREATE INDEX IF NOT EXISTS idx_em_speakers_user ON em_speakers(user_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_em_orders_user ON em_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_em_orders_event ON em_orders(event_id);
CREATE INDEX IF NOT EXISTS idx_em_orders_status ON em_orders(status);

-- =====================================================
-- 10. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, UPDATE ON em_profiles TO authenticated;
GRANT SELECT ON em_events TO authenticated;
GRANT SELECT ON em_ticket_tiers TO authenticated;
GRANT SELECT ON em_tickets TO authenticated;
GRANT SELECT ON em_sessions TO authenticated;
GRANT SELECT ON em_speakers TO authenticated;
GRANT SELECT ON em_session_speakers TO authenticated;
GRANT SELECT ON em_orders TO authenticated;


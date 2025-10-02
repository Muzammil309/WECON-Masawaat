-- =====================================================
-- Event Management Platform - Phase 1 Features
-- Database Schema Extension
-- =====================================================

-- =====================================================
-- 1. REAL-TIME ATTENDANCE & SESSION TRACKING
-- =====================================================

-- Session attendance tracking
CREATE TABLE IF NOT EXISTS session_attendance (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checked_out_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    engagement_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, user_id)
);

-- Live session metrics (real-time updates)
CREATE TABLE IF NOT EXISTS session_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_attendees INTEGER DEFAULT 0,
    peak_attendees INTEGER DEFAULT 0,
    total_check_ins INTEGER DEFAULT 0,
    total_check_outs INTEGER DEFAULT 0,
    average_duration_minutes DECIMAL(10,2) DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    drop_off_rate DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event-level attendance metrics
CREATE TABLE IF NOT EXISTS event_attendance_metrics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_registered INTEGER DEFAULT 0,
    total_checked_in INTEGER DEFAULT 0,
    currently_onsite INTEGER DEFAULT 0,
    peak_concurrent INTEGER DEFAULT 0,
    check_in_rate DECIMAL(5,2) DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CHECK-IN & BADGE PRINTING SYSTEM
-- =====================================================

-- Check-in stations/kiosks
CREATE TABLE IF NOT EXISTS check_in_stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    station_name TEXT NOT NULL,
    location TEXT,
    is_online BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_check_ins INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Check-in logs
CREATE TABLE IF NOT EXISTS check_in_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES em_tickets(id) ON DELETE CASCADE NOT NULL,
    station_id UUID REFERENCES check_in_stations(id) ON DELETE SET NULL,
    checked_in_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL,
    check_in_method TEXT DEFAULT 'qr_code', -- qr_code, barcode, manual, kiosk
    is_offline_sync BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badge printing queue
CREATE TABLE IF NOT EXISTS badge_print_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ticket_id UUID REFERENCES em_tickets(id) ON DELETE CASCADE NOT NULL,
    station_id UUID REFERENCES check_in_stations(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending', -- pending, printing, completed, failed
    priority INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    error_message TEXT,
    printed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. LEAD RETRIEVAL & EXHIBITOR PORTAL
-- =====================================================

-- Exhibitor booths
CREATE TABLE IF NOT EXISTS exhibitor_booths (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    booth_number TEXT,
    booth_location TEXT,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    exhibitor_user_id UUID REFERENCES em_profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead captures
CREATE TABLE IF NOT EXISTS lead_captures (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booth_id UUID REFERENCES exhibitor_booths(id) ON DELETE CASCADE NOT NULL,
    attendee_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    captured_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL NOT NULL,
    capture_method TEXT DEFAULT 'qr_scan', -- qr_scan, manual, business_card
    lead_score INTEGER DEFAULT 0, -- 0-100
    interest_level TEXT, -- hot, warm, cold
    notes TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMP WITH TIME ZONE,
    custom_fields JSONB DEFAULT '{}',
    exported_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exhibitor analytics
CREATE TABLE IF NOT EXISTS exhibitor_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booth_id UUID REFERENCES exhibitor_booths(id) ON DELETE CASCADE NOT NULL UNIQUE,
    total_leads INTEGER DEFAULT 0,
    hot_leads INTEGER DEFAULT 0,
    warm_leads INTEGER DEFAULT 0,
    cold_leads INTEGER DEFAULT 0,
    average_lead_score DECIMAL(5,2) DEFAULT 0,
    total_scans INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. LIVE ENGAGEMENT (CHAT, Q&A, POLLS)
-- =====================================================

-- Session chat messages
CREATE TABLE IF NOT EXISTS session_chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    is_moderated BOOLEAN DEFAULT FALSE,
    moderated_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL,
    moderated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session Q&A
CREATE TABLE IF NOT EXISTS session_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, answered
    upvotes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    answer TEXT,
    answered_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL,
    answered_at TIMESTAMP WITH TIME ZONE,
    moderated_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question upvotes
CREATE TABLE IF NOT EXISTS question_upvotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id UUID REFERENCES session_questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(question_id, user_id)
);

-- Session polls
CREATE TABLE IF NOT EXISTS session_polls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES em_profiles(id) ON DELETE SET NULL NOT NULL,
    question TEXT NOT NULL,
    poll_type TEXT DEFAULT 'multiple_choice', -- multiple_choice, single_choice, rating, open_ended
    options JSONB DEFAULT '[]', -- [{id, text, votes}]
    is_active BOOLEAN DEFAULT TRUE,
    is_anonymous BOOLEAN DEFAULT TRUE,
    total_votes INTEGER DEFAULT 0,
    ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Poll responses
CREATE TABLE IF NOT EXISTS poll_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    poll_id UUID REFERENCES session_polls(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    selected_options JSONB DEFAULT '[]', -- array of option IDs
    text_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

-- =====================================================
-- 5. MOBILE APP / ATTENDEE PORTAL
-- =====================================================

-- Personal agendas
CREATE TABLE IF NOT EXISTS personal_agendas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_id)
);

-- Meeting scheduler (1:1 networking)
CREATE TABLE IF NOT EXISTS networking_meetings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    requester_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected, cancelled
    meeting_time TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER DEFAULT 30,
    location TEXT,
    virtual_meeting_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Push notifications
CREATE TABLE IF NOT EXISTS push_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'general', -- general, session_reminder, meeting_request, emergency
    priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device tokens for push notifications
CREATE TABLE IF NOT EXISTS device_tokens (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    device_type TEXT, -- ios, android, web
    is_active BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. REAL-TIME ANALYTICS & REPORTING
-- =====================================================

-- Analytics snapshots (for historical tracking)
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES em_events(id) ON DELETE CASCADE NOT NULL,
    snapshot_type TEXT NOT NULL, -- hourly, daily, final
    total_registered INTEGER DEFAULT 0,
    total_checked_in INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    active_sessions INTEGER DEFAULT 0,
    total_engagement_actions INTEGER DEFAULT 0,
    snapshot_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_attendance_session ON session_attendance(session_id);
CREATE INDEX IF NOT EXISTS idx_session_attendance_user ON session_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_ticket ON check_in_logs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_lead_captures_booth ON lead_captures(booth_id);
CREATE INDEX IF NOT EXISTS idx_lead_captures_attendee ON lead_captures(attendee_id);
CREATE INDEX IF NOT EXISTS idx_session_chat_session ON session_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_session_questions_session ON session_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_polls_session ON session_polls(session_id);
CREATE INDEX IF NOT EXISTS idx_personal_agendas_user ON personal_agendas(user_id);
CREATE INDEX IF NOT EXISTS idx_networking_meetings_requester ON networking_meetings(requester_id);
CREATE INDEX IF NOT EXISTS idx_networking_meetings_recipient ON networking_meetings(recipient_id);
CREATE INDEX IF NOT EXISTS idx_push_notifications_user ON push_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_event ON analytics_snapshots(event_id);

-- Enable real-time for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE session_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE event_attendance_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE check_in_stations;
ALTER PUBLICATION supabase_realtime ADD TABLE session_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE session_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE session_polls;
ALTER PUBLICATION supabase_realtime ADD TABLE push_notifications;


-- =====================================================
-- Event Management Platform - Phase 1 Features
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE badge_print_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE networking_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SESSION ATTENDANCE POLICIES
-- =====================================================

-- Users can view their own attendance
CREATE POLICY "Users can view own attendance"
    ON session_attendance FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own attendance
CREATE POLICY "Users can insert own attendance"
    ON session_attendance FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own attendance
CREATE POLICY "Users can update own attendance"
    ON session_attendance FOR UPDATE
    USING (auth.uid() = user_id);

-- Admins can view all attendance
CREATE POLICY "Admins can view all attendance"
    ON session_attendance FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- SESSION METRICS POLICIES
-- =====================================================

-- Anyone can view session metrics (public data)
CREATE POLICY "Anyone can view session metrics"
    ON session_metrics FOR SELECT
    USING (true);

-- Only admins can update metrics
CREATE POLICY "Admins can update session metrics"
    ON session_metrics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- EVENT ATTENDANCE METRICS POLICIES
-- =====================================================

-- Anyone can view event metrics
CREATE POLICY "Anyone can view event metrics"
    ON event_attendance_metrics FOR SELECT
    USING (true);

-- Only admins can update event metrics
CREATE POLICY "Admins can update event metrics"
    ON event_attendance_metrics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- CHECK-IN STATIONS POLICIES
-- =====================================================

-- Admins and staff can view check-in stations
CREATE POLICY "Staff can view check-in stations"
    ON check_in_stations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- Only admins can manage check-in stations
CREATE POLICY "Admins can manage check-in stations"
    ON check_in_stations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- CHECK-IN LOGS POLICIES
-- =====================================================

-- Users can view their own check-in logs
CREATE POLICY "Users can view own check-in logs"
    ON check_in_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM em_tickets
            WHERE id = check_in_logs.ticket_id
            AND user_id = auth.uid()
        )
    );

-- Staff can insert check-in logs
CREATE POLICY "Staff can insert check-in logs"
    ON check_in_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- Admins can view all check-in logs
CREATE POLICY "Admins can view all check-in logs"
    ON check_in_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- EXHIBITOR BOOTHS POLICIES
-- =====================================================

-- Anyone can view active exhibitor booths
CREATE POLICY "Anyone can view active booths"
    ON exhibitor_booths FOR SELECT
    USING (is_active = true);

-- Exhibitors can view their own booths
CREATE POLICY "Exhibitors can view own booths"
    ON exhibitor_booths FOR SELECT
    USING (auth.uid() = exhibitor_user_id);

-- Admins can manage all booths
CREATE POLICY "Admins can manage booths"
    ON exhibitor_booths FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- LEAD CAPTURES POLICIES
-- =====================================================

-- Exhibitors can view leads for their booths
CREATE POLICY "Exhibitors can view own leads"
    ON lead_captures FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM exhibitor_booths
            WHERE id = lead_captures.booth_id
            AND exhibitor_user_id = auth.uid()
        )
    );

-- Exhibitors can insert leads for their booths
CREATE POLICY "Exhibitors can insert leads"
    ON lead_captures FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM exhibitor_booths
            WHERE id = booth_id
            AND exhibitor_user_id = auth.uid()
        )
    );

-- Exhibitors can update their own leads
CREATE POLICY "Exhibitors can update own leads"
    ON lead_captures FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM exhibitor_booths
            WHERE id = lead_captures.booth_id
            AND exhibitor_user_id = auth.uid()
        )
    );

-- Admins can view all leads
CREATE POLICY "Admins can view all leads"
    ON lead_captures FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- SESSION CHAT MESSAGES POLICIES
-- =====================================================

-- Users can view non-hidden messages
CREATE POLICY "Users can view chat messages"
    ON session_chat_messages FOR SELECT
    USING (is_hidden = false);

-- Users can insert their own messages
CREATE POLICY "Users can insert chat messages"
    ON session_chat_messages FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
    ON session_chat_messages FOR UPDATE
    USING (auth.uid() = user_id);

-- Moderators can update any message
CREATE POLICY "Moderators can moderate messages"
    ON session_chat_messages FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer', 'speaker')
        )
    );

-- =====================================================
-- SESSION QUESTIONS POLICIES
-- =====================================================

-- Users can view approved questions
CREATE POLICY "Users can view approved questions"
    ON session_questions FOR SELECT
    USING (status IN ('approved', 'answered'));

-- Users can view their own questions
CREATE POLICY "Users can view own questions"
    ON session_questions FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert questions
CREATE POLICY "Users can insert questions"
    ON session_questions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Moderators can manage questions
CREATE POLICY "Moderators can manage questions"
    ON session_questions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer', 'speaker')
        )
    );

-- =====================================================
-- SESSION POLLS POLICIES
-- =====================================================

-- Users can view active polls
CREATE POLICY "Users can view active polls"
    ON session_polls FOR SELECT
    USING (is_active = true);

-- Moderators can manage polls
CREATE POLICY "Moderators can manage polls"
    ON session_polls FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer', 'speaker')
        )
    );

-- =====================================================
-- POLL RESPONSES POLICIES
-- =====================================================

-- Users can view their own responses
CREATE POLICY "Users can view own poll responses"
    ON poll_responses FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert poll responses"
    ON poll_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PERSONAL AGENDAS POLICIES
-- =====================================================

-- Users can manage their own agendas
CREATE POLICY "Users can manage own agendas"
    ON personal_agendas FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- NETWORKING MEETINGS POLICIES
-- =====================================================

-- Users can view meetings they're involved in
CREATE POLICY "Users can view own meetings"
    ON networking_meetings FOR SELECT
    USING (auth.uid() IN (requester_id, recipient_id));

-- Users can create meeting requests
CREATE POLICY "Users can create meetings"
    ON networking_meetings FOR INSERT
    WITH CHECK (auth.uid() = requester_id);

-- Users can update meetings they're involved in
CREATE POLICY "Users can update own meetings"
    ON networking_meetings FOR UPDATE
    USING (auth.uid() IN (requester_id, recipient_id));

-- =====================================================
-- PUSH NOTIFICATIONS POLICIES
-- =====================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
    ON push_notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
    ON push_notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Admins can send notifications
CREATE POLICY "Admins can send notifications"
    ON push_notifications FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- =====================================================
-- DEVICE TOKENS POLICIES
-- =====================================================

-- Users can manage their own device tokens
CREATE POLICY "Users can manage own device tokens"
    ON device_tokens FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- ANALYTICS SNAPSHOTS POLICIES
-- =====================================================

-- Admins can view analytics
CREATE POLICY "Admins can view analytics"
    ON analytics_snapshots FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );

-- Admins can insert analytics
CREATE POLICY "Admins can insert analytics"
    ON analytics_snapshots FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM em_profiles
            WHERE id = auth.uid() AND role IN ('admin', 'organizer')
        )
    );


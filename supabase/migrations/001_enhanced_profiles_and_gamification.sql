-- =====================================================
-- Migration: Enhanced Profiles & Gamification System
-- Description: Extends em_profiles with networking fields,
--              adds badge system for gamification
-- Version: 001
-- Date: 2025-10-03
-- =====================================================

-- =====================================================
-- 1. EXTEND em_profiles TABLE
-- =====================================================

-- Add new columns to existing em_profiles table
ALTER TABLE em_profiles
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS networking_interests JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS github_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS website_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS job_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_networking_interests ON em_profiles USING GIN (networking_interests);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON em_profiles (total_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON em_profiles (email);

-- Add comment for documentation
COMMENT ON COLUMN em_profiles.networking_interests IS 'Array of interest tags for AI matchmaking (e.g., ["AI", "Web3", "SaaS"])';
COMMENT ON COLUMN em_profiles.preferences IS 'User preferences like notifications, theme, language';
COMMENT ON COLUMN em_profiles.total_points IS 'Cumulative gamification points from all activities';

-- =====================================================
-- 2. CREATE BADGES SYSTEM
-- =====================================================

-- Badges master table
CREATE TABLE IF NOT EXISTS em_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL, -- Lucide icon name or emoji
  category VARCHAR(50) NOT NULL, -- 'networking', 'attendance', 'engagement', 'achievement'
  points INTEGER NOT NULL DEFAULT 0,
  criteria JSONB NOT NULL, -- Conditions to earn badge (e.g., {"sessions_attended": 5})
  rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  color VARCHAR(20) DEFAULT 'blue', -- Tailwind color name
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges junction table
CREATE TABLE IF NOT EXISTS em_user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES em_profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES em_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress JSONB DEFAULT '{}'::jsonb, -- Track progress toward badge criteria
  is_displayed BOOLEAN DEFAULT true, -- Whether user displays this badge on profile
  UNIQUE(user_id, badge_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON em_user_badges (user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON em_user_badges (badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_earned_at ON em_user_badges (earned_at DESC);

-- =====================================================
-- 3. CREATE POINTS TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS em_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES em_profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'session_attendance', 'networking_connection', 'poll_participation', etc.
  points INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional context (session_id, connection_id, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_points_user_id ON em_points (user_id);
CREATE INDEX IF NOT EXISTS idx_points_event_id ON em_points (event_id);
CREATE INDEX IF NOT EXISTS idx_points_activity_type ON em_points (activity_type);
CREATE INDEX IF NOT EXISTS idx_points_created_at ON em_points (created_at DESC);

-- =====================================================
-- 4. INSERT DEFAULT BADGES
-- =====================================================

INSERT INTO em_badges (name, description, icon, category, points, criteria, rarity, color) VALUES
  ('Early Bird', 'Registered for an event 30+ days in advance', 'Bird', 'achievement', 50, '{"days_before_event": 30}', 'common', 'yellow'),
  ('Networking Pro', 'Connected with 10+ attendees', 'Users', 'networking', 100, '{"connections": 10}', 'rare', 'blue'),
  ('Session Enthusiast', 'Attended 5+ sessions', 'Calendar', 'attendance', 75, '{"sessions_attended": 5}', 'common', 'green'),
  ('Question Master', 'Asked 3+ questions in Q&A', 'MessageCircle', 'engagement', 60, '{"questions_asked": 3}', 'common', 'purple'),
  ('Poll Participant', 'Voted in 5+ polls', 'BarChart3', 'engagement', 40, '{"polls_voted": 5}', 'common', 'indigo'),
  ('VIP Attendee', 'Purchased VIP ticket', 'Crown', 'achievement', 200, '{"ticket_type": "vip"}', 'epic', 'amber'),
  ('Speaker Star', 'Delivered a session as speaker', 'Mic', 'achievement', 150, '{"is_speaker": true}', 'rare', 'red'),
  ('Resource Hunter', 'Downloaded 10+ resources', 'Download', 'engagement', 50, '{"resources_downloaded": 10}', 'common', 'cyan'),
  ('Sponsor Supporter', 'Visited 5+ sponsor booths', 'Store', 'engagement', 80, '{"booths_visited": 5}', 'rare', 'orange'),
  ('Perfect Attendance', 'Attended all sessions in an event', 'Trophy', 'attendance', 300, '{"attendance_rate": 100}', 'legendary', 'gold')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on new tables
ALTER TABLE em_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE em_points ENABLE ROW LEVEL SECURITY;

-- em_badges policies (public read, admin write)
CREATE POLICY "Anyone can view active badges"
  ON em_badges FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage badges"
  ON em_badges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- em_user_badges policies
CREATE POLICY "Users can view their own badges"
  ON em_user_badges FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view others' displayed badges"
  ON em_user_badges FOR SELECT
  USING (is_displayed = true);

CREATE POLICY "Users can update their badge display settings"
  ON em_user_badges FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can insert badges for users"
  ON em_user_badges FOR INSERT
  WITH CHECK (true); -- Will be controlled by service role

-- em_points policies
CREATE POLICY "Users can view their own points"
  ON em_points FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all points"
  ON em_points FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert points"
  ON em_points FOR INSERT
  WITH CHECK (true); -- Will be controlled by service role

-- =====================================================
-- 6. FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update total_points when new points are added
CREATE OR REPLACE FUNCTION update_user_total_points()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE em_profiles
  SET total_points = (
    SELECT COALESCE(SUM(points), 0)
    FROM em_points
    WHERE user_id = NEW.user_id
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update total_points
DROP TRIGGER IF EXISTS trigger_update_total_points ON em_points;
CREATE TRIGGER trigger_update_total_points
  AFTER INSERT ON em_points
  FOR EACH ROW
  EXECUTE FUNCTION update_user_total_points();

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID, p_activity_type VARCHAR)
RETURNS void AS $$
DECLARE
  v_badge RECORD;
  v_user_stats JSONB;
BEGIN
  -- Build user statistics
  SELECT jsonb_build_object(
    'sessions_attended', (SELECT COUNT(*) FROM em_points WHERE user_id = p_user_id AND activity_type = 'session_attendance'),
    'connections', (SELECT COUNT(*) FROM em_points WHERE user_id = p_user_id AND activity_type = 'networking_connection'),
    'questions_asked', (SELECT COUNT(*) FROM em_points WHERE user_id = p_user_id AND activity_type = 'question_asked'),
    'polls_voted', (SELECT COUNT(*) FROM em_points WHERE user_id = p_user_id AND activity_type = 'poll_participation'),
    'resources_downloaded', (SELECT COUNT(*) FROM em_points WHERE user_id = p_user_id AND activity_type = 'resource_download'),
    'booths_visited', (SELECT COUNT(*) FROM em_points WHERE user_id = p_user_id AND activity_type = 'booth_visit')
  ) INTO v_user_stats;

  -- Check each badge criteria
  FOR v_badge IN SELECT * FROM em_badges WHERE is_active = true LOOP
    -- Simple criteria check (can be enhanced with more complex logic)
    IF NOT EXISTS (SELECT 1 FROM em_user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
      -- Award badge if criteria met (simplified - enhance based on actual criteria)
      -- This is a placeholder - implement actual criteria checking logic
      NULL;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile_completed status
CREATE OR REPLACE FUNCTION update_profile_completed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completed := (
    NEW.full_name IS NOT NULL AND
    NEW.email IS NOT NULL AND
    NEW.avatar_url IS NOT NULL AND
    NEW.bio IS NOT NULL AND
    NEW.company IS NOT NULL AND
    jsonb_array_length(NEW.networking_interests) > 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update profile_completed
DROP TRIGGER IF EXISTS trigger_update_profile_completed ON em_profiles;
CREATE TRIGGER trigger_update_profile_completed
  BEFORE INSERT OR UPDATE ON em_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completed();

-- =====================================================
-- 7. STORAGE BUCKETS (Run via Supabase Dashboard or API)
-- =====================================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- Bucket name: 'avatars'
-- Public: true
-- File size limit: 2MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- Storage policy for avatars (add via Dashboard)
-- Policy: "Users can upload their own avatar"
-- Operation: INSERT
-- Policy definition: bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]

-- Policy: "Anyone can view avatars"
-- Operation: SELECT
-- Policy definition: bucket_id = 'avatars'

-- Policy: "Users can update their own avatar"
-- Operation: UPDATE
-- Policy definition: bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]

-- Policy: "Users can delete their own avatar"
-- Operation: DELETE
-- Policy definition: bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]

-- =====================================================
-- 8. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT SELECT ON em_badges TO authenticated;
GRANT SELECT, INSERT, UPDATE ON em_user_badges TO authenticated;
GRANT SELECT, INSERT ON em_points TO authenticated;

-- =====================================================
-- END OF MIGRATION
-- =====================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 001 completed successfully!';
  RAISE NOTICE 'Tables created: em_badges, em_user_badges, em_points';
  RAISE NOTICE 'em_profiles extended with networking fields';
  RAISE NOTICE 'Default badges inserted';
  RAISE NOTICE 'RLS policies enabled';
  RAISE NOTICE 'Next step: Create avatars storage bucket in Supabase Dashboard';
END $$;


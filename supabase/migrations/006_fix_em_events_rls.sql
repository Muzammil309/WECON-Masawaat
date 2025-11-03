-- =====================================================
-- Fix em_events RLS Policies
-- Allow admins to see all events, public to see published events
-- =====================================================

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public events are viewable by everyone" ON em_events;

-- Create new policies for better access control

-- 1. Anyone can view published events
CREATE POLICY "Anyone can view published events"
ON em_events FOR SELECT
USING (status = 'published');

-- 2. Admins and organizers can view all events
CREATE POLICY "Admins can view all events"
ON em_events FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role IN ('admin', 'organizer')
    )
);

-- 3. Event organizers can view their own events (any status)
CREATE POLICY "Organizers can view own events"
ON em_events FOR SELECT
USING (auth.uid() = organizer_id);

-- 4. Admins and organizers can create events
CREATE POLICY "Admins can create events"
ON em_events FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role IN ('admin', 'organizer')
    )
);

-- 5. Admins can update any event
CREATE POLICY "Admins can update any event"
ON em_events FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 6. Organizers can update their own events
CREATE POLICY "Organizers can update own events"
ON em_events FOR UPDATE
USING (auth.uid() = organizer_id);

-- 7. Admins can delete any event
CREATE POLICY "Admins can delete any event"
ON em_events FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 8. Organizers can delete their own events
CREATE POLICY "Organizers can delete own events"
ON em_events FOR DELETE
USING (auth.uid() = organizer_id);


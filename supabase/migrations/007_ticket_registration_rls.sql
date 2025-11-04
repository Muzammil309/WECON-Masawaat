-- =====================================================
-- Add RLS Policies for Ticket Registration
-- Allow authenticated users to create their own tickets
-- =====================================================

-- Drop existing policies if they exist (use unique names to avoid conflicts)
DROP POLICY IF EXISTS "em_tickets_users_view_own" ON em_tickets;
DROP POLICY IF EXISTS "em_tickets_admins_view_all" ON em_tickets;
DROP POLICY IF EXISTS "em_tickets_organizers_view_event" ON em_tickets;
DROP POLICY IF EXISTS "em_tickets_users_create_own" ON em_tickets;
DROP POLICY IF EXISTS "em_tickets_admins_update_any" ON em_tickets;
DROP POLICY IF EXISTS "em_tickets_users_update_own" ON em_tickets;
DROP POLICY IF EXISTS "em_tickets_organizers_update_event" ON em_tickets;

-- 1. Users can view their own tickets
CREATE POLICY "em_tickets_users_view_own"
ON em_tickets FOR SELECT
USING (auth.uid() = user_id);

-- 2. Admins can view all tickets
CREATE POLICY "em_tickets_admins_view_all"
ON em_tickets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 3. Event organizers can view tickets for their events
CREATE POLICY "em_tickets_organizers_view_event"
ON em_tickets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_ticket_tiers tt
        JOIN em_events e ON e.id = tt.event_id
        WHERE tt.id = em_tickets.ticket_tier_id
        AND e.organizer_id = auth.uid()
    )
);

-- 4. Authenticated users can create tickets for themselves
CREATE POLICY "em_tickets_users_create_own"
ON em_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Admins can update any ticket
CREATE POLICY "em_tickets_admins_update_any"
ON em_tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 6. Users can update their own tickets (limited fields)
CREATE POLICY "em_tickets_users_update_own"
ON em_tickets FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Event organizers can update tickets for their events (for check-in)
CREATE POLICY "em_tickets_organizers_update_event"
ON em_tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_ticket_tiers tt
        JOIN em_events e ON e.id = tt.event_id
        WHERE tt.id = em_tickets.ticket_tier_id
        AND e.organizer_id = auth.uid()
    )
);

-- =====================================================
-- Add RLS Policies for Ticket Tiers
-- =====================================================

-- Drop existing policies if they exist (use unique names to avoid conflicts)
DROP POLICY IF EXISTS "em_ticket_tiers_public_view_active" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_admins_view_all" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_organizers_view_own" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_admins_create" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_organizers_create" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_admins_update" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_organizers_update" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_admins_delete" ON em_ticket_tiers;
DROP POLICY IF EXISTS "em_ticket_tiers_organizers_delete" ON em_ticket_tiers;

-- 1. Anyone can view active ticket tiers for published events
CREATE POLICY "em_ticket_tiers_public_view_active"
ON em_ticket_tiers FOR SELECT
USING (
    is_active = true AND
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND status = 'published'
    )
);

-- 2. Admins can view all ticket tiers
CREATE POLICY "em_ticket_tiers_admins_view_all"
ON em_ticket_tiers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 3. Event organizers can view ticket tiers for their events
CREATE POLICY "em_ticket_tiers_organizers_view_own"
ON em_ticket_tiers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND organizer_id = auth.uid()
    )
);

-- 4. Admins can create ticket tiers
CREATE POLICY "em_ticket_tiers_admins_create"
ON em_ticket_tiers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Event organizers can create ticket tiers for their events
CREATE POLICY "em_ticket_tiers_organizers_create"
ON em_ticket_tiers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = event_id
        AND organizer_id = auth.uid()
    )
);

-- 6. Admins can update any ticket tier
CREATE POLICY "em_ticket_tiers_admins_update"
ON em_ticket_tiers FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 7. Event organizers can update ticket tiers for their events
CREATE POLICY "em_ticket_tiers_organizers_update"
ON em_ticket_tiers FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND organizer_id = auth.uid()
    )
);

-- 8. Admins can delete any ticket tier
CREATE POLICY "em_ticket_tiers_admins_delete"
ON em_ticket_tiers FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 9. Event organizers can delete ticket tiers for their events
CREATE POLICY "em_ticket_tiers_organizers_delete"
ON em_ticket_tiers FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND organizer_id = auth.uid()
    )
);


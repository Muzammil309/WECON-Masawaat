-- =====================================================
-- Add RLS Policies for Ticket Registration
-- Allow authenticated users to create their own tickets
-- =====================================================

-- Drop existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Users can view their own tickets" ON em_tickets;

-- 1. Users can view their own tickets
CREATE POLICY "Users can view own tickets"
ON em_tickets FOR SELECT
USING (auth.uid() = user_id);

-- 2. Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
ON em_tickets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 3. Event organizers can view tickets for their events
CREATE POLICY "Organizers can view event tickets"
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
CREATE POLICY "Users can create own tickets"
ON em_tickets FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Admins can update any ticket
CREATE POLICY "Admins can update any ticket"
ON em_tickets FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 6. Users can update their own tickets (limited fields)
CREATE POLICY "Users can update own tickets"
ON em_tickets FOR UPDATE
USING (auth.uid() = user_id);

-- 7. Event organizers can update tickets for their events (for check-in)
CREATE POLICY "Organizers can update event tickets"
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

-- Drop existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Public ticket tiers are viewable by everyone" ON em_ticket_tiers;

-- 1. Anyone can view active ticket tiers for published events
CREATE POLICY "Anyone can view active ticket tiers"
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
CREATE POLICY "Admins can view all ticket tiers"
ON em_ticket_tiers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 3. Event organizers can view ticket tiers for their events
CREATE POLICY "Organizers can view own event ticket tiers"
ON em_ticket_tiers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND organizer_id = auth.uid()
    )
);

-- 4. Admins can create ticket tiers
CREATE POLICY "Admins can create ticket tiers"
ON em_ticket_tiers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 5. Event organizers can create ticket tiers for their events
CREATE POLICY "Organizers can create ticket tiers"
ON em_ticket_tiers FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = event_id
        AND organizer_id = auth.uid()
    )
);

-- 6. Admins can update any ticket tier
CREATE POLICY "Admins can update any ticket tier"
ON em_ticket_tiers FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 7. Event organizers can update ticket tiers for their events
CREATE POLICY "Organizers can update own ticket tiers"
ON em_ticket_tiers FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND organizer_id = auth.uid()
    )
);

-- 8. Admins can delete any ticket tier
CREATE POLICY "Admins can delete any ticket tier"
ON em_ticket_tiers FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- 9. Event organizers can delete ticket tiers for their events
CREATE POLICY "Organizers can delete own ticket tiers"
ON em_ticket_tiers FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM em_events
        WHERE id = em_ticket_tiers.event_id
        AND organizer_id = auth.uid()
    )
);


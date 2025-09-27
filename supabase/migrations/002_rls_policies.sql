-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Anyone can view published events" ON events FOR SELECT USING (status = 'published' OR organizer_id = auth.uid());
CREATE POLICY "Organizers can create events" ON events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own events" ON events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete own events" ON events FOR DELETE USING (auth.uid() = organizer_id);

-- Ticket tiers policies
CREATE POLICY "Anyone can view ticket tiers for published events" ON ticket_tiers FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = ticket_tiers.event_id AND (events.status = 'published' OR events.organizer_id = auth.uid()))
);
CREATE POLICY "Event organizers can manage ticket tiers" ON ticket_tiers FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = ticket_tiers.event_id AND events.organizer_id = auth.uid())
);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Event organizers can view orders for their events" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = orders.event_id AND events.organizer_id = auth.uid())
);

-- Tickets policies
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tickets" ON tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Event organizers can view tickets for their events" ON tickets FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        JOIN events ON events.id = orders.event_id 
        WHERE orders.id = tickets.order_id AND events.organizer_id = auth.uid()
    )
);
CREATE POLICY "Event organizers can update ticket check-in status" ON tickets FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM orders 
        JOIN events ON events.id = orders.event_id 
        WHERE orders.id = tickets.order_id AND events.organizer_id = auth.uid()
    )
);

-- Sessions policies
CREATE POLICY "Anyone can view sessions for published events" ON sessions FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = sessions.event_id AND (events.status = 'published' OR events.organizer_id = auth.uid()))
);
CREATE POLICY "Event organizers can manage sessions" ON sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = sessions.event_id AND events.organizer_id = auth.uid())
);

-- Speakers policies
CREATE POLICY "Anyone can view speakers" ON speakers FOR SELECT USING (true);
CREATE POLICY "Users can update own speaker profile" ON speakers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create own speaker profile" ON speakers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Event organizers can manage speakers for their events" ON speakers FOR ALL USING (
    EXISTS (
        SELECT 1 FROM session_speakers ss
        JOIN sessions s ON s.id = ss.session_id
        JOIN events e ON e.id = s.event_id
        WHERE ss.speaker_id = speakers.id AND e.organizer_id = auth.uid()
    )
);

-- Session speakers policies
CREATE POLICY "Anyone can view session speakers for published events" ON session_speakers FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM sessions s
        JOIN events e ON e.id = s.event_id
        WHERE s.id = session_speakers.session_id AND (e.status = 'published' OR e.organizer_id = auth.uid())
    )
);
CREATE POLICY "Event organizers can manage session speakers" ON session_speakers FOR ALL USING (
    EXISTS (
        SELECT 1 FROM sessions s
        JOIN events e ON e.id = s.event_id
        WHERE s.id = session_speakers.session_id AND e.organizer_id = auth.uid()
    )
);

-- Rooms policies
CREATE POLICY "Anyone can view rooms for published events" ON rooms FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = rooms.event_id AND (events.status = 'published' OR events.organizer_id = auth.uid()))
);
CREATE POLICY "Event organizers can manage rooms" ON rooms FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = rooms.event_id AND events.organizer_id = auth.uid())
);

-- Tracks policies
CREATE POLICY "Anyone can view tracks for published events" ON tracks FOR SELECT USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = tracks.event_id AND (events.status = 'published' OR events.organizer_id = auth.uid()))
);
CREATE POLICY "Event organizers can manage tracks" ON tracks FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = tracks.event_id AND events.organizer_id = auth.uid())
);

-- Messages policies
CREATE POLICY "Event attendees can view messages in chat rooms" ON messages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM chat_rooms cr
        JOIN events e ON e.id = cr.event_id
        JOIN tickets t ON t.user_id = auth.uid()
        JOIN orders o ON o.id = t.order_id AND o.event_id = e.id
        WHERE cr.id = messages.room_id AND o.status = 'completed'
    ) OR
    EXISTS (
        SELECT 1 FROM chat_rooms cr
        JOIN events e ON e.id = cr.event_id
        WHERE cr.id = messages.room_id AND e.organizer_id = auth.uid()
    )
);
CREATE POLICY "Event attendees can send messages" ON messages FOR INSERT WITH CHECK (
    auth.uid() = user_id AND (
        EXISTS (
            SELECT 1 FROM chat_rooms cr
            JOIN events e ON e.id = cr.event_id
            JOIN tickets t ON t.user_id = auth.uid()
            JOIN orders o ON o.id = t.order_id AND o.event_id = e.id
            WHERE cr.id = messages.room_id AND o.status = 'completed'
        ) OR
        EXISTS (
            SELECT 1 FROM chat_rooms cr
            JOIN events e ON e.id = cr.event_id
            WHERE cr.id = messages.room_id AND e.organizer_id = auth.uid()
        )
    )
);

-- Chat rooms policies
CREATE POLICY "Event attendees can view chat rooms" ON chat_rooms FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM events e
        JOIN tickets t ON t.user_id = auth.uid()
        JOIN orders o ON o.id = t.order_id AND o.event_id = e.id
        WHERE e.id = chat_rooms.event_id AND o.status = 'completed'
    ) OR
    EXISTS (
        SELECT 1 FROM events e
        WHERE e.id = chat_rooms.event_id AND e.organizer_id = auth.uid()
    )
);
CREATE POLICY "Event organizers can manage chat rooms" ON chat_rooms FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = chat_rooms.event_id AND events.organizer_id = auth.uid())
);

-- Groups policies
CREATE POLICY "Event attendees can view groups" ON groups FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM events e
        JOIN tickets t ON t.user_id = auth.uid()
        JOIN orders o ON o.id = t.order_id AND o.event_id = e.id
        WHERE e.id = groups.event_id AND o.status = 'completed'
    ) OR
    EXISTS (
        SELECT 1 FROM events e
        WHERE e.id = groups.event_id AND e.organizer_id = auth.uid()
    )
);
CREATE POLICY "Event organizers can manage groups" ON groups FOR ALL USING (
    EXISTS (SELECT 1 FROM events WHERE events.id = groups.event_id AND events.organizer_id = auth.uid())
);

-- Group members policies
CREATE POLICY "Group members can view group membership" ON group_members FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM groups g
        JOIN events e ON e.id = g.event_id
        WHERE g.id = group_members.group_id AND e.organizer_id = auth.uid()
    )
);
CREATE POLICY "Users can join groups" ON group_members FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM groups g
        JOIN events e ON e.id = g.event_id
        JOIN tickets t ON t.user_id = auth.uid()
        JOIN orders o ON o.id = t.order_id AND o.event_id = e.id
        WHERE g.id = group_members.group_id AND o.status = 'completed'
    )
);
CREATE POLICY "Users can leave groups" ON group_members FOR DELETE USING (auth.uid() = user_id);

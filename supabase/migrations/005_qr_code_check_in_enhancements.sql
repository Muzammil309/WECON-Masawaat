-- =====================================================
-- Feature #2: QR Code Check-in & Badge Printing
-- Database Schema Enhancements
-- =====================================================

-- =====================================================
-- 1. UPDATE TICKETS TABLE FOR QR CODE SUPPORT
-- =====================================================

-- Add barcode field as alternative to QR code
ALTER TABLE em_tickets 
ADD COLUMN IF NOT EXISTS barcode TEXT UNIQUE;

-- Add QR code metadata
ALTER TABLE em_tickets
ADD COLUMN IF NOT EXISTS qr_code_generated_at TIMESTAMP WITH TIME ZONE;

-- Add check-in metadata
ALTER TABLE em_tickets
ADD COLUMN IF NOT EXISTS check_in_count INTEGER DEFAULT 0;

-- Add badge printing status
ALTER TABLE em_tickets
ADD COLUMN IF NOT EXISTS badge_printed BOOLEAN DEFAULT FALSE;

ALTER TABLE em_tickets
ADD COLUMN IF NOT EXISTS badge_printed_at TIMESTAMP WITH TIME ZONE;

-- Create index on qr_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_tickets_qr_code ON em_tickets(qr_code);
CREATE INDEX IF NOT EXISTS idx_tickets_barcode ON em_tickets(barcode);
CREATE INDEX IF NOT EXISTS idx_tickets_checked_in ON em_tickets(checked_in);

-- =====================================================
-- 2. ENHANCE CHECK-IN STATIONS TABLE
-- =====================================================

-- Add device information
ALTER TABLE check_in_stations
ADD COLUMN IF NOT EXISTS device_id TEXT UNIQUE;

ALTER TABLE check_in_stations
ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT 'mobile'; -- mobile, kiosk, tablet

ALTER TABLE check_in_stations
ADD COLUMN IF NOT EXISTS ip_address TEXT;

ALTER TABLE check_in_stations
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add offline sync tracking
ALTER TABLE check_in_stations
ADD COLUMN IF NOT EXISTS pending_sync_count INTEGER DEFAULT 0;

ALTER TABLE check_in_stations
ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP WITH TIME ZONE;

-- Create index for online status queries
CREATE INDEX IF NOT EXISTS idx_check_in_stations_online ON check_in_stations(is_online);
CREATE INDEX IF NOT EXISTS idx_check_in_stations_event ON check_in_stations(event_id);

-- =====================================================
-- 3. ENHANCE CHECK-IN LOGS TABLE
-- =====================================================

-- Add attendee information snapshot (for offline mode)
ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS attendee_name TEXT;

ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS attendee_email TEXT;

ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS ticket_tier_name TEXT;

-- Add QR code data
ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS qr_code_scanned TEXT;

-- Add validation status
ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'valid'; -- valid, invalid, duplicate, expired

ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS validation_message TEXT;

-- Add sync metadata
ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS client_timestamp TIMESTAMP WITH TIME ZONE;

ALTER TABLE check_in_logs
ADD COLUMN IF NOT EXISTS sync_retry_count INTEGER DEFAULT 0;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_check_in_logs_ticket ON check_in_logs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_station ON check_in_logs(station_id);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_offline_sync ON check_in_logs(is_offline_sync);
CREATE INDEX IF NOT EXISTS idx_check_in_logs_checked_in_at ON check_in_logs(checked_in_at);

-- =====================================================
-- 4. ENHANCE BADGE PRINT QUEUE TABLE
-- =====================================================

-- Add badge template information
ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS badge_template_id UUID;

ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS badge_data JSONB; -- Stores attendee info, QR code, etc.

-- Add printer information
ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS printer_id TEXT;

ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS printer_name TEXT;

-- Add timing information
ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS queued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS started_printing_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE badge_print_queue
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for queue management
CREATE INDEX IF NOT EXISTS idx_badge_queue_status ON badge_print_queue(status);
CREATE INDEX IF NOT EXISTS idx_badge_queue_priority ON badge_print_queue(priority DESC);
CREATE INDEX IF NOT EXISTS idx_badge_queue_station ON badge_print_queue(station_id);
CREATE INDEX IF NOT EXISTS idx_badge_queue_created_at ON badge_print_queue(created_at);

-- =====================================================
-- 5. CREATE OFFLINE SYNC QUEUE TABLE
-- =====================================================

-- Table to track offline operations that need to be synced
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES check_in_stations(id) ON DELETE CASCADE,
    operation_type TEXT NOT NULL, -- check_in, badge_print, update
    operation_data JSONB NOT NULL,
    client_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_status TEXT DEFAULT 'pending', -- pending, syncing, completed, failed
    sync_attempts INTEGER DEFAULT 0,
    last_sync_attempt TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_station ON offline_sync_queue(station_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_status ON offline_sync_queue(sync_status);
CREATE INDEX IF NOT EXISTS idx_offline_sync_queue_created_at ON offline_sync_queue(created_at);

-- =====================================================
-- 6. CREATE CHECK-IN STATISTICS VIEW
-- =====================================================

-- View for real-time check-in statistics
CREATE OR REPLACE VIEW check_in_statistics AS
SELECT 
    e.id AS event_id,
    e.title AS event_title,
    COUNT(DISTINCT t.id) AS total_tickets,
    COUNT(DISTINCT CASE WHEN t.checked_in THEN t.id END) AS checked_in_count,
    COUNT(DISTINCT CASE WHEN NOT t.checked_in THEN t.id END) AS not_checked_in_count,
    ROUND(
        (COUNT(DISTINCT CASE WHEN t.checked_in THEN t.id END)::DECIMAL / 
         NULLIF(COUNT(DISTINCT t.id), 0) * 100), 
        2
    ) AS check_in_percentage,
    COUNT(DISTINCT CASE WHEN t.badge_printed THEN t.id END) AS badges_printed,
    COUNT(DISTINCT cl.id) AS total_check_in_events,
    MAX(cl.checked_in_at) AS last_check_in_at
FROM em_events e
LEFT JOIN em_ticket_tiers tt ON tt.event_id = e.id
LEFT JOIN em_tickets t ON t.ticket_tier_id = tt.id
LEFT JOIN check_in_logs cl ON cl.ticket_id = t.id
GROUP BY e.id, e.title;

-- =====================================================
-- 7. CREATE FUNCTIONS FOR CHECK-IN OPERATIONS
-- =====================================================

-- Function to process check-in
CREATE OR REPLACE FUNCTION process_check_in(
    p_ticket_id UUID,
    p_station_id UUID,
    p_checked_in_by UUID,
    p_check_in_method TEXT DEFAULT 'qr_code',
    p_is_offline_sync BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
    v_ticket RECORD;
    v_check_in_log_id UUID;
    v_result JSONB;
BEGIN
    -- Get ticket details
    SELECT t.*, tt.event_id, p.full_name, p.email
    INTO v_ticket
    FROM em_tickets t
    JOIN em_ticket_tiers tt ON t.ticket_tier_id = tt.id
    JOIN em_profiles p ON t.user_id = p.id
    WHERE t.id = p_ticket_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Ticket not found'
        );
    END IF;
    
    -- Check if already checked in
    IF v_ticket.checked_in AND NOT p_is_offline_sync THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Ticket already checked in',
            'checked_in_at', v_ticket.checked_in_at
        );
    END IF;
    
    -- Update ticket
    UPDATE em_tickets
    SET 
        checked_in = TRUE,
        checked_in_at = COALESCE(checked_in_at, NOW()),
        check_in_count = check_in_count + 1,
        updated_at = NOW()
    WHERE id = p_ticket_id;
    
    -- Create check-in log
    INSERT INTO check_in_logs (
        ticket_id,
        station_id,
        checked_in_by,
        check_in_method,
        is_offline_sync,
        attendee_name,
        attendee_email,
        checked_in_at
    ) VALUES (
        p_ticket_id,
        p_station_id,
        p_checked_in_by,
        p_check_in_method,
        p_is_offline_sync,
        v_ticket.full_name,
        v_ticket.email,
        NOW()
    )
    RETURNING id INTO v_check_in_log_id;
    
    -- Update station stats
    UPDATE check_in_stations
    SET 
        total_check_ins = total_check_ins + 1,
        last_heartbeat = NOW(),
        updated_at = NOW()
    WHERE id = p_station_id;
    
    -- Return success
    RETURN jsonb_build_object(
        'success', true,
        'check_in_log_id', v_check_in_log_id,
        'ticket_id', p_ticket_id,
        'attendee_name', v_ticket.full_name,
        'attendee_email', v_ticket.email,
        'checked_in_at', NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update check-in stations last_heartbeat
CREATE OR REPLACE FUNCTION update_station_heartbeat()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE check_in_stations
    SET last_heartbeat = NOW()
    WHERE id = NEW.station_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_station_heartbeat
AFTER INSERT ON check_in_logs
FOR EACH ROW
EXECUTE FUNCTION update_station_heartbeat();

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON check_in_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION process_check_in TO authenticated;


-- =====================================================
-- MIGRATION: Add Profile QR Codes
-- Description: Add profile_qr_code field to em_profiles table
--              to support universal user QR codes for check-in
-- =====================================================

-- Add profile_qr_code column to em_profiles table
ALTER TABLE em_profiles
ADD COLUMN IF NOT EXISTS profile_qr_code TEXT;

-- Add index for faster QR code lookups
CREATE INDEX IF NOT EXISTS idx_em_profiles_profile_qr_code 
ON em_profiles(profile_qr_code);

-- Add comment to document the field
COMMENT ON COLUMN em_profiles.profile_qr_code IS 
'Universal QR code for user profile - used for check-in across all events. JSON string containing user_id and timestamp.';

-- Create function to generate profile QR code data
CREATE OR REPLACE FUNCTION generate_profile_qr_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    qr_data JSONB;
BEGIN
    qr_data := jsonb_build_object(
        'type', 'profile',
        'user_id', user_id,
        'timestamp', NOW()
    );
    
    RETURN qr_data::TEXT;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate QR code on profile creation
CREATE OR REPLACE FUNCTION auto_generate_profile_qr()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if profile_qr_code is NULL
    IF NEW.profile_qr_code IS NULL THEN
        NEW.profile_qr_code := generate_profile_qr_code(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate QR code on INSERT
DROP TRIGGER IF EXISTS trigger_auto_generate_profile_qr ON em_profiles;
CREATE TRIGGER trigger_auto_generate_profile_qr
    BEFORE INSERT ON em_profiles
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_profile_qr();

-- Backfill existing profiles with QR codes
UPDATE em_profiles
SET profile_qr_code = generate_profile_qr_code(id)
WHERE profile_qr_code IS NULL;

-- Add RLS policies for profile QR codes
-- Users can view their own profile QR code
DROP POLICY IF EXISTS "em_profiles_users_view_own_qr" ON em_profiles;
CREATE POLICY "em_profiles_users_view_own_qr"
ON em_profiles FOR SELECT
USING (auth.uid() = id);

-- Admins can view all profile QR codes
DROP POLICY IF EXISTS "em_profiles_admins_view_all_qr" ON em_profiles;
CREATE POLICY "em_profiles_admins_view_all_qr"
ON em_profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM em_profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    )
);

-- Users can update their own profile (including regenerating QR code if needed)
DROP POLICY IF EXISTS "em_profiles_users_update_own" ON em_profiles;
CREATE POLICY "em_profiles_users_update_own"
ON em_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);


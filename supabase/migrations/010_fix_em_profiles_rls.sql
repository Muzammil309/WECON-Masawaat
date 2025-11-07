-- =====================================================
-- Migration: Fix em_profiles RLS Policies
-- Description: Add missing RLS policies to allow users to read their own profile
-- Version: 010
-- Date: 2025-11-07
-- =====================================================

-- Enable RLS on em_profiles (if not already enabled)
ALTER TABLE em_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own profile" ON em_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON em_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON em_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON em_profiles;
DROP POLICY IF EXISTS "Anyone can insert their own profile" ON em_profiles;

-- =====================================================
-- RLS POLICIES FOR em_profiles
-- =====================================================

-- Policy 1: Users can view their own profile (CRITICAL FOR AUTH)
CREATE POLICY "Users can view their own profile"
  ON em_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON em_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON em_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 4: Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON em_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM em_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 5: Anyone can insert their own profile (for signup)
CREATE POLICY "Anyone can insert their own profile"
  ON em_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration 010 completed successfully!';
  RAISE NOTICE '✅ RLS policies added to em_profiles table';
  RAISE NOTICE '✅ Users can now read their own profile (including role)';
  RAISE NOTICE '✅ Admins can view and update all profiles';
END $$;


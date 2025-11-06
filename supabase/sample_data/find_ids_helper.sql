-- =====================================================
-- HELPER SCRIPT TO FIND REQUIRED IDs
-- =====================================================
-- Run these queries in Supabase SQL Editor to find the IDs
-- you need to replace in the sample data script.
-- =====================================================

-- =====================================================
-- 1. FIND EVENT ID
-- =====================================================
-- This will show you all events in your database
-- Copy the 'id' value from the event you want to use
SELECT 
  id as event_id,
  name as event_name,
  start_date,
  end_date,
  status
FROM em_events
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- 2. FIND USER ID (for created_by field)
-- =====================================================
-- This will show you admin users
-- Copy the 'id' value from your admin user
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email LIKE '%admin%' OR email LIKE '%@%'
ORDER BY created_at DESC
LIMIT 10;

-- Alternative: Get the first user (if you only have one user)
SELECT 
  id as user_id,
  email
FROM auth.users
LIMIT 1;

-- =====================================================
-- 3. VERIFY TABLES EXIST
-- =====================================================
-- This will confirm all 7 tables were created successfully
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name LIKE 'em_%'
  AND table_name IN (
    'em_conference_sessions',
    'em_learning_labs',
    'em_roundtables',
    'em_skill_clinics',
    'em_startup_stories',
    'em_exhibitors',
    'em_food_vendors'
  )
ORDER BY table_name;

-- =====================================================
-- 4. CHECK IF SAMPLE DATA ALREADY EXISTS
-- =====================================================
-- Run this to see if you've already inserted sample data
SELECT 
  'em_conference_sessions' as table_name, COUNT(*) as record_count FROM em_conference_sessions
UNION ALL
SELECT 'em_learning_labs', COUNT(*) FROM em_learning_labs
UNION ALL
SELECT 'em_roundtables', COUNT(*) FROM em_roundtables
UNION ALL
SELECT 'em_skill_clinics', COUNT(*) FROM em_skill_clinics
UNION ALL
SELECT 'em_startup_stories', COUNT(*) FROM em_startup_stories
UNION ALL
SELECT 'em_exhibitors', COUNT(*) FROM em_exhibitors
UNION ALL
SELECT 'em_food_vendors', COUNT(*) FROM em_food_vendors;

-- =====================================================
-- NEXT STEPS:
-- =====================================================
-- 1. Run queries 1 and 2 above to get your event_id and user_id
-- 2. Open event_management_sample_data.sql
-- 3. Use Find & Replace (Ctrl+H) to replace:
--    - 'YOUR_EVENT_ID_HERE' with your actual event_id
--    - 'YOUR_USER_ID_HERE' with your actual user_id
-- 4. Run the modified event_management_sample_data.sql script
-- 5. Run query 4 above to verify data was inserted
-- =====================================================


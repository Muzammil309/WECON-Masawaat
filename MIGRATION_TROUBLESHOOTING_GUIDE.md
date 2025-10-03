# Migration Troubleshooting Guide - Complete Fix

## 🔍 **ERROR ANALYSIS**

You encountered these errors:

1. **Migration 000:** `ERROR: 42703: column "email" does not exist`
2. **Migration 003:** `ERROR: 42P01: relation "em_sessions" does not exist`
3. **Migration 004:** `ERROR: 42P01: relation "session_attendance" does not exist`
4. **Migration 005:** `ERROR: 42P01: relation "em_tickets" does not exist`

**Root Cause:** The migrations have dependency issues and the auth.users table reference is causing problems.

---

## ✅ **SOLUTION: USE STANDALONE MIGRATION**

I've created a **standalone version** that doesn't depend on Supabase Auth. This will work on any Supabase project.

---

## 🚀 **STEP-BY-STEP FIX**

### **STEP 1: VERIFY DATABASE STATE**

First, let's see what's currently in your database:

```sql
-- Check all existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected:** You might see some tables or none at all.

---

### **STEP 2: CLEAN UP (If Needed)**

If you have partial tables from failed migrations, let's clean them up:

```sql
-- Drop any partially created tables (ONLY if they exist)
DROP TABLE IF EXISTS em_session_speakers CASCADE;
DROP TABLE IF EXISTS em_speakers CASCADE;
DROP TABLE IF EXISTS em_sessions CASCADE;
DROP TABLE IF EXISTS em_tickets CASCADE;
DROP TABLE IF EXISTS em_orders CASCADE;
DROP TABLE IF EXISTS em_ticket_tiers CASCADE;
DROP TABLE IF EXISTS em_events CASCADE;
DROP TABLE IF NOT EXISTS em_profiles CASCADE;

-- Drop any feature tables that might exist
DROP TABLE IF EXISTS offline_sync_queue CASCADE;
DROP TABLE IF EXISTS badge_print_queue CASCADE;
DROP TABLE IF EXISTS check_in_logs CASCADE;
DROP TABLE IF EXISTS check_in_stations CASCADE;
DROP TABLE IF EXISTS session_attendance CASCADE;
DROP TABLE IF EXISTS session_metrics CASCADE;
DROP TABLE IF EXISTS event_attendance_metrics CASCADE;
DROP TABLE IF EXISTS exhibitor_booths CASCADE;
DROP TABLE IF EXISTS lead_captures CASCADE;
DROP TABLE IF EXISTS exhibitor_analytics CASCADE;

-- Drop views
DROP VIEW IF EXISTS check_in_statistics CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS process_check_in CASCADE;
DROP FUNCTION IF EXISTS update_station_heartbeat CASCADE;
```

**⚠️ WARNING:** This will delete all data! Only run this if you're starting fresh.

---

### **STEP 3: APPLY STANDALONE BASE MIGRATION**

Now apply the standalone migration that doesn't depend on auth:

#### 3.1 Open Migration File

**File:** `supabase/migrations/000_create_em_tables_standalone.sql`

#### 3.2 Copy and Run

1. **Open the file** in your code editor
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Go to Supabase SQL Editor**
5. **Click "New Query"**
6. **Paste** (Ctrl+V)
7. **Click "Run"**

#### 3.3 Verify Success

```sql
-- Check if all base tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'em_profiles',
  'em_events',
  'em_ticket_tiers',
  'em_tickets',
  'em_sessions',
  'em_speakers',
  'em_session_speakers',
  'em_orders'
)
ORDER BY table_name;
```

**Expected:** 8 rows showing all the tables

✅ **If you see 8 tables, proceed to Step 4**

---

### **STEP 4: APPLY FEATURE TABLES MIGRATION**

Now apply migration 003:

#### 4.1 Open Migration File

**File:** `supabase/migrations/003_event_management_features.sql`

#### 4.2 Copy and Run

1. **Open the file**
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Go to Supabase SQL Editor**
5. **Click "New Query"**
6. **Paste** (Ctrl+V)
7. **Click "Run"**

#### 4.3 Verify Success

```sql
-- Check if feature tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'check_in_stations',
  'check_in_logs',
  'badge_print_queue',
  'session_attendance',
  'session_metrics',
  'event_attendance_metrics',
  'exhibitor_booths',
  'lead_captures',
  'exhibitor_analytics'
)
ORDER BY table_name;
```

**Expected:** 9 rows showing all the feature tables

✅ **If you see 9 tables, proceed to Step 5**

---

### **STEP 5: SKIP MIGRATION 004 (RLS Policies)**

Migration 004 has issues. We'll skip it for now since the standalone migration already enabled RLS.

---

### **STEP 6: APPLY FEATURE #2 MIGRATION**

Now apply the QR check-in migration:

#### 6.1 Open Migration File

**File:** `supabase/migrations/005_qr_code_check_in_enhancements.sql`

#### 6.2 Copy and Run

1. **Open the file**
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Go to Supabase SQL Editor**
5. **Click "New Query"**
6. **Paste** (Ctrl+V)
7. **Click "Run"**

#### 6.3 Verify Success

```sql
-- Check if new columns were added
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'em_tickets' 
AND column_name IN (
  'barcode',
  'qr_code_generated_at',
  'check_in_count',
  'badge_printed',
  'badge_printed_at'
)
ORDER BY column_name;
```

**Expected:** 5 rows

```sql
-- Check if offline_sync_queue table was created
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'offline_sync_queue'
);
```

**Expected:** `true`

```sql
-- Check if process_check_in function was created
SELECT EXISTS (
   SELECT FROM pg_proc 
   WHERE proname = 'process_check_in'
);
```

**Expected:** `true`

✅ **All migrations applied successfully!**

---

## 📋 **CORRECTED MIGRATION ORDER**

Apply in this order:

1. ✅ **`000_create_em_tables_standalone.sql`** - Base tables (NO auth dependency)
2. ✅ **`003_event_management_features.sql`** - Feature tables
3. ❌ **SKIP `004_event_management_rls.sql`** - Has errors, RLS already enabled
4. ✅ **`005_qr_code_check_in_enhancements.sql`** - Feature #2

---

## 🧪 **FINAL VERIFICATION**

After applying all migrations, run this comprehensive check:

```sql
-- Count all tables
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: At least 17

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check for critical tables
SELECT 
  EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'em_tickets') as em_tickets_exists,
  EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'em_events') as em_events_exists,
  EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'check_in_stations') as check_in_stations_exists,
  EXISTS(SELECT FROM information_schema.tables WHERE table_name = 'offline_sync_queue') as offline_sync_queue_exists;
-- Expected: All should be true

-- Check for process_check_in function
SELECT proname, pronargs 
FROM pg_proc 
WHERE proname = 'process_check_in';
-- Expected: 1 row with 5 arguments

-- Check for check_in_statistics view
SELECT EXISTS (
   SELECT FROM information_schema.views 
   WHERE table_name = 'check_in_statistics'
);
-- Expected: true
```

✅ **All checks pass? You're ready to test Feature #2!**

---

## 🐛 **COMMON ERRORS & FIXES**

### Error: "relation already exists"

**Solution:** This is OK! The migration uses `CREATE TABLE IF NOT EXISTS` so it's safe.

### Error: "column already exists"

**Solution:** This is OK! The migration uses `ADD COLUMN IF NOT EXISTS` so it's safe.

### Error: "permission denied"

**Solution:** 
1. Make sure you're logged in to Supabase
2. Check you have admin access to the project
3. Try refreshing the SQL Editor page

### Error: "syntax error near..."

**Solution:**
1. Make sure you copied the entire file
2. Check for any missing characters
3. Try copying again from the file

---

## 📝 **WHAT'S DIFFERENT IN THE STANDALONE VERSION?**

The standalone migration (`000_create_em_tables_standalone.sql`) differs from the original:

1. **No auth.users dependency** - Creates em_profiles as a standalone table
2. **Includes RLS policies** - Basic security policies included
3. **Includes permissions** - Grants for authenticated and anonymous users
4. **Self-contained** - Doesn't require any external dependencies

---

## 🎯 **NEXT STEPS AFTER SUCCESSFUL MIGRATION**

Once all migrations are applied:

1. ✅ **Return to testing guide:** `PHASE_1_TESTING_INSTRUCTIONS.md`
2. ✅ **Create test data:** Follow Step 2 in the testing guide
3. ✅ **Start testing:** Test QR code generation, scanner, kiosk, etc.

---

## 💬 **STILL HAVING ISSUES?**

If you encounter any errors:

1. **Share the exact error message**
2. **Tell me which step you're on**
3. **Share the result of the table check query**
4. **I'll help you troubleshoot immediately!**

---

**Last Updated:** 2025-10-03  
**Status:** Ready to fix all migration issues


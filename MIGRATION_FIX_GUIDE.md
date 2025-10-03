# Migration Fix Guide - Resolving "em_tickets does not exist" Error

## 🔍 **PROBLEM DIAGNOSIS**

**Error:** `ERROR: 42P01: relation "em_tickets" does not exist`

**Root Cause:** The Feature #2 migration (`005_qr_code_check_in_enhancements.sql`) requires the `em_tickets` table to exist, but it hasn't been created yet.

---

## ✅ **SOLUTION: APPLY MIGRATIONS IN CORRECT ORDER**

Follow these steps carefully:

---

### **STEP 1: CHECK CURRENT DATABASE STATE**

Run this query in Supabase SQL Editor to see what tables exist:

```sql
-- Check for em_* tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE 'em_%'
ORDER BY table_name;
```

**Possible Results:**

**Scenario A:** No rows returned (no `em_*` tables exist)
→ **Action:** Apply migrations 000, 003, 004, then 005

**Scenario B:** Some `em_*` tables exist (e.g., em_events, em_profiles)
→ **Action:** Check which tables are missing and apply appropriate migrations

**Scenario C:** All base `em_*` tables exist (em_events, em_profiles, em_tickets, em_sessions, etc.)
→ **Action:** Skip to migration 005

---

### **STEP 2: APPLY BASE SCHEMA MIGRATION (If Scenario A)**

If you have NO `em_*` tables, apply this migration first:

#### 2.1 Open Migration File

**File:** `supabase/migrations/000_create_em_tables.sql`

#### 2.2 Copy and Run

1. **Open the file** in your code editor
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Go to Supabase SQL Editor**
5. **Click "New Query"**
6. **Paste** (Ctrl+V)
7. **Click "Run"**

#### 2.3 Verify Success

Run this verification query:

```sql
-- Verify em_* tables were created
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
  'em_orders'
)
ORDER BY table_name;
```

**Expected:** 7 rows showing all the tables

✅ **If you see 7 tables, proceed to Step 3**

---

### **STEP 3: APPLY FEATURE TABLES MIGRATION**

Now apply migration 003 which creates check-in stations, badge queue, and exhibitor tables:

#### 3.1 Open Migration File

**File:** `supabase/migrations/003_event_management_features.sql`

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
-- Verify feature tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'check_in_stations',
  'check_in_logs',
  'badge_print_queue',
  'exhibitor_booths',
  'lead_captures',
  'session_attendance',
  'session_metrics'
)
ORDER BY table_name;
```

**Expected:** 7 rows showing all the feature tables

✅ **If you see 7 tables, proceed to Step 4**

---

### **STEP 4: APPLY RLS POLICIES (Optional but Recommended)**

Apply Row Level Security policies:

#### 4.1 Open Migration File

**File:** `supabase/migrations/004_event_management_rls.sql`

#### 4.2 Copy and Run

1. **Open the file** in your code editor
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Go to Supabase SQL Editor**
5. **Click "New Query"**
6. **Paste** (Ctrl+V)
7. **Click "Run"**

#### 4.3 Verify Success

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename LIKE 'em_%'
ORDER BY tablename;
```

**Expected:** All tables should show `rowsecurity = true`

✅ **RLS policies applied successfully**

---

### **STEP 5: APPLY FEATURE #2 MIGRATION (QR Check-in)**

Now you can apply the Feature #2 migration:

#### 5.1 Open Migration File

**File:** `supabase/migrations/005_qr_code_check_in_enhancements.sql`

#### 5.2 Copy and Run

1. **Open the file** in your code editor
2. **Select all** (Ctrl+A)
3. **Copy** (Ctrl+C)
4. **Go to Supabase SQL Editor**
5. **Click "New Query"**
6. **Paste** (Ctrl+V)
7. **Click "Run"**

#### 5.3 Verify Success

```sql
-- Check if new columns were added to em_tickets
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

**Expected:** 5 rows showing all the new columns

```sql
-- Check if offline_sync_queue table was created
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_name = 'offline_sync_queue'
) as offline_sync_queue_exists;
```

**Expected:** `true`

```sql
-- Check if process_check_in function was created
SELECT EXISTS (
   SELECT FROM pg_proc 
   WHERE proname = 'process_check_in'
) as function_exists;
```

**Expected:** `true`

✅ **Feature #2 migration applied successfully!**

---

## 📋 **MIGRATION ORDER SUMMARY**

Apply in this exact order:

1. ✅ **`000_create_em_tables.sql`** - Base tables (em_events, em_tickets, etc.)
2. ✅ **`003_event_management_features.sql`** - Feature tables (check-in, badges, exhibitors)
3. ✅ **`004_event_management_rls.sql`** - Row Level Security policies
4. ✅ **`005_qr_code_check_in_enhancements.sql`** - Feature #2 enhancements

**Note:** Migrations 001 and 002 are for the old schema (without `em_` prefix) and are not needed.

---

## 🧪 **FINAL VERIFICATION**

After applying all migrations, run this comprehensive check:

```sql
-- Count all em_* tables
SELECT COUNT(*) as total_em_tables
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name LIKE 'em_%';
-- Expected: At least 7

-- Count feature tables
SELECT COUNT(*) as total_feature_tables
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN (
  'check_in_stations',
  'check_in_logs',
  'badge_print_queue',
  'offline_sync_queue',
  'exhibitor_booths',
  'lead_captures'
);
-- Expected: 6

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

## 🐛 **TROUBLESHOOTING**

### Error: "relation already exists"

**Solution:** This is OK! It means the table was already created. The migration uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times.

### Error: "column already exists"

**Solution:** This is OK! The migration uses `ADD COLUMN IF NOT EXISTS` so it's safe to run multiple times.

### Error: "permission denied"

**Solution:** Make sure you're logged in to Supabase with the correct account and have admin access to the project.

### Error: "syntax error"

**Solution:** Make sure you copied the entire migration file. Check for any missing characters at the beginning or end.

---

## 📝 **NEXT STEPS AFTER MIGRATION**

Once all migrations are applied successfully:

1. ✅ **Return to testing guide:** `PHASE_1_TESTING_INSTRUCTIONS.md`
2. ✅ **Continue from Step 2:** Create test data
3. ✅ **Start testing:** Follow the testing checklist

---

## 💬 **NEED HELP?**

If you encounter any issues:

1. **Share the exact error message**
2. **Tell me which migration you're running**
3. **Share the result of the table check query**
4. **I'll help you troubleshoot!**

---

**Last Updated:** 2025-10-03  
**Status:** Ready to fix migration issues


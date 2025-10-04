# Supabase Setup Guide - Phase 1, Feature 1

## Quick Setup Checklist

Follow these steps to set up the enhanced profile and gamification system:

---

## ✅ Step 1: Run Database Migration

### Option A: Via Supabase CLI (Recommended)

```bash
# 1. Install Supabase CLI if not already installed
npm install -g supabase

# 2. Link to your project
supabase link --project-ref umywdcihtqfullbostxo

# 3. Run the migration
supabase db push
```

### Option B: Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/sql
2. Click "New Query"
3. Copy the entire contents of `supabase/migrations/001_enhanced_profiles_and_gamification.sql`
4. Paste into the SQL editor
5. Click "Run" or press Ctrl+Enter
6. Verify success message appears

---

## ✅ Step 2: Create Storage Bucket for Avatars

### Via Supabase Dashboard:

1. **Navigate to Storage:**
   - Go to: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/storage/buckets
   - Click "Create a new bucket"

2. **Configure Bucket:**
   - Name: `avatars`
   - Public bucket: ✅ **Yes** (check this box)
   - File size limit: `2097152` (2MB in bytes)
   - Allowed MIME types: `image/jpeg,image/png,image/webp,image/gif`
   - Click "Create bucket"

3. **Add Storage Policies:**
   - Click on the `avatars` bucket
   - Go to "Policies" tab
   - Click "New Policy"

**Policy 1: Upload Own Avatar**
```sql
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: View All Avatars**
```sql
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Policy 3: Update Own Avatar**
```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 4: Delete Own Avatar**
```sql
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## ✅ Step 3: Verify Database Tables

Run this query in SQL Editor to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('em_profiles', 'em_badges', 'em_user_badges', 'em_points')
ORDER BY table_name;
```

**Expected Output:**
```
em_badges
em_points
em_profiles
em_user_badges
```

---

## ✅ Step 4: Verify Default Badges

Run this query to check if default badges were inserted:

```sql
SELECT name, category, points, rarity 
FROM em_badges 
WHERE is_active = true
ORDER BY points DESC;
```

**Expected Output:** 10 badges including:
- Perfect Attendance (300 pts, legendary)
- VIP Attendee (200 pts, epic)
- Speaker Star (150 pts, rare)
- Networking Pro (100 pts, rare)
- etc.

---

## ✅ Step 5: Test Profile Extension

Run this query to verify new columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'em_profiles' 
AND column_name IN (
  'company', 'bio', 'networking_interests', 
  'linkedin_url', 'total_points', 'profile_completed'
)
ORDER BY column_name;
```

**Expected Output:** All 6 columns should be listed

---

## ✅ Step 6: Configure OAuth Providers (Optional)

### Google OAuth

1. **Create Google OAuth Credentials:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: `https://umywdcihtqfullbostxo.supabase.co/auth/v1/callback`

2. **Configure in Supabase:**
   - Go to: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/auth/providers
   - Find "Google" provider
   - Toggle "Enable"
   - Paste Client ID and Client Secret
   - Click "Save"

### LinkedIn OAuth

1. **Create LinkedIn App:**
   - Go to: https://www.linkedin.com/developers/apps
   - Create new app
   - Add redirect URL: `https://umywdcihtqfullbostxo.supabase.co/auth/v1/callback`

2. **Configure in Supabase:**
   - Enable LinkedIn provider
   - Add Client ID and Client Secret
   - Save

### GitHub OAuth

1. **Create GitHub OAuth App:**
   - Go to: https://github.com/settings/developers
   - New OAuth App
   - Authorization callback URL: `https://umywdcihtqfullbostxo.supabase.co/auth/v1/callback`

2. **Configure in Supabase:**
   - Enable GitHub provider
   - Add Client ID and Client Secret
   - Save

---

## ✅ Step 7: Test the Implementation

### Test 1: Access Profile Page
```
URL: http://localhost:3000/dashboard/profile
Expected: Profile page loads with user data
```

### Test 2: Upload Avatar
```
1. Click camera icon on avatar
2. Select image file
3. Click Upload
Expected: Avatar updates successfully
```

### Test 3: Edit Profile
```
1. Fill in profile fields
2. Add networking interests
3. Click Save
Expected: Success toast appears
```

---

## 🔍 Verification Queries

### Check User Profile Data
```sql
SELECT 
  id, 
  email, 
  full_name, 
  company, 
  total_points, 
  profile_completed,
  array_length(networking_interests, 1) as interests_count
FROM em_profiles
WHERE id = auth.uid();
```

### Check User Badges
```sql
SELECT 
  ub.earned_at,
  b.name,
  b.points,
  b.rarity
FROM em_user_badges ub
JOIN em_badges b ON b.id = ub.badge_id
WHERE ub.user_id = auth.uid()
ORDER BY ub.earned_at DESC;
```

### Check Points History
```sql
SELECT 
  activity_type,
  points,
  created_at,
  metadata
FROM em_points
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🐛 Common Issues & Solutions

### Issue: Migration fails with "relation already exists"
**Solution:** Tables already exist. Skip migration or drop tables first:
```sql
DROP TABLE IF EXISTS em_points CASCADE;
DROP TABLE IF EXISTS em_user_badges CASCADE;
DROP TABLE IF EXISTS em_badges CASCADE;
-- Then run migration again
```

### Issue: Avatar upload returns 404
**Solution:** 
1. Verify `avatars` bucket exists
2. Check bucket is public
3. Verify storage policies are created

### Issue: Cannot view other users' profiles
**Solution:** Check RLS policies allow SELECT on em_profiles

### Issue: Points not updating automatically
**Solution:** Verify trigger exists:
```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'em_points';
```

### Issue: Default badges not inserted
**Solution:** Run insert statement manually:
```sql
-- Copy INSERT statement from migration file
```

---

## 📊 Database Schema Diagram

```
em_profiles (extended)
├── id (UUID, PK)
├── email (VARCHAR)
├── full_name (VARCHAR)
├── avatar_url (VARCHAR)
├── company (VARCHAR) ← NEW
├── bio (TEXT) ← NEW
├── networking_interests (JSONB) ← NEW
├── linkedin_url (VARCHAR) ← NEW
├── total_points (INTEGER) ← NEW
└── profile_completed (BOOLEAN) ← NEW

em_badges
├── id (UUID, PK)
├── name (VARCHAR, UNIQUE)
├── description (TEXT)
├── icon (VARCHAR)
├── category (VARCHAR)
├── points (INTEGER)
├── criteria (JSONB)
└── rarity (VARCHAR)

em_user_badges
├── id (UUID, PK)
├── user_id (UUID, FK → em_profiles)
├── badge_id (UUID, FK → em_badges)
├── earned_at (TIMESTAMPTZ)
└── is_displayed (BOOLEAN)

em_points
├── id (UUID, PK)
├── user_id (UUID, FK → em_profiles)
├── event_id (UUID, FK → em_events)
├── activity_type (VARCHAR)
├── points (INTEGER)
└── metadata (JSONB)
```

---

## ✅ Final Checklist

Before proceeding to next feature, verify:

- [ ] Database migration completed successfully
- [ ] All 4 tables exist (em_profiles extended, em_badges, em_user_badges, em_points)
- [ ] 10 default badges inserted
- [ ] `avatars` storage bucket created and public
- [ ] 4 storage policies configured
- [ ] Profile page accessible at `/dashboard/profile`
- [ ] Avatar upload works
- [ ] Profile editing saves successfully
- [ ] Badges tab displays correctly
- [ ] Activity tab shows points history
- [ ] Profile completion percentage calculates correctly
- [ ] OAuth providers configured (optional)

---

## 📞 Need Help?

If you encounter issues:

1. Check Supabase logs: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/logs
2. Verify RLS policies are enabled
3. Check browser console for errors
4. Review migration SQL for syntax errors
5. Ensure Supabase project is active and not paused

---

**Setup Status:** Ready for testing  
**Next Step:** Test all features, then proceed to Phase 1, Feature 2


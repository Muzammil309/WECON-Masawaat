# Phase 1, Feature 1: Enhanced Authentication & User Management

## ✅ Implementation Complete

This document covers the implementation of enhanced user profiles, gamification system, and profile management features.

---

## 📋 Features Implemented

### 1. Extended Profile Schema
- ✅ Added networking fields to `em_profiles` table
- ✅ Company, bio, job title, location, phone
- ✅ Social links (LinkedIn, Twitter, GitHub, Website)
- ✅ Networking interests (JSONB array)
- ✅ Gamification fields (total_points, profile_completed)
- ✅ User preferences (JSONB for settings)

### 2. Gamification System
- ✅ Created `em_badges` table with 10 default badges
- ✅ Created `em_user_badges` junction table
- ✅ Created `em_points` table for activity tracking
- ✅ Automatic point calculation with triggers
- ✅ Badge rarity system (common, rare, epic, legendary)

### 3. Profile Management UI
- ✅ Profile page at `/dashboard/profile`
- ✅ Avatar upload with Supabase Storage
- ✅ Editable profile form with validation
- ✅ Networking interests management
- ✅ Badges display with earned dates
- ✅ Points history timeline
- ✅ Profile completion indicator

---

## 🗄️ Database Schema

### Tables Created

#### 1. em_profiles (Extended)
```sql
ALTER TABLE em_profiles ADD COLUMN:
- company VARCHAR(255)
- bio TEXT
- networking_interests JSONB
- linkedin_url VARCHAR(500)
- twitter_url VARCHAR(500)
- github_url VARCHAR(500)
- website_url VARCHAR(500)
- phone VARCHAR(50)
- job_title VARCHAR(255)
- location VARCHAR(255)
- timezone VARCHAR(100)
- preferences JSONB
- total_points INTEGER
- profile_completed BOOLEAN
```

#### 2. em_badges
```sql
CREATE TABLE em_badges (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  category VARCHAR(50),
  points INTEGER,
  criteria JSONB,
  rarity VARCHAR(20),
  color VARCHAR(20),
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

#### 3. em_user_badges
```sql
CREATE TABLE em_user_badges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES em_profiles(id),
  badge_id UUID REFERENCES em_badges(id),
  earned_at TIMESTAMPTZ,
  progress JSONB,
  is_displayed BOOLEAN,
  UNIQUE(user_id, badge_id)
)
```

#### 4. em_points
```sql
CREATE TABLE em_points (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES em_profiles(id),
  event_id UUID REFERENCES em_events(id),
  activity_type VARCHAR(50),
  points INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
```

### RLS Policies

**em_badges:**
- Anyone can view active badges
- Only admins can manage badges

**em_user_badges:**
- Users can view their own badges
- Users can view others' displayed badges
- Users can update their badge display settings

**em_points:**
- Users can view their own points
- Admins can view all points

---

## 📁 Files Created

### Database Migration
- `supabase/migrations/001_enhanced_profiles_and_gamification.sql`

### TypeScript Types
- `src/types/profile.ts`

### Pages
- `src/app/dashboard/profile/page.tsx`

### Components
- `src/components/profile/profile-header.tsx`
- `src/components/profile/profile-form.tsx`
- `src/components/profile/avatar-upload-dialog.tsx`
- `src/components/profile/badges-section.tsx`
- `src/components/profile/points-history.tsx`

---

## 🚀 Setup Instructions

### Step 1: Run Database Migration

```bash
# Connect to your Supabase project
supabase link --project-ref umywdcihtqfullbostxo

# Run the migration
supabase db push
```

**Or manually via Supabase Dashboard:**
1. Go to https://supabase.com/dashboard/project/umywdcihtqfullbostxo
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/001_enhanced_profiles_and_gamification.sql`
4. Execute the SQL

### Step 2: Create Storage Bucket

**Via Supabase Dashboard:**
1. Go to Storage → Create bucket
2. Bucket name: `avatars`
3. Public bucket: ✅ Yes
4. File size limit: 2MB
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

**Storage Policies (add via Dashboard):**

```sql
-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Anyone can view avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Configure OAuth Providers (Optional)

**Google OAuth:**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add OAuth credentials from Google Cloud Console
4. Set redirect URL: `https://umywdcihtqfullbostxo.supabase.co/auth/v1/callback`

**LinkedIn OAuth:**
1. Enable LinkedIn provider in Supabase
2. Add OAuth credentials from LinkedIn Developer Portal
3. Set redirect URL

**GitHub OAuth:**
1. Enable GitHub provider in Supabase
2. Add OAuth credentials from GitHub Settings
3. Set redirect URL

---

## 🧪 Testing Guide

### Test 1: Profile Page Access
1. Login to the application
2. Navigate to `/dashboard/profile`
3. **Expected:** Profile page loads with your information

### Test 2: Avatar Upload
1. Click camera icon on avatar
2. Select an image file (< 2MB)
3. Click "Upload"
4. **Expected:** Avatar updates successfully

### Test 3: Profile Editing
1. Edit profile fields (name, company, bio, etc.)
2. Add networking interests
3. Click "Save Changes"
4. **Expected:** Profile updates successfully

### Test 4: Badges Display
1. Go to "Badges" tab
2. **Expected:** Shows earned badges (if any) or empty state

### Test 5: Activity History
1. Go to "Activity" tab
2. **Expected:** Shows points history (if any) or empty state

### Test 6: Profile Completion
1. Check profile completion percentage in header
2. Fill in missing fields
3. **Expected:** Percentage increases

---

## 🎯 Default Badges

The migration creates 10 default badges:

1. **Early Bird** (50 pts) - Registered 30+ days in advance
2. **Networking Pro** (100 pts) - Connected with 10+ attendees
3. **Session Enthusiast** (75 pts) - Attended 5+ sessions
4. **Question Master** (60 pts) - Asked 3+ questions
5. **Poll Participant** (40 pts) - Voted in 5+ polls
6. **VIP Attendee** (200 pts) - Purchased VIP ticket
7. **Speaker Star** (150 pts) - Delivered a session
8. **Resource Hunter** (50 pts) - Downloaded 10+ resources
9. **Sponsor Supporter** (80 pts) - Visited 5+ booths
10. **Perfect Attendance** (300 pts) - Attended all sessions

---

## 📊 Activity Points System

Points are awarded for various activities:

| Activity | Points |
|----------|--------|
| Session Attendance | 10 |
| Networking Connection | 15 |
| Poll Participation | 5 |
| Question Asked | 8 |
| Resource Download | 3 |
| Booth Visit | 12 |
| Profile Completion | 50 |
| Event Registration | 20 |
| Referral | 25 |
| Social Share | 10 |

---

## 🔧 API Usage Examples

### Award Points to User

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Award points for session attendance
await supabase.from('em_points').insert({
  user_id: userId,
  event_id: eventId,
  activity_type: 'session_attendance',
  points: 10,
  metadata: {
    session_id: sessionId,
    session_title: 'Introduction to AI'
  }
})

// Total points will auto-update via trigger
```

### Check Badge Eligibility

```typescript
// Get user's activity stats
const { data: stats } = await supabase
  .from('em_points')
  .select('activity_type, count')
  .eq('user_id', userId)

// Check if user qualifies for "Session Enthusiast" badge
const sessionsAttended = stats.filter(s => s.activity_type === 'session_attendance').length

if (sessionsAttended >= 5) {
  // Award badge
  await supabase.from('em_user_badges').insert({
    user_id: userId,
    badge_id: badgeId
  })
}
```

---

## ✅ Verification Checklist

- [ ] Database migration executed successfully
- [ ] `avatars` storage bucket created
- [ ] Storage policies configured
- [ ] Profile page accessible at `/dashboard/profile`
- [ ] Avatar upload works
- [ ] Profile editing works
- [ ] Networking interests can be added/removed
- [ ] Badges display correctly
- [ ] Points history shows activities
- [ ] Profile completion percentage updates
- [ ] RLS policies prevent unauthorized access

---

## 🐛 Troubleshooting

### Issue: Avatar upload fails with 404
**Solution:** Ensure `avatars` bucket exists and storage policies are configured

### Issue: Profile data not loading
**Solution:** Check RLS policies on `em_profiles` table

### Issue: Points not updating
**Solution:** Verify trigger `trigger_update_total_points` exists

### Issue: Badges not displaying
**Solution:** Check `em_badges` table has default badges inserted

---

## 📝 Next Steps

After confirming this feature works:
1. Test with multiple user accounts
2. Verify RLS policies work correctly
3. Test avatar upload with different file types/sizes
4. Confirm profile completion calculation is accurate
5. Ready to proceed to **Phase 1, Feature 2: Advanced Ticketing System**

---

**Status:** ✅ **READY FOR TESTING**  
**Last Updated:** 2025-10-03


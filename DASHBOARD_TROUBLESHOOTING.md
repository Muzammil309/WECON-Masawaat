# 🔧 Dashboard Troubleshooting Guide

## Issue: Dashboard Stuck in Loading State

### Deployment Information
- **Latest Deployment:** GNWQy7X1yweyKzHcdQt9r9TCxaVX
- **Production URL:** https://wecon-masawaaat.vercel.app/dashboard
- **Deployment Time:** 2025-10-03 (Latest)

---

## 🔍 Diagnostic Steps

### Step 1: Check Browser Console
Open the browser console (F12 or Right-click → Inspect → Console) and look for:

1. **JavaScript Errors**
   - Red error messages
   - Failed module imports
   - Component rendering errors

2. **Network Errors**
   - Failed API calls to Supabase
   - 401/403 authentication errors
   - CORS errors

3. **Console Logs**
   - Check for "Session error:" messages
   - Check for "Role fetch error:" messages
   - Check for "Error loading dashboard data:" messages

### Step 2: Check Network Tab
1. Open Network tab in browser DevTools
2. Reload the page
3. Look for:
   - Failed requests (red status codes)
   - Slow requests (> 5 seconds)
   - Blocked requests

### Step 3: Check Authentication State
The dashboard requires:
- ✅ Valid user session
- ✅ User profile in `em_profiles` table
- ✅ Role assigned (attendee, speaker, or admin)

**To verify:**
1. Go to https://wecon-masawaaat.vercel.app/api/diagnostic
2. Check if `status.ready` is `true`
3. Verify environment variables are set

---

## 🐛 Common Issues & Solutions

### Issue 1: Infinite Loading State

**Symptoms:**
- Dashboard shows "Loading your dashboard..." indefinitely
- Spinner keeps spinning
- No content appears

**Possible Causes:**

#### A. Auth Provider Not Resolving
**Check:** Browser console for auth errors

**Solution:**
```typescript
// In auth-provider.tsx, the loading state should eventually become false
// If it doesn't, there's an issue with:
// 1. Supabase session retrieval
// 2. Profile fetch from em_profiles table
// 3. Component mount/unmount race condition
```

**Fix:** Check if user has a profile in `em_profiles` table:
```sql
SELECT * FROM em_profiles WHERE id = 'user-id-here';
```

#### B. Missing User Profile
**Check:** Database for user profile

**Solution:**
```sql
-- Insert missing profile
INSERT INTO em_profiles (id, email, role, created_at, updated_at)
VALUES (
  'user-id-from-auth-users',
  'user@example.com',
  'attendee',
  NOW(),
  NOW()
);
```

#### C. Supabase RLS Policies Blocking Queries
**Check:** Supabase logs for permission errors

**Solution:**
```sql
-- Check RLS policies on em_profiles
SELECT * FROM pg_policies WHERE tablename = 'em_profiles';

-- Ensure SELECT policy allows users to read their own profile
CREATE POLICY "Users can view own profile"
ON em_profiles FOR SELECT
USING (auth.uid() = id);
```

### Issue 2: Component Not Rendering

**Symptoms:**
- Loading completes but dashboard is blank
- No errors in console
- White screen or empty content

**Possible Causes:**

#### A. Missing Component Imports
**Check:** Browser console for module errors

**Solution:**
```bash
# Rebuild the project
npm run build

# Check for import errors
```

#### B. CSS Not Loading
**Check:** Network tab for failed CSS requests

**Solution:**
```bash
# Clear .next cache
rm -rf .next

# Rebuild
npm run build
```

### Issue 3: Data Not Loading

**Symptoms:**
- Dashboard renders but shows empty states
- "No upcoming events" everywhere
- KPI cards show 0

**Possible Causes:**

#### A. No Data in Database
**Check:** Database tables for data

**Solution:**
```sql
-- Check if user has tickets
SELECT * FROM em_tickets 
WHERE order_id IN (
  SELECT id FROM em_orders WHERE user_id = 'user-id-here'
);

-- Check if there are published events
SELECT * FROM em_events WHERE status = 'published';
```

#### B. Supabase Query Errors
**Check:** Browser console for query errors

**Solution:**
- Check RLS policies on `em_tickets`, `em_orders`, `em_events`
- Verify foreign key relationships
- Check query syntax in `modern-attendee-dashboard.tsx`

---

## 🔧 Quick Fixes

### Fix 1: Clear Browser Cache
```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

### Fix 2: Check Environment Variables
```bash
# Verify in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=https://umywdcihtqfullbostxo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Fix 3: Verify User Session
```javascript
// In browser console
localStorage.getItem('sb-umywdcihtqfullbostxo-auth-token')
```

### Fix 4: Test with Different User
Try logging in with a different test account:
- admin@wecon.events (should redirect to /admin)
- alizeh995@gmail.com (should show attendee dashboard)

---

## 📊 Debugging Code Snippets

### Add Console Logging to Dashboard Page
```typescript
// In src/app/dashboard/page.tsx
export default function DashboardPage() {
  const { user, loading, role } = useAuth()
  
  console.log('Dashboard Debug:', { user: !!user, loading, role })
  
  // ... rest of code
}
```

### Add Console Logging to Modern Dashboard
```typescript
// In modern-attendee-dashboard.tsx
export function ModernAttendeeDashboard() {
  const { user } = useAuth()
  
  useEffect(() => {
    console.log('ModernDashboard mounted, user:', user?.id)
  }, [user])
  
  // ... rest of code
}
```

### Check Supabase Connection
```typescript
// Add to loadDashboardData function
const loadDashboardData = async () => {
  console.log('Loading dashboard data for user:', user?.id)
  
  try {
    const { data, error } = await supabase.from("em_tickets").select("*")
    console.log('Tickets query result:', { data, error })
  } catch (err) {
    console.error('Tickets query failed:', err)
  }
}
```

---

## 🚨 Emergency Rollback

If the dashboard is completely broken, you can rollback to the previous deployment:

### Option 1: Via Vercel Dashboard
1. Go to https://vercel.com/muzammil309s-projects/wecon-masawaaat
2. Click on "Deployments"
3. Find the previous working deployment
4. Click "..." → "Promote to Production"

### Option 2: Via CLI
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

### Option 3: Revert Code Changes
```bash
# Revert to previous commit
git log --oneline
git revert <commit-hash>
git push origin main
```

---

## 📝 Checklist for Production Issues

### Before Reporting Issue
- [ ] Checked browser console for errors
- [ ] Checked network tab for failed requests
- [ ] Verified user is logged in
- [ ] Verified user has profile in em_profiles
- [ ] Checked Supabase connection
- [ ] Tried different browser/incognito mode
- [ ] Cleared browser cache
- [ ] Verified environment variables in Vercel

### Information to Provide
- Browser and version
- Screenshot of console errors
- Screenshot of network tab
- User email/ID experiencing issue
- Steps to reproduce
- Expected vs actual behavior

---

## 🔗 Useful Links

- **Production Dashboard:** https://wecon-masawaaat.vercel.app/dashboard
- **Diagnostic Endpoint:** https://wecon-masawaaat.vercel.app/api/diagnostic
- **Vercel Dashboard:** https://vercel.com/muzammil309s-projects/wecon-masawaaat
- **Supabase Dashboard:** https://supabase.com/dashboard/project/umywdcihtqfullbostxo

---

## 💡 Prevention Tips

### For Future Deployments
1. **Test Locally First**
   ```bash
   npm run dev
   # Test at http://localhost:3000/dashboard
   ```

2. **Build Before Deploy**
   ```bash
   npm run build
   # Check for build errors
   ```

3. **Use Preview Deployments**
   ```bash
   vercel
   # Test preview URL before promoting to production
   ```

4. **Monitor Logs**
   - Check Vercel function logs
   - Check Supabase logs
   - Set up error tracking (Sentry)

---

## 📞 Getting Help

If you're still experiencing issues:

1. **Check Documentation**
   - DASHBOARD_REDESIGN_SUMMARY.md
   - DASHBOARD_QUICK_REFERENCE.md
   - BEFORE_AFTER_COMPARISON.md

2. **Review Code**
   - src/app/dashboard/page.tsx
   - src/components/dashboard/attendee/modern-attendee-dashboard.tsx
   - src/components/providers/auth-provider.tsx

3. **Test Locally**
   ```bash
   npm run dev
   # Access http://localhost:3000/dashboard
   ```

---

**Last Updated:** 2025-10-03  
**Version:** 1.0.0  
**Status:** Active Troubleshooting


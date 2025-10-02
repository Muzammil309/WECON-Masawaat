# Login Testing Guide

## Quick Test Checklist

### ✅ Issue 1: Login Panel Spacing

**What to Check:**
- [ ] Login panel has adequate spacing from header navigation
- [ ] Panel appears centered vertically with proper top padding
- [ ] No cramped appearance

**How to Test:**
1. Navigate to `/auth/login`
2. Visually inspect the spacing between header and login panel
3. Should see approximately 8rem (128px) of top padding

**Expected Result:** ✅ Login panel is well-spaced from header

---

### ✅ Issue 2: Login Redirect

**Test Account:**
- **Email:** `admin@wecon.events`
- **Password:** [Your password]
- **Expected Role:** Admin
- **Expected Redirect:** `/admin`

**How to Test:**

#### Step 1: Open Browser Console
1. Press `F12` to open DevTools
2. Go to "Console" tab
3. Clear any existing logs

#### Step 2: Navigate to Login
1. Go to `/auth/login`
2. Enter credentials:
   - Email: `admin@wecon.events`
   - Password: [Your password]

#### Step 3: Monitor Login Process
1. Click "Sign In" button
2. Watch console logs (should see detailed authentication flow)
3. Watch for toast notification: "Welcome back!"
4. Page should redirect to `/admin` within 1 second

#### Step 4: Verify Redirect
- [ ] Successfully redirected to `/admin` page
- [ ] Admin dashboard loads correctly
- [ ] No errors in console

**Expected Console Output:**
```
Attempting signin with Supabase...
Email: admin@wecon.events
Signin response: { error: null, data: {...} }
User ID: c7e05d60-9c10-4661-aa9b-c3f036fb05b1
Fetching user profile for role-based redirect...
Profile query result: { profile: { role: 'admin' }, profileError: null }
User role: admin
Admin role detected, redirecting to /admin
Final redirect path: /admin
Executing redirect to: /admin
```

---

## Debug Page Testing

### Access Debug Page
Navigate to: `/auth/debug`

### What to Check:
- [ ] ✅ Supabase Configured: Yes
- [ ] ✅ User Authenticated: Yes (if logged in)
- [ ] ✅ User ID: c7e05d60-9c10-4661-aa9b-c3f036fb05b1
- [ ] ✅ Email: admin@wecon.events
- [ ] ✅ Profile Exists: Yes
- [ ] ✅ User Role: admin

### Debug Page Features:
1. **Refresh Status** - Re-check authentication status
2. **Go to Login** - Navigate to login page
3. **Go to Admin/Dashboard** - Navigate to appropriate dashboard based on role

---

## Troubleshooting

### Problem: Login panel still too close to header

**Solution:**
1. Clear browser cache
2. Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
3. Verify `pt-32` class is applied to container

### Problem: Redirect not working

**Check Console Logs:**
1. Look for any JavaScript errors
2. Verify authentication flow logs appear
3. Check if redirect path is logged

**Check Network Tab:**
1. Open DevTools Network tab
2. Look for Supabase API calls
3. Verify authentication tokens are being set

**Use Debug Page:**
1. Navigate to `/auth/debug`
2. Check which authentication step is failing
3. Look for error messages

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "No profile found" | User missing from `em_profiles` table |
| "Could not fetch user profile" | Check Supabase RLS policies |
| Redirect to wrong page | Verify user role in database |
| No redirect at all | Check console for errors, verify middleware |

### Problem: "Invalid login credentials" error

**Solutions:**
1. Verify email is correct: `admin@wecon.events`
2. Check password is correct
3. Try password reset if needed
4. Verify user exists in Supabase auth.users table

---

## Database Verification

### Check User Profile

**SQL Query:**
```sql
SELECT id, role, full_name 
FROM em_profiles 
WHERE id = 'c7e05d60-9c10-4661-aa9b-c3f036fb05b1';
```

**Expected Result:**
```
id: c7e05d60-9c10-4661-aa9b-c3f036fb05b1
role: admin
full_name: Admin
```

### Check User Authentication

**SQL Query:**
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@wecon.events';
```

**Expected Result:**
```
id: c7e05d60-9c10-4661-aa9b-c3f036fb05b1
email: admin@wecon.events
created_at: 2025-09-30 06:35:32.064694+00
```

---

## Test Different User Roles

### Admin User
- **Email:** `admin@wecon.events`
- **Expected Redirect:** `/admin`

### Attendee User
- **Email:** `alisam991@gmail.com`
- **Expected Redirect:** `/dashboard`

### Another Admin User
- **Email:** `admin@changemechanics.pk`
- **Expected Redirect:** `/admin`

---

## Success Criteria

### ✅ Spacing Issue Fixed
- [ ] Login panel has proper top padding
- [ ] Visual separation from header is adequate
- [ ] Panel appears centered and well-positioned

### ✅ Redirect Issue Fixed
- [ ] Login completes successfully
- [ ] Toast notification appears
- [ ] Redirect happens within 1 second
- [ ] Correct dashboard loads based on user role
- [ ] No console errors
- [ ] Debug page shows all green checkmarks

---

## Next Steps After Testing

1. **If all tests pass:**
   - ✅ Mark issues as resolved
   - ✅ Deploy to production
   - ✅ Test on production environment

2. **If tests fail:**
   - 📋 Document specific failure
   - 🔍 Use debug page to identify issue
   - 📝 Check console logs for errors
   - 💬 Report findings for further investigation

---

## Additional Notes

### Browser Compatibility
Test on multiple browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### Mobile Testing
Test on mobile devices:
- [ ] Responsive layout works
- [ ] Spacing is appropriate on mobile
- [ ] Redirect works on mobile browsers

### Performance
- [ ] Login completes in < 2 seconds
- [ ] No unnecessary API calls
- [ ] Smooth redirect transition

---

## Contact

If you encounter any issues during testing:
1. Check the debug page at `/auth/debug`
2. Review console logs
3. Check the `LOGIN_ISSUES_FIX_SUMMARY.md` for detailed information
4. Document the specific error and steps to reproduce


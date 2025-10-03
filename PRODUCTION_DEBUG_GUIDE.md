# Production Login Debug Guide - Step by Step

## 🎯 **SYSTEMATIC DEBUGGING PROCESS**

Follow these steps **in order** to identify the exact failure point.

---

## **STEP 1: VERIFY ENVIRONMENT VARIABLES ARE DEPLOYED**

### **1.1 Check Diagnostic API**

Open this URL in your browser:
```
https://wecon-masawaaat.vercel.app/api/diagnostic
```

**Expected Response (Good):**
```json
{
  "supabase": {
    "url": {
      "configured": true,
      "value": "https://umywdcihtqf...",
      "length": 47
    },
    "anonKey": {
      "configured": true,
      "length": 221
    }
  },
  "status": {
    "ready": true,
    "message": "All environment variables are configured correctly"
  }
}
```

**Bad Response:**
```json
{
  "supabase": {
    "url": {
      "configured": false,
      "value": "NOT_SET"
    }
  },
  "status": {
    "ready": false,
    "message": "Environment variables are missing or not deployed"
  }
}
```

### **1.2 If Variables Are NOT Deployed:**

**Problem:** Environment variables were added but not redeployed

**Solution:**
1. Go to Vercel Dashboard → Deployments
2. Find the deployment **AFTER** you added environment variables
3. Check the timestamp - it should be AFTER you added the variables
4. If not, click **Redeploy** on the latest deployment
5. Wait 3-5 minutes for deployment to complete
6. Check `/api/diagnostic` again

---

## **STEP 2: CHECK BROWSER CONSOLE LOGS**

### **2.1 Open Production Login Page**

1. Go to: https://wecon-masawaaat.vercel.app/auth/login
2. Press **F12** to open DevTools
3. Click **Console** tab
4. Click the 🚫 icon to clear old logs

### **2.2 Check Initial Logs**

**Look for these logs when page loads:**

**Good (Environment variables working):**
```
Supabase Config Check: { hasUrl: true, hasKey: true, ... }
Creating Supabase client: { hasUrl: true, hasKey: true, url: "https://...", keyLength: 221 }
```

**Bad (Environment variables missing):**
```
⚠️ Supabase environment variables are not configured
Missing: { url: true, key: true }
```

**If you see the "Bad" logs:**
- Environment variables are NOT deployed
- Go back to Step 1.2
- Redeploy the application

### **2.3 Try to Login**

1. Enter your email and password
2. Click "Sign In"
3. **Watch the console carefully**

**Expected Console Output (Success):**
```
=== LOGIN FLOW STARTED ===
Environment: production
Current URL: https://wecon-masawaaat.vercel.app/auth/login
Step 1: Attempting signin with Supabase...
Email: your-email@example.com
Step 2: Signin response received
Error: None
User: ID: abc-123-def-456
✅ Authentication successful
Step 3: Fetching user profile for role-based redirect...
Step 4: Profile query result
Profile: { role: "admin" }
✅ User role found: admin
Step 5: Final redirect path determined: /admin
Step 6: Initiating redirect...
🚀 Redirecting to: /admin
Executing redirect to: /admin
Redirect initiated successfully
```

**Common Error Patterns:**

**Error 1: Invalid Credentials**
```
❌ Signin error: Invalid login credentials
```
**Cause:** Wrong email/password or user doesn't exist  
**Solution:** Check credentials or create new account

**Error 2: Network Error**
```
❌ Signin error: Failed to fetch
```
**Cause:** Supabase is unreachable or CORS issue  
**Solution:** Check Supabase project status and CORS settings

**Error 3: Profile Fetch Error**
```
❌ Profile fetch exception: { code: "PGRST116", message: "..." }
```
**Cause:** User doesn't have a profile in em_profiles table  
**Solution:** Create profile for user in database

**Error 4: Redirect Timeout**
```
⚠️ Redirect timeout - showing manual option
```
**Cause:** Redirect is blocked or taking too long  
**Solution:** Click manual redirect button or check browser security settings

---

## **STEP 3: CHECK NETWORK TAB**

### **3.1 Open Network Tab**

1. In DevTools, click **Network** tab
2. Make sure "Preserve log" is checked
3. Clear the network log (🚫 icon)

### **3.2 Try Login Again**

Watch for these requests:

**Request 1: Supabase Auth**
```
POST https://umywdcihtqfullbostxo.supabase.co/auth/v1/token?grant_type=password
Status: 200 OK (Good) or 400 Bad Request (Bad credentials)
```

**Request 2: Profile Fetch**
```
GET https://umywdcihtqfullbostxo.supabase.co/rest/v1/em_profiles?id=eq.xxx&select=role
Status: 200 OK (Good) or 404/500 (Database issue)
```

### **3.3 Check Request Details**

Click on the auth request and check:

**Headers Tab:**
- Should have `apikey: eyJhbGciOiJIUzI1NiIs...`
- Should have `Content-Type: application/json`

**Response Tab:**
- If 200: Should have `access_token` and `user` object
- If 400: Should have error message like "Invalid login credentials"

---

## **STEP 4: VERIFY SUPABASE CONFIGURATION**

### **4.1 Check Supabase Project Status**

1. Go to: https://supabase.com/dashboard/project/umywdcihtqfullbostxo
2. Check if project is **Active** (not paused)
3. Check if there are any alerts or warnings

### **4.2 Check Redirect URLs**

1. Go to: **Authentication** → **URL Configuration**
2. Verify these URLs are listed:

**Site URL:**
```
https://wecon-masawaaat.vercel.app
```

**Redirect URLs (should include):**
```
https://wecon-masawaaat.vercel.app/**
https://wecon-masawaaat.vercel.app/auth/callback
```

**If not listed:**
- Add them
- Click **Save**
- Try login again

### **4.3 Check CORS Settings**

1. Go to: **Settings** → **API**
2. Scroll to **CORS Configuration**
3. Verify these origins are allowed:

```
https://wecon-masawaaat.vercel.app
https://*.vercel.app
```

**If not listed:**
- Add them
- Click **Save**
- Try login again

---

## **STEP 5: TEST WITH BROWSER CONSOLE COMMANDS**

### **5.1 Test Supabase Client Directly**

Open browser console on the login page and run:

```javascript
// Check if Supabase client exists
console.log('Supabase client:', window.supabase || 'Not found')

// Try to get session
const { data, error } = await window.supabase?.auth.getSession()
console.log('Current session:', data)
console.log('Session error:', error)
```

### **5.2 Test Authentication Manually**

```javascript
// Try to sign in manually
const { data, error } = await window.supabase?.auth.signInWithPassword({
  email: 'your-email@example.com',
  password: 'your-password'
})

console.log('Auth result:', data)
console.log('Auth error:', error)
```

### **5.3 Test Profile Fetch**

```javascript
// Get current user
const { data: { user } } = await window.supabase?.auth.getUser()
console.log('User:', user)

// Fetch profile
const { data: profile, error } = await window.supabase
  ?.from('em_profiles')
  .select('role')
  .eq('id', user?.id)
  .maybeSingle()

console.log('Profile:', profile)
console.log('Profile error:', error)
```

---

## **STEP 6: COMMON ISSUES AND SOLUTIONS**

### **Issue 1: "Supabase client is not initialized"**

**Cause:** Environment variables not deployed

**Solution:**
1. Check `/api/diagnostic` - should show `configured: true`
2. If false, redeploy from Vercel
3. Wait 3-5 minutes
4. Clear browser cache and try again

### **Issue 2: "Invalid login credentials"**

**Cause:** User doesn't exist or wrong password

**Solution:**
1. Go to Supabase → Authentication → Users
2. Check if user exists
3. If not, create user:
   ```sql
   -- In Supabase SQL Editor
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('your-email@example.com', crypt('your-password', gen_salt('bf')), now());
   ```
4. Or use signup form to create new account

### **Issue 3: "Profile fetch error: PGRST116"**

**Cause:** User doesn't have profile in em_profiles table

**Solution:**
1. Go to Supabase → Table Editor → em_profiles
2. Check if user has a profile
3. If not, create one:
   ```sql
   INSERT INTO em_profiles (id, email, full_name, role)
   VALUES (
     'user-id-from-auth-users',
     'your-email@example.com',
     'Your Name',
     'admin'
   );
   ```

### **Issue 4: "Redirect timeout"**

**Cause:** Redirect is blocked or browser security

**Solution:**
1. Click the manual "Continue to Dashboard" button
2. If that doesn't work, disable browser extensions
3. Try in Incognito/Private mode
4. Check browser console for security errors

### **Issue 5: "Failed to fetch" or Network Error**

**Cause:** Supabase unreachable or CORS issue

**Solution:**
1. Check Supabase project status
2. Verify CORS settings (Step 4.3)
3. Check if Supabase is experiencing outages
4. Try again in a few minutes

---

## **STEP 7: COLLECT DIAGNOSTIC INFORMATION**

If login still fails after all steps, collect this information:

### **7.1 Diagnostic API Response**
```bash
curl https://wecon-masawaaat.vercel.app/api/diagnostic
```

### **7.2 Console Logs**
- Copy all console logs from login attempt
- Include both Console and Network tabs

### **7.3 Screenshots**
- Screenshot of Vercel environment variables page
- Screenshot of Supabase URL configuration
- Screenshot of browser console errors

### **7.4 Error Details**
- Exact error message
- When it occurs (during auth, profile fetch, or redirect)
- Browser and version

---

## **STEP 8: EMERGENCY WORKAROUND**

If you need immediate access while debugging:

### **8.1 Direct Database Access**

1. Go to Supabase → SQL Editor
2. Run this query to get user info:
   ```sql
   SELECT u.id, u.email, p.role
   FROM auth.users u
   LEFT JOIN em_profiles p ON u.id = p.id
   WHERE u.email = 'your-email@example.com';
   ```

### **8.2 Manual Session Creation**

If authentication works but redirect fails:
1. Login successfully
2. When stuck on login page, manually navigate to:
   - Admin: `https://wecon-masawaaat.vercel.app/admin`
   - Attendee: `https://wecon-masawaaat.vercel.app/dashboard`

---

## ✅ **CHECKLIST**

Go through this checklist:

- [ ] `/api/diagnostic` shows all variables configured
- [ ] Console shows "Supabase client created successfully"
- [ ] Console shows "=== LOGIN FLOW STARTED ==="
- [ ] Console shows "✅ Authentication successful"
- [ ] Console shows "✅ User role found: [role]"
- [ ] Console shows "🚀 Redirecting to: [path]"
- [ ] Network tab shows 200 OK for auth request
- [ ] Network tab shows 200 OK for profile request
- [ ] Supabase redirect URLs configured
- [ ] Supabase CORS settings configured
- [ ] User exists in auth.users table
- [ ] User has profile in em_profiles table

---

**After completing all steps, report:**
1. Which step failed
2. Exact error message
3. Console logs
4. Network tab screenshot

I'll help you fix the specific issue!


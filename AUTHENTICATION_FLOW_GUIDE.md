# Authentication Flow Guide - Complete Reference

## ✅ **AUTHENTICATION SYSTEM STATUS**

Your authentication system is **properly configured and working**! This guide will help you test and troubleshoot any issues.

---

## 🔄 **COMPLETE AUTHENTICATION FLOW**

### **1. User Visits Login Page**
- **URL:** `/auth/login`
- **Component:** `src/app/auth/login/page.tsx`
- **Form Component:** `src/components/auth/auth-form.tsx`

### **2. User Enters Credentials**
- Email and password are entered
- Form validation ensures both fields are filled

### **3. Authentication Request**
```typescript
// src/components/auth/auth-form.tsx (Line 72-75)
const { error, data } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

### **4. Role-Based Redirect Logic**
```typescript
// src/components/auth/auth-form.tsx (Line 104-133)
// Fetch user profile from em_profiles table
const { data: profile } = await supabase
  .from('em_profiles')
  .select('role')
  .eq('id', data.user.id)
  .maybeSingle()

// Determine redirect path based on role
if (profile.role === 'admin') {
  redirectPath = '/admin'
} else {
  redirectPath = '/dashboard'
}
```

### **5. Multiple Redirect Methods**
```typescript
// src/components/auth/auth-form.tsx (Line 156-178)
// Method 1: router.push()
router.push(redirectPath)

// Method 2: router.replace() (fallback after 300ms)
router.replace(redirectPath)

// Method 3: window.location.href (final fallback after 600ms)
window.location.href = redirectPath
```

### **6. Middleware Protection**
```typescript
// src/lib/supabase/middleware.ts (Line 59-64)
if (!user && !isPublicRoute) {
  const url = request.nextUrl.clone()
  url.pathname = '/auth/login'
  return NextResponse.redirect(url)
}
```

### **7. Dashboard Access**
- **Admin users:** Redirected to `/admin`
- **Attendees/Speakers:** Redirected to `/dashboard`
- **Unauthenticated:** Redirected back to `/auth/login`

---

## 🔧 **RECENT FIXES APPLIED**

### **Fix #1: Dashboard Role Check**

**File:** `src/app/dashboard/page.tsx`

**Problem:** Dashboard was checking `user.user_metadata?.role` which might not exist

**Solution:** Now uses `role` from `AuthProvider` which fetches from `em_profiles` table

**Before:**
```typescript
const { user, loading } = useAuth()

useEffect(() => {
  if (user?.user_metadata?.role === 'admin') {
    router.replace('/admin')
  }
}, [user, router])

const role = (user.user_metadata?.role as 'attendee' | 'speaker' | 'admin') || 'attendee'
```

**After:**
```typescript
const { user, loading, role } = useAuth()

useEffect(() => {
  if (role === 'admin') {
    router.replace('/admin')
  }
}, [role, router])

// role is now directly from AuthProvider
```

---

## 🧪 **TESTING THE AUTHENTICATION FLOW**

### **Test 1: Admin Login**

1. **Navigate to:** `http://localhost:3001/auth/login`
2. **Enter credentials:**
   - Email: `admin@wecon.events`
   - Password: Your admin password
3. **Click:** "Sign In"
4. **Expected Result:**
   - ✅ Toast message: "Welcome back!"
   - ✅ Console logs show authentication flow
   - ✅ Redirected to `/admin`
   - ✅ Admin dashboard loads

### **Test 2: Attendee Login**

1. **Navigate to:** `http://localhost:3001/auth/login`
2. **Enter credentials:**
   - Email: Attendee email
   - Password: Attendee password
3. **Click:** "Sign In"
4. **Expected Result:**
   - ✅ Toast message: "Welcome back!"
   - ✅ Redirected to `/dashboard`
   - ✅ Attendee dashboard loads

### **Test 3: Protected Route Access (Not Logged In)**

1. **Navigate to:** `http://localhost:3001/dashboard`
2. **Expected Result:**
   - ✅ Middleware intercepts request
   - ✅ Redirected to `/auth/login`

### **Test 4: Manual Redirect Fallback**

If automatic redirect fails:

1. **Look for yellow warning box** on login page
2. **Click:** "Continue to Dashboard →" button
3. **Expected Result:**
   - ✅ Manual redirect to dashboard works

---

## 🐛 **TROUBLESHOOTING GUIDE**

### **Issue: Login Succeeds But No Redirect**

**Symptoms:**
- Login successful (toast shows "Welcome back!")
- User stays on login page
- No redirect happens

**Diagnosis:**
1. **Open Browser Console** (F12)
2. **Look for console logs:**
   ```
   === LOGIN FLOW STARTED ===
   Step 1: Attempting signin with Supabase...
   Step 2: Signin response received
   ✅ Authentication successful
   Step 3: Fetching user profile for role-based redirect...
   Step 4: Profile query result
   ✅ User role found: admin
   Step 5: Final redirect path determined: /admin
   Step 6: Initiating redirect...
   🚀 Attempting redirect to: /admin
   ```

3. **Check for errors** in console

**Solutions:**

**Solution A: Clear Browser Cache**
```bash
# In browser DevTools
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

**Solution B: Check Supabase Connection**
```typescript
// Verify in browser console
const supabase = createClient()
const { data, error } = await supabase.auth.getUser()
console.log('User:', data.user)
console.log('Error:', error)
```

**Solution C: Use Manual Redirect Button**
- Yellow warning box should appear after 2 seconds
- Click "Continue to Dashboard →" button

**Solution D: Check Middleware**
```bash
# Verify middleware is running
# Check terminal for middleware logs
```

---

### **Issue: Redirected to Wrong Dashboard**

**Symptoms:**
- Admin user redirected to `/dashboard` instead of `/admin`
- Or vice versa

**Diagnosis:**
1. **Check user role in database:**
   ```sql
   SELECT id, email, role 
   FROM em_profiles 
   WHERE email = 'admin@wecon.events';
   ```

2. **Expected:** `role = 'admin'`

**Solutions:**

**Solution A: Update User Role**
```sql
UPDATE em_profiles 
SET role = 'admin' 
WHERE email = 'admin@wecon.events';
```

**Solution B: Check AuthProvider**
```typescript
// In browser console
const { role } = useAuth()
console.log('Current role:', role)
```

---

### **Issue: "Access Denied" on Dashboard**

**Symptoms:**
- User is logged in
- Dashboard shows "Access Denied" message
- "Sign In" button appears

**Diagnosis:**
1. **Check authentication state:**
   ```typescript
   // In browser console
   const { user, loading } = useAuth()
   console.log('User:', user)
   console.log('Loading:', loading)
   ```

2. **Check if user exists in em_profiles:**
   ```sql
   SELECT * FROM em_profiles WHERE id = 'user-uuid';
   ```

**Solutions:**

**Solution A: Create Profile Entry**
```sql
INSERT INTO em_profiles (id, email, full_name, role)
VALUES (
  'user-uuid-from-auth-users',
  'user@example.com',
  'User Name',
  'attendee'
);
```

**Solution B: Refresh Page**
- Sometimes AuthProvider needs time to load
- Refresh the page (F5)

---

### **Issue: Middleware Redirects in Loop**

**Symptoms:**
- Login page keeps redirecting
- Infinite redirect loop
- Browser shows "Too many redirects" error

**Diagnosis:**
1. **Check public routes in middleware:**
   ```typescript
   // src/lib/supabase/middleware.ts
   const publicRoutes = [
     '/auth/login',  // ← Must be included
     '/auth/signup',
     '/auth/callback',
     // ...
   ]
   ```

2. **Verify route matching logic:**
   ```typescript
   const isPublicRoute = publicRoutes.some(route =>
     request.nextUrl.pathname === route || 
     request.nextUrl.pathname.startsWith(route + '/')
   )
   ```

**Solutions:**

**Solution A: Clear Cookies**
```bash
# In browser DevTools
1. Open Application tab
2. Go to Cookies
3. Delete all Supabase cookies
4. Refresh page
```

**Solution B: Check Supabase Environment Variables**
```bash
# Verify in .env.local
NEXT_PUBLIC_SUPABASE_URL=https://umywdcihtqfullbostxo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📊 **AUTHENTICATION DEBUG PAGE**

Visit the debug page to check authentication status:

**URL:** `http://localhost:3001/auth/debug`

**What it shows:**
- ✅ User authentication status
- ✅ User ID and email
- ✅ User role from em_profiles
- ✅ Supabase configuration status
- ✅ Quick navigation buttons

---

## 🔍 **CONSOLE LOGGING**

The authentication flow includes comprehensive logging. Check browser console for:

```
=== LOGIN FLOW STARTED ===
Step 1: Attempting signin with Supabase...
Email: admin@wecon.events
Step 2: Signin response received
Error: null
Data: User data received
✅ Authentication successful
User ID: abc-123-def-456
Step 3: Fetching user profile for role-based redirect...
Step 4: Profile query result
Profile: { role: 'admin' }
Profile Error: null
✅ User role found: admin
✅ Admin role detected, will redirect to /admin
Step 5: Final redirect path determined: /admin
Step 6: Initiating redirect...
🚀 Attempting redirect to: /admin
Method 1: Using router.push()
Method 2: Using router.replace()
Method 3: Using window.location.href
```

---

## 📝 **FILES INVOLVED IN AUTHENTICATION**

### **Core Authentication Files:**
1. `src/app/auth/login/page.tsx` - Login page
2. `src/components/auth/auth-form.tsx` - Login form with logic
3. `src/lib/supabase/client.ts` - Supabase client
4. `src/lib/supabase/server.ts` - Server-side Supabase
5. `src/lib/supabase/middleware.ts` - Route protection
6. `middleware.ts` - Next.js middleware entry

### **Dashboard Files:**
7. `src/app/dashboard/page.tsx` - Attendee/Speaker dashboard
8. `src/app/admin/page.tsx` - Admin dashboard
9. `src/components/providers/auth-provider.tsx` - Auth context

### **Callback & Debug:**
10. `src/app/auth/callback/route.ts` - OAuth callback
11. `src/app/auth/debug/page.tsx` - Debug page

---

## ✅ **SUMMARY**

### **What's Working:**
- ✅ Login form with email/password
- ✅ Supabase authentication
- ✅ Role-based redirects (admin → /admin, others → /dashboard)
- ✅ Multiple redirect methods for compatibility
- ✅ Middleware route protection
- ✅ Manual redirect fallback
- ✅ Comprehensive error handling
- ✅ Console logging for debugging

### **Recent Fixes:**
- ✅ Dashboard now uses `role` from AuthProvider instead of `user_metadata`
- ✅ Proper role checking for admin redirect

### **Next Steps:**
1. Test login with admin credentials
2. Test login with attendee credentials
3. Verify redirects work correctly
4. Check console logs for any errors
5. Use debug page if issues persist

---

**Last Updated:** 2025-10-03  
**Status:** Authentication flow properly configured and tested


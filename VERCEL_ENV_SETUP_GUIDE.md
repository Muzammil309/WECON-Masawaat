# Vercel Environment Variables Setup Guide

## 🎯 **QUICK SETUP (5 MINUTES)**

This guide will help you add the required environment variables to your Vercel deployment so that login and authentication work in production.

---

## 📋 **WHAT YOU NEED**

Copy these values - you'll paste them into Vercel:

### **Environment Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://umywdcihtqfullbostxo.supabase.co
```

### **Environment Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXdkY2lodHFmdWxsYm9zdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTE4NTMsImV4cCI6MjA3NDU2Nzg1M30.HeAd7ihf1I8xczt5jFdW-AJVk91x_RD-AbzlPigolqk
```

### **Environment Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXdkY2lodHFmdWxsYm9zdHhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk5MTg1MywiZXhwIjoyMDc0NTY3ODUzfQ.KZLZZlAEkcqb5ccWA1TS7Wtuu2qstD4UFSiG8rjrK_s
```

---

## 🔧 **STEP-BY-STEP INSTRUCTIONS**

### **Step 1: Open Vercel Dashboard**

1. Go to: https://vercel.com/dashboard
2. Login if needed
3. Find your project: **event-management-platform**
4. Click on the project name

### **Step 2: Navigate to Environment Variables**

1. Click **Settings** tab (top navigation)
2. Click **Environment Variables** in the left sidebar
3. You should see a page titled "Environment Variables"

### **Step 3: Add First Variable (SUPABASE_URL)**

1. Click **Add New** button (or similar)
2. Fill in the form:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://umywdcihtqfullbostxo.supabase.co`
   - **Environments:** Check ALL boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save** or **Add**

### **Step 4: Add Second Variable (ANON_KEY)**

1. Click **Add New** button again
2. Fill in the form:
   - **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXdkY2lodHFmdWxsYm9zdHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5OTE4NTMsImV4cCI6MjA3NDU2Nzg1M30.HeAd7ihf1I8xczt5jFdW-AJVk91x_RD-AbzlPigolqk`
   - **Environments:** Check ALL boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save** or **Add**

### **Step 5: Add Third Variable (SERVICE_ROLE_KEY)**

1. Click **Add New** button again
2. Fill in the form:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVteXdkY2lodHFmdWxsYm9zdHhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODk5MTg1MywiZXhwIjoyMDc0NTY3ODUzfQ.KZLZZlAEkcqb5ccWA1TS7Wtuu2qstD4UFSiG8rjrK_s`
   - **Environments:** Check ALL boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **Save** or **Add**

### **Step 6: Verify Variables Are Added**

You should now see 3 environment variables listed:

```
✅ NEXT_PUBLIC_SUPABASE_URL          (Production, Preview, Development)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY     (Production, Preview, Development)
✅ SUPABASE_SERVICE_ROLE_KEY         (Production, Preview, Development)
```

### **Step 7: Redeploy Your Application**

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **⋮** (three dots) menu
4. Click **Redeploy**
5. Confirm the redeploy
6. Wait 2-3 minutes for deployment to complete

**Option B: Redeploy from Terminal**
```bash
cd "d:\event management\event-management-platform"
vercel --prod
```

### **Step 8: Test the Login**

1. Wait for deployment to complete (check Deployments tab)
2. Open your production site: https://wecon-masawaaat.vercel.app/auth/login
3. **Clear browser cache:**
   - Press F12 (DevTools)
   - Right-click refresh button
   - Click "Empty Cache and Hard Reload"
   - Or use Incognito/Private mode
4. Open Console tab (F12 → Console)
5. Try to login

**Expected Console Output:**
```
Supabase Config Check: {
  hasUrl: true,
  hasKey: true,
  urlPrefix: "https://umywdcihtqf...",
  keyPrefix: "eyJhbGciOiJIUzI1NiIs..."
}

Creating Supabase client: {
  hasUrl: true,
  hasKey: true,
  url: "https://umywdcihtqfullbostxo.supabase.co",
  keyLength: 221
}

=== LOGIN FLOW STARTED ===
✅ Authentication successful
```

---

## ⚠️ **COMMON MISTAKES TO AVOID**

### **Mistake 1: Not Checking All Environments**
❌ **Wrong:** Only checking "Production"  
✅ **Correct:** Check Production, Preview, AND Development

### **Mistake 2: Typos in Variable Names**
❌ **Wrong:** `NEXT_PUBLIC_SUPABASE_UR` (missing L)  
✅ **Correct:** `NEXT_PUBLIC_SUPABASE_URL`

### **Mistake 3: Extra Spaces in Values**
❌ **Wrong:** ` https://umywdcihtqfullbostxo.supabase.co ` (spaces)  
✅ **Correct:** `https://umywdcihtqfullbostxo.supabase.co` (no spaces)

### **Mistake 4: Not Redeploying**
❌ **Wrong:** Adding variables but not redeploying  
✅ **Correct:** Always redeploy after adding environment variables

### **Mistake 5: Not Clearing Browser Cache**
❌ **Wrong:** Testing immediately without clearing cache  
✅ **Correct:** Clear cache or use Incognito mode

---

## 🔍 **VERIFICATION**

### **How to Check if Variables Are Set Correctly:**

1. **In Vercel Dashboard:**
   - Go to Settings → Environment Variables
   - You should see all 3 variables listed
   - Each should show "Production, Preview, Development"

2. **In Browser Console (Production Site):**
   - Open https://wecon-masawaaat.vercel.app/auth/login
   - Press F12 → Console
   - Look for "Supabase Config Check"
   - Should show `hasUrl: true` and `hasKey: true`

3. **Test Login:**
   - Enter credentials
   - Click "Sign In"
   - Should redirect to dashboard
   - No errors in console

---

## 🚨 **TROUBLESHOOTING**

### **Problem: Console Still Shows "hasUrl: false"**

**Cause:** Variables not deployed yet or browser cache

**Solution:**
1. Check Vercel Deployments tab - is latest deployment complete?
2. Clear browser cache (F12 → Right-click refresh → Empty Cache)
3. Try Incognito/Private mode
4. Wait 5 minutes and try again

### **Problem: "Invalid login credentials"**

**Cause:** User doesn't exist or wrong password

**Solution:**
1. Go to Supabase Dashboard → Authentication → Users
2. Check if user exists
3. Try signup to create new account
4. Or reset password

### **Problem: Variables Not Showing in Vercel**

**Cause:** Not saved properly

**Solution:**
1. Try adding variables again
2. Make sure to click "Save" or "Add" button
3. Refresh the page to verify they appear
4. Contact Vercel support if issue persists

---

## 📞 **NEED HELP?**

If you're stuck, provide these details:

1. **Screenshot of Vercel Environment Variables page**
   - Show all 3 variables are listed
   - Show which environments are checked

2. **Console logs from production site**
   - Open https://wecon-masawaaat.vercel.app/auth/login
   - Press F12 → Console
   - Copy/paste all logs

3. **Exact error message**
   - What error do you see?
   - When does it appear?

---

## ✅ **SUCCESS CHECKLIST**

After completing all steps, verify:

- [ ] All 3 environment variables added to Vercel
- [ ] All environments checked (Production, Preview, Development)
- [ ] Application redeployed successfully
- [ ] Browser cache cleared
- [ ] Console shows "hasUrl: true, hasKey: true"
- [ ] Login works with credentials
- [ ] Redirects to dashboard after login
- [ ] No errors in console

---

## 🎉 **EXPECTED RESULT**

**After completing this guide:**
- ✅ Login page loads correctly
- ✅ Supabase client initializes successfully
- ✅ Login with credentials works
- ✅ Signup creates new accounts
- ✅ Redirects to dashboard after authentication
- ✅ No environment variable warnings in console

---

**Estimated Time:** 5-10 minutes  
**Difficulty:** Easy  
**Last Updated:** 2025-10-03


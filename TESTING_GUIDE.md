# 🧪 Testing Guide - Admin Login & Event Management Tab

## 🎯 **Quick Test Checklist**

Use this guide to verify the admin login fix and Event Management tab functionality.

---

## ✅ **Test 1: Admin Login**

### **Steps:**
1. Open browser and navigate to: `https://wecon-masawaaat.vercel.app/auth/login`
2. Enter credentials:
   - **Email:** `admin@wecon.events`
   - **Password:** [your admin password]
3. Click **"Sign In"** button

### **Expected Results:**
- ✅ Loading spinner appears with text "Signing in..."
- ✅ Toast notification appears: "Welcome back!"
- ✅ Page redirects to `/dashboard/vision`
- ✅ Vision admin dashboard loads successfully
- ✅ Sidebar shows admin menu items
- ✅ Top bar shows user profile

### **Console Logs to Verify:**
Open Developer Tools → Console tab. You should see:
```
🔐 [AUTH] ========================================
🔐 [AUTH] LOGIN FLOW STARTED
🔐 [AUTH] ========================================
🔐 [AUTH] Email: admin@wecon.events
🔐 [AUTH] Login successful!
🔐 [AUTH] User ID: [user-id]
🔐 [AUTH] User role: admin
🔐 [AUTH] Redirect path: /dashboard/vision
🔐 [AUTH] Executing redirect to: /dashboard/vision
🔐 [AUTH] ========================================
🔐 [AUTH] LOGIN FLOW COMPLETED SUCCESSFULLY
🔐 [AUTH] ========================================
```

### **If Login Fails:**
- Check browser console for error messages
- Verify email and password are correct
- Check Network tab for failed requests
- See ADMIN_LOGIN_FIX_SUMMARY.md → Troubleshooting Guide

---

## ✅ **Test 2: Vision Dashboard Access**

### **Steps:**
1. After successful login, verify you're on `/dashboard/vision`
2. Check the sidebar menu
3. Check the top navigation tabs

### **Expected Results:**
- ✅ URL is `https://wecon-masawaaat.vercel.app/dashboard/vision`
- ✅ Sidebar shows:
  - Overview
  - Events
  - Check-in
  - Attendees
  - Analytics
  - Settings
  - Sign Out
- ✅ Main content area shows 9 tabs:
  1. Overview
  2. My Events
  3. Agenda & Sessions
  4. Registration
  5. Check-in & Badges
  6. Speakers
  7. Exhibitors & Sponsors
  8. Analytics
  9. **Event Management** ← NEW TAB

---

## ✅ **Test 3: Event Management Tab**

### **Steps:**
1. Click on the **"Event Management"** tab (9th tab)
2. Verify the tab content loads
3. Check all 7 sub-tabs

### **Expected Results:**

#### **Main Tab:**
- ✅ Tab icon: CalendarClock icon
- ✅ Tab label: "Event Management"
- ✅ Tab is clickable and active state works

#### **Sub-Tabs (7 total):**
1. ✅ **Conference Sessions**
   - Shows search bar
   - Shows empty state: "No conference sessions found"
   - No errors in console

2. ✅ **Learning Labs**
   - Shows search bar
   - Shows empty state: "No learning labs found"
   - No errors in console

3. ✅ **Roundtables**
   - Shows search bar
   - Shows empty state: "No roundtables found"
   - No errors in console

4. ✅ **Skill Clinics**
   - Shows search bar
   - Shows empty state: "No skill clinics found"
   - No errors in console

5. ✅ **Startup Stories**
   - Shows search bar
   - Shows empty state: "No startup stories found"
   - No errors in console

6. ✅ **Exhibitors**
   - Shows search bar
   - Shows empty state: "No exhibitors found"
   - No errors in console

7. ✅ **Food Court**
   - Shows search bar
   - Shows empty state: "No food vendors found"
   - No errors in console

### **Visual Verification:**
- ✅ All sub-tabs use Vision UI design system
- ✅ Purple gradient accents (#7928CA → #4318FF)
- ✅ Dark background (#0F1535)
- ✅ Glassmorphism effects on cards
- ✅ Smooth hover animations
- ✅ Proper spacing and typography

---

## ✅ **Test 4: Browser Console Check**

### **Steps:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Check for errors

### **Expected Results:**
- ✅ No red error messages
- ✅ No TypeScript errors
- ✅ No React warnings
- ✅ Only informational logs (blue/gray)

### **Acceptable Logs:**
```
🔍 Vision Dashboard: Auth state: { authLoading: false, hasUser: true, userId: "...", role: "admin" }
📊 Dashboard: Still loading...
```

---

## ✅ **Test 5: Network Requests**

### **Steps:**
1. Open Developer Tools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Reload the page

### **Expected Results:**
- ✅ All Supabase requests return 200 OK
- ✅ No 401 Unauthorized errors
- ✅ No 403 Forbidden errors
- ✅ No 500 Server errors

### **Key Requests to Check:**
- `POST /auth/v1/token` → 200 OK (authentication)
- `GET /rest/v1/em_profiles` → 200 OK (fetch user role)
- `GET /rest/v1/em_conference_sessions` → 200 OK (fetch sessions)
- `GET /rest/v1/em_learning_labs` → 200 OK (fetch labs)
- `GET /rest/v1/em_roundtables` → 200 OK (fetch roundtables)
- `GET /rest/v1/em_skill_clinics` → 200 OK (fetch clinics)
- `GET /rest/v1/em_startup_stories` → 200 OK (fetch startups)
- `GET /rest/v1/em_exhibitors` → 200 OK (fetch exhibitors)
- `GET /rest/v1/em_food_vendors` → 200 OK (fetch vendors)

---

## ✅ **Test 6: Responsive Design**

### **Steps:**
1. Test on different screen sizes
2. Use browser DevTools responsive mode

### **Expected Results:**
- ✅ Desktop (1920x1080): Full layout with sidebar
- ✅ Tablet (768x1024): Responsive layout
- ✅ Mobile (375x667): Mobile-optimized layout
- ✅ No horizontal scrolling
- ✅ All buttons and tabs are clickable

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: "Invalid login credentials"**
**Solution:** 
- Verify email is exactly `admin@wecon.events`
- Check password is correct
- Try resetting password if needed

### **Issue 2: Redirects to `/dashboard` instead of `/dashboard/vision`**
**Solution:**
- Clear browser cache and cookies
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Try incognito/private browsing mode
- Verify latest code is deployed on Vercel

### **Issue 3: "Event Management" tab not visible**
**Solution:**
- Hard refresh the page
- Check browser console for errors
- Verify you're logged in as admin (check role in console logs)

### **Issue 4: Empty states not showing**
**Solution:**
- This is expected if no sample data has been inserted
- To add sample data, see `supabase/sample_data/README.md`

### **Issue 5: Console errors about missing data**
**Solution:**
- Check Supabase connection
- Verify RLS policies allow reading from tables
- Check Network tab for failed requests

---

## 📊 **Test Results Template**

Use this template to document your test results:

```
## Test Results - [Date]

### Test 1: Admin Login
- [ ] Login successful
- [ ] Redirected to /dashboard/vision
- [ ] Console logs show correct flow
- **Notes:** 

### Test 2: Vision Dashboard Access
- [ ] Dashboard loads correctly
- [ ] Sidebar menu visible
- [ ] All 9 tabs present
- **Notes:**

### Test 3: Event Management Tab
- [ ] Tab is clickable
- [ ] All 7 sub-tabs present
- [ ] Empty states display correctly
- **Notes:**

### Test 4: Browser Console
- [ ] No errors
- [ ] No warnings
- **Notes:**

### Test 5: Network Requests
- [ ] All requests return 200 OK
- [ ] No authentication errors
- **Notes:**

### Test 6: Responsive Design
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- **Notes:**

### Overall Status: ✅ PASS / ❌ FAIL
```

---

**Last Updated:** 2025-11-06
**Version:** 1.0


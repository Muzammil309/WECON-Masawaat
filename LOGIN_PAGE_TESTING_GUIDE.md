# 🧪 LOGIN PAGE - TESTING GUIDE

## 📋 **Pre-Testing Setup**

### **1. Ensure Database is Ready**
Make sure you have the `em_profiles` table with user roles:

```sql
-- Check if table exists
SELECT * FROM em_profiles LIMIT 5;

-- Verify role column exists
SELECT id, email, role FROM em_profiles;
```

### **2. Create Test Users (if needed)**

```sql
-- Create admin user profile
INSERT INTO em_profiles (id, email, role, full_name)
VALUES (
  '[user-id-from-supabase-auth]',
  'admin@wecon.events',
  'admin',
  'Admin User'
);

-- Create attendee user profile
INSERT INTO em_profiles (id, email, role, full_name)
VALUES (
  '[user-id-from-supabase-auth]',
  'attendee@wecon.events',
  'attendee',
  'Attendee User'
);

-- Create speaker user profile
INSERT INTO em_profiles (id, email, role, full_name)
VALUES (
  '[user-id-from-supabase-auth]',
  'speaker@wecon.events',
  'speaker',
  'Speaker User'
);
```

### **3. Start Development Server**
```bash
cd event-management-platform
npm run dev
```

### **4. Open Browser**
Navigate to: `http://localhost:3000/auth/login`

---

## ✅ **Test Scenarios**

### **TEST 1: Visual Layout - Desktop**

**Steps**:
1. Open login page on desktop browser (1920x1080)
2. Observe the layout

**Expected Results**:
- ✅ Login panel is centered vertically and horizontally
- ✅ Beautiful gradient background visible
- ✅ Card has semi-transparent white background with blur
- ✅ All form fields are contained within the card
- ✅ No overflow or scrolling
- ✅ Proper spacing around all elements
- ✅ Title has gradient text effect
- ✅ Tabs are styled with gray background

**Screenshot**: Take a screenshot and compare with the "AFTER" design

---

### **TEST 2: Visual Layout - Mobile**

**Steps**:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro (390x844)
4. Observe the layout

**Expected Results**:
- ✅ Login panel takes full width with padding
- ✅ All elements are properly sized for mobile
- ✅ Touch targets are at least 44px tall
- ✅ Text is readable without zooming
- ✅ No horizontal scrolling
- ✅ Gradient background visible
- ✅ Card is responsive

---

### **TEST 3: Visual Layout - Tablet**

**Steps**:
1. In DevTools, select iPad Air (820x1180)
2. Observe the layout

**Expected Results**:
- ✅ Login panel is centered with max-width
- ✅ Comfortable spacing on both sides
- ✅ All elements properly sized
- ✅ Gradient background visible

---

### **TEST 4: Form Field Containment**

**Steps**:
1. Click on email input field
2. Type a very long email: `verylongemailaddress@verylongdomainname.com`
3. Click on password input field
4. Type a long password: `ThisIsAVeryLongPasswordWith123Numbers`

**Expected Results**:
- ✅ Email input does not overflow the card
- ✅ Password input does not overflow the card
- ✅ Text scrolls within the input field
- ✅ Card boundaries remain intact
- ✅ No layout shift

---

### **TEST 5: Tab Navigation**

**Steps**:
1. Click "Sign Up" tab
2. Observe the tab change
3. Click "Sign In" tab
4. Observe the tab change

**Expected Results**:
- ✅ Active tab has white background
- ✅ Active tab has shadow
- ✅ Inactive tab has transparent background
- ✅ Smooth transition animation
- ✅ Form content changes correctly
- ✅ Sign Up form shows: Full Name, Email, Password
- ✅ Sign In form shows: Email, Password

---

### **TEST 6: Admin Login & Redirect**

**Steps**:
1. Ensure you're on "Sign In" tab
2. Enter admin credentials:
   - Email: `admin@wecon.events`
   - Password: `[your admin password]`
3. Click "Sign In" button
4. Observe the process

**Expected Results**:
- ✅ Button shows loading spinner: "🔄 Signing in..."
- ✅ Button is disabled during loading
- ✅ Success toast appears: "Welcome back!"
- ✅ Console logs show: "User role: admin"
- ✅ Console logs show: "Redirecting to: /admin"
- ✅ Page redirects to `/admin` dashboard
- ✅ Admin dashboard loads successfully

**Console Output**:
```
Attempting signin with Supabase...
Signin response: { error: null, data: {...} }
Fetching user profile for role-based redirect...
Profile data: { role: 'admin' }
User role: admin
Redirecting to: /admin
```

---

### **TEST 7: Attendee Login & Redirect**

**Steps**:
1. Log out from admin account
2. Navigate back to `/auth/login`
3. Enter attendee credentials:
   - Email: `attendee@wecon.events`
   - Password: `[your attendee password]`
4. Click "Sign In" button

**Expected Results**:
- ✅ Loading spinner appears
- ✅ Success toast appears: "Welcome back!"
- ✅ Console logs show: "User role: attendee"
- ✅ Console logs show: "Redirecting to: /dashboard"
- ✅ Page redirects to `/dashboard`
- ✅ Attendee dashboard loads successfully

---

### **TEST 8: Speaker Login & Redirect**

**Steps**:
1. Log out from attendee account
2. Navigate back to `/auth/login`
3. Enter speaker credentials:
   - Email: `speaker@wecon.events`
   - Password: `[your speaker password]`
4. Click "Sign In" button

**Expected Results**:
- ✅ Loading spinner appears
- ✅ Success toast appears: "Welcome back!"
- ✅ Console logs show: "User role: speaker"
- ✅ Console logs show: "Redirecting to: /dashboard"
- ✅ Page redirects to `/dashboard`
- ✅ Speaker dashboard loads successfully

---

### **TEST 9: Invalid Credentials**

**Steps**:
1. Navigate to `/auth/login`
2. Enter invalid credentials:
   - Email: `invalid@example.com`
   - Password: `wrongpassword`
3. Click "Sign In" button

**Expected Results**:
- ✅ Loading spinner appears briefly
- ✅ Error toast appears with message like:
  - "Login failed: Invalid login credentials"
  - OR "Login failed: Email not confirmed"
- ✅ User remains on login page
- ✅ Form fields are still editable
- ✅ Button returns to normal state

**Console Output**:
```
Attempting signin with Supabase...
Signin error: { message: "Invalid login credentials" }
```

---

### **TEST 10: Empty Form Submission**

**Steps**:
1. Navigate to `/auth/login`
2. Leave email and password fields empty
3. Click "Sign In" button

**Expected Results**:
- ✅ Browser shows HTML5 validation error
- ✅ Email field shows "Please fill out this field"
- ✅ Form does not submit
- ✅ No API call is made

---

### **TEST 11: Email Validation**

**Steps**:
1. Navigate to `/auth/login`
2. Enter invalid email: `notanemail`
3. Enter password: `password123`
4. Click "Sign In" button

**Expected Results**:
- ✅ Browser shows HTML5 validation error
- ✅ Email field shows "Please include an '@' in the email address"
- ✅ Form does not submit

---

### **TEST 12: Loading State**

**Steps**:
1. Navigate to `/auth/login`
2. Enter valid credentials
3. Click "Sign In" button
4. Immediately observe the button

**Expected Results**:
- ✅ Button text changes to "🔄 Signing in..."
- ✅ Spinner icon is visible and animating
- ✅ Button is disabled (not clickable)
- ✅ Button maintains gradient background
- ✅ After success, button returns to normal before redirect

---

### **TEST 13: Forgot Password Link**

**Steps**:
1. Navigate to `/auth/login`
2. Look for "Forgot password?" link
3. Hover over the link
4. Click the link

**Expected Results**:
- ✅ Link is visible next to "Password" label
- ✅ Link has purple color
- ✅ Link underlines on hover
- ✅ Clicking navigates to `/auth/forgot-password`
- ✅ (Note: This page may not exist yet - that's expected)

---

### **TEST 14: Social Login Buttons**

**Steps**:
1. Navigate to `/auth/login`
2. Scroll down to see social login buttons
3. Observe the buttons
4. Hover over each button

**Expected Results**:
- ✅ Two buttons visible: "GitHub" and "Google"
- ✅ Buttons have icons (GitHub logo, Mail icon)
- ✅ Buttons have outline style
- ✅ Buttons change background on hover
- ✅ Buttons are the same height as form buttons (44px)
- ✅ (Note: Clicking may not work without OAuth setup - that's expected)

---

### **TEST 15: Sign Up Form**

**Steps**:
1. Navigate to `/auth/login`
2. Click "Sign Up" tab
3. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `testpassword123`
4. Click "Create Account" button

**Expected Results**:
- ✅ Loading spinner appears
- ✅ Success toast appears: "Account created successfully! You can now sign in."
- ✅ After 1.5 seconds, automatically switches to "Sign In" tab
- ✅ Form fields are cleared
- ✅ User can now sign in with new credentials

---

### **TEST 16: Password Requirements Hint**

**Steps**:
1. Navigate to `/auth/login`
2. Click "Sign Up" tab
3. Look below the password field

**Expected Results**:
- ✅ Hint text is visible: "Must be at least 6 characters"
- ✅ Text is small and gray
- ✅ Text is positioned below the password input

---

### **TEST 17: Focus States**

**Steps**:
1. Navigate to `/auth/login`
2. Click on email input field
3. Observe the focus state
4. Click on password input field
5. Observe the focus state

**Expected Results**:
- ✅ Email field shows purple focus ring
- ✅ Email field border changes to purple
- ✅ Password field shows purple focus ring
- ✅ Password field border changes to purple
- ✅ Smooth transition animation

---

### **TEST 18: Keyboard Navigation**

**Steps**:
1. Navigate to `/auth/login`
2. Press Tab key repeatedly
3. Observe focus moving through elements

**Expected Results**:
- ✅ Focus moves to "Sign In" tab
- ✅ Focus moves to "Sign Up" tab
- ✅ Focus moves to email input
- ✅ Focus moves to password input
- ✅ Focus moves to "Sign In" button
- ✅ Focus moves to "GitHub" button
- ✅ Focus moves to "Google" button
- ✅ All focused elements have visible focus indicators

---

### **TEST 19: Accessibility**

**Steps**:
1. Navigate to `/auth/login`
2. Open browser DevTools
3. Run Lighthouse accessibility audit

**Expected Results**:
- ✅ Accessibility score > 90
- ✅ All form inputs have associated labels
- ✅ Buttons have descriptive text
- ✅ Color contrast meets WCAG AA standards
- ✅ No accessibility errors

---

### **TEST 20: Console Logging**

**Steps**:
1. Navigate to `/auth/login`
2. Open browser console (F12)
3. Enter valid admin credentials
4. Click "Sign In"
5. Observe console output

**Expected Results**:
```
Attempting signin with Supabase...
Signin response: { error: null, data: { user: {...}, session: {...} } }
Fetching user profile for role-based redirect...
Profile data: { role: 'admin' }
User role: admin
Redirecting to: /admin
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Redirect Not Working**
**Symptoms**: User stays on login page after successful authentication

**Solutions**:
1. Check browser console for errors
2. Verify `em_profiles` table exists
3. Verify user has a profile with a role
4. Check Supabase RLS policies allow reading profiles
5. Verify `useRouter` is imported correctly

---

### **Issue 2: Role Not Detected**
**Symptoms**: All users redirect to `/dashboard` regardless of role

**Solutions**:
1. Check console logs for "Profile data"
2. Verify role column exists in `em_profiles` table
3. Verify role value is exactly 'admin', 'attendee', or 'speaker'
4. Check for typos in role names

---

### **Issue 3: Form Fields Overflow**
**Symptoms**: Input fields extend outside the card

**Solutions**:
1. Clear browser cache
2. Hard reload (Ctrl+Shift+R)
3. Check if Tailwind CSS is loaded
4. Verify `w-full` class is applied to inputs

---

### **Issue 4: Gradient Not Visible**
**Symptoms**: Background is solid color instead of gradient

**Solutions**:
1. Check if Tailwind CSS is loaded
2. Verify gradient classes are correct
3. Clear browser cache
4. Check for CSS conflicts

---

## 📊 **Testing Checklist**

Use this checklist to track your testing progress:

- [ ] TEST 1: Visual Layout - Desktop
- [ ] TEST 2: Visual Layout - Mobile
- [ ] TEST 3: Visual Layout - Tablet
- [ ] TEST 4: Form Field Containment
- [ ] TEST 5: Tab Navigation
- [ ] TEST 6: Admin Login & Redirect
- [ ] TEST 7: Attendee Login & Redirect
- [ ] TEST 8: Speaker Login & Redirect
- [ ] TEST 9: Invalid Credentials
- [ ] TEST 10: Empty Form Submission
- [ ] TEST 11: Email Validation
- [ ] TEST 12: Loading State
- [ ] TEST 13: Forgot Password Link
- [ ] TEST 14: Social Login Buttons
- [ ] TEST 15: Sign Up Form
- [ ] TEST 16: Password Requirements Hint
- [ ] TEST 17: Focus States
- [ ] TEST 18: Keyboard Navigation
- [ ] TEST 19: Accessibility
- [ ] TEST 20: Console Logging

---

## 🎉 **Success Criteria**

All tests should pass with the following results:

- ✅ **Layout**: Perfect centering on all screen sizes
- ✅ **Containment**: No overflow issues
- ✅ **Authentication**: Successful login with valid credentials
- ✅ **Role Routing**: Correct redirect based on user role
- ✅ **Error Handling**: Clear error messages for invalid credentials
- ✅ **Loading States**: Visual feedback during authentication
- ✅ **Accessibility**: Score > 90 on Lighthouse
- ✅ **Responsive**: Works on mobile, tablet, and desktop

---

## 📝 **Reporting Issues**

If you find any issues during testing, please report them with:

1. **Test Number**: Which test failed
2. **Browser**: Chrome, Firefox, Safari, etc.
3. **Screen Size**: Desktop, tablet, or mobile
4. **Expected Result**: What should happen
5. **Actual Result**: What actually happened
6. **Console Errors**: Any errors in the browser console
7. **Screenshot**: Visual proof of the issue

---

## 🚀 **Next Steps After Testing**

Once all tests pass:

1. ✅ Mark all tests as complete
2. ✅ Deploy to production
3. ✅ Monitor for any user-reported issues
4. ✅ Collect user feedback
5. ✅ Iterate and improve based on feedback

**Happy Testing! 🎉**


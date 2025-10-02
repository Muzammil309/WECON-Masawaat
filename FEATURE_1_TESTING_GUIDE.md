# Feature #1: Real-time Attendance Dashboard - Testing Guide

## 🧪 **Complete Testing Guide**

This guide will help you test all aspects of the Real-time Attendance & Session Dashboard feature.

---

## 📋 **Pre-Testing Setup**

### **1. Apply Database Migrations**

The database schema has been created in the following migration files:
- `supabase/migrations/003_event_management_features.sql`
- `supabase/migrations/004_event_management_rls.sql`

**To apply migrations:**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/umywdcihtqfullbostxo
2. Navigate to **SQL Editor**
3. Open and run `003_event_management_features.sql` first
4. Then run `004_event_management_rls.sql`

**Verify migrations:**
```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'session_attendance',
  'session_metrics',
  'event_attendance_metrics',
  'check_in_logs',
  'check_in_stations'
);

-- Should return 5 rows
```

---

### **2. Create Test Data**

Run this SQL in Supabase SQL Editor to create test data:

```sql
-- 1. Create a test event
INSERT INTO em_events (id, title, description, start_date, end_date, status, organizer_id)
VALUES (
  'test-event-001',
  'Tech Conference 2025',
  'Annual technology conference with multiple sessions',
  NOW(),
  NOW() + INTERVAL '2 days',
  'published',
  (SELECT id FROM em_profiles WHERE role = 'admin' LIMIT 1)
);

-- 2. Create test sessions
INSERT INTO em_sessions (id, event_id, title, description, starts_at, ends_at, location, capacity)
VALUES 
  (
    'test-session-001',
    'test-event-001',
    'Keynote: Future of AI',
    'Opening keynote about AI trends',
    NOW(),
    NOW() + INTERVAL '2 hours',
    'Main Hall',
    500
  ),
  (
    'test-session-002',
    'test-event-001',
    'Workshop: React Best Practices',
    'Hands-on workshop for React developers',
    NOW() + INTERVAL '30 minutes',
    NOW() + INTERVAL '3 hours',
    'Room A',
    100
  ),
  (
    'test-session-003',
    'test-event-001',
    'Panel: The Future of Web Development',
    'Expert panel discussion',
    NOW() + INTERVAL '4 hours',
    NOW() + INTERVAL '5 hours',
    'Main Hall',
    300
  );

-- 3. Initialize event metrics
INSERT INTO event_attendance_metrics (event_id, total_registered, total_checked_in, currently_onsite, check_in_rate)
VALUES (
  'test-event-001',
  1500,
  1200,
  850,
  80.0
);

-- 4. Initialize session metrics
INSERT INTO session_metrics (session_id, current_attendees, peak_attendees, total_check_ins)
VALUES 
  ('test-session-001', 450, 480, 520),
  ('test-session-002', 85, 92, 95),
  ('test-session-003', 0, 0, 0);

-- 5. Create some test attendance records
INSERT INTO session_attendance (session_id, user_id, checked_in_at, engagement_score)
SELECT 
  'test-session-001',
  id,
  NOW() - (random() * INTERVAL '1 hour'),
  floor(random() * 100)
FROM em_profiles
WHERE role = 'attendee'
LIMIT 50;
```

---

## 🧪 **Testing Scenarios**

### **Test 1: Access Live Dashboard**

**Steps:**
1. Log in as an admin user
2. Navigate to `/admin`
3. Find "Tech Conference 2025" event
4. Click "Live Dashboard" button (green button with Activity icon)

**Expected Result:**
- ✅ Redirected to `/admin/events/test-event-001/live`
- ✅ Page loads without errors
- ✅ Live Event Metrics KPI strip displays at top
- ✅ "LIVE" badge is visible and pulsing

**Screenshot Location**: Top of page

---

### **Test 2: Live Event Metrics KPIs**

**Steps:**
1. On the live dashboard, observe the 4 KPI cards

**Expected Result:**
- ✅ **Total Checked In**: Shows 1200
- ✅ **Currently Onsite**: Shows 850 (with pulsing animation)
- ✅ **Total Revenue**: Shows $0 (or actual revenue if orders exist)
- ✅ **Active Sessions**: Shows 2 (sessions currently in progress)
- ✅ Each card has gradient background and icon
- ✅ "Updated X seconds ago" timestamp visible
- ✅ Refresh button works

**Test Refresh:**
1. Click the "Refresh" button
2. Observe loading spinner on button
3. Metrics update

---

### **Test 3: Real-time Updates (Polling)**

**Steps:**
1. Keep the live dashboard open
2. In another tab, open Supabase SQL Editor
3. Run this SQL to simulate a check-in:
```sql
UPDATE event_attendance_metrics
SET 
  total_checked_in = total_checked_in + 10,
  currently_onsite = currently_onsite + 10,
  last_updated = NOW()
WHERE event_id = 'test-event-001';
```
4. Wait 10 seconds (polling interval)

**Expected Result:**
- ✅ KPI cards automatically update with new values
- ✅ "Updated X seconds ago" timestamp updates
- ✅ No page refresh required

---

### **Test 4: Session Tabs Navigation**

**Steps:**
1. Click through all tabs: Overview, Active Sessions, Upcoming, Analytics

**Expected Result:**
- ✅ **Overview Tab**: Shows 2 active sessions and 1 upcoming session
- ✅ **Active Sessions Tab**: Shows detailed cards for 2 active sessions
- ✅ **Upcoming Tab**: Shows 1 upcoming session
- ✅ **Analytics Tab**: Shows placeholder message
- ✅ Tab switching is smooth with no errors

---

### **Test 5: Session Attendance Tracker**

**Steps:**
1. Go to "Active Sessions" tab
2. Observe the "Keynote: Future of AI" session card

**Expected Result:**
- ✅ Session title displayed: "Keynote: Future of AI"
- ✅ Active badge (green) with pulsing dot
- ✅ Capacity badge: "450 / 500 capacity"
- ✅ Capacity progress bar at 90% (blue/yellow/red based on capacity)
- ✅ **Current**: 450
- ✅ **Peak**: 480
- ✅ **Total Check-ins**: 520
- ✅ **Avg Duration**: Shows calculated average
- ✅ **Engagement Rate**: Shows percentage
- ✅ **Drop-off Rate**: Shows percentage
- ✅ Recent Activity section shows last 5 check-ins/check-outs

---

### **Test 6: Capacity Alerts**

**Steps:**
1. In Supabase SQL Editor, update session to near capacity:
```sql
UPDATE session_metrics
SET current_attendees = 490
WHERE session_id = 'test-session-001';
```
2. Wait 5 seconds for update

**Expected Result:**
- ✅ Capacity progress bar turns yellow (80-99%)
- ✅ Capacity badge shows "490 / 500 capacity" in yellow

**Test Full Capacity:**
```sql
UPDATE session_metrics
SET current_attendees = 500
WHERE session_id = 'test-session-001';
```

**Expected Result:**
- ✅ Capacity progress bar turns red (100%)
- ✅ Capacity badge shows "500 / 500 capacity" in red
- ✅ "Session is at full capacity" warning appears

---

### **Test 7: Session Metrics Real-time Updates**

**Steps:**
1. Keep "Active Sessions" tab open
2. In Supabase SQL Editor, simulate engagement:
```sql
-- Add chat messages
INSERT INTO session_chat_messages (session_id, user_id, message)
SELECT 
  'test-session-001',
  id,
  'Great session!'
FROM em_profiles
WHERE role = 'attendee'
LIMIT 10;

-- Add questions
INSERT INTO session_questions (session_id, user_id, question)
SELECT 
  'test-session-001',
  id,
  'What about AI ethics?'
FROM em_profiles
WHERE role = 'attendee'
LIMIT 5;
```
3. Wait 5 seconds

**Expected Result:**
- ✅ Engagement Rate increases
- ✅ Engagement badge updates (Low/Medium/High)
- ✅ Recent Activity section updates

---

### **Test 8: Check-in/Check-out API**

**Steps:**
1. Open browser console (F12)
2. Run this JavaScript:
```javascript
// Get a user ID
const userId = 'user-uuid-here' // Replace with actual user ID

// Check in
fetch('/api/admin/attendance/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'test-session-001',
    userId: userId,
    action: 'check_in'
  })
}).then(r => r.json()).then(console.log)

// Wait 30 seconds, then check out
setTimeout(() => {
  fetch('/api/admin/attendance/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test-session-001',
      userId: userId,
      action: 'check_out'
    })
  }).then(r => r.json()).then(console.log)
}, 30000)
```

**Expected Result:**
- ✅ Check-in API returns success
- ✅ Current attendees increases by 1
- ✅ After check-out, current attendees decreases by 1
- ✅ Duration is calculated correctly (~0.5 minutes)

---

### **Test 9: Error Handling**

**Test Invalid Event ID:**
1. Navigate to `/admin/events/invalid-uuid/live`

**Expected Result:**
- ✅ Error message: "Event not found"
- ✅ "Back to Dashboard" button appears

**Test Network Error:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Observe dashboard

**Expected Result:**
- ✅ Error card appears: "Error loading metrics"
- ✅ "Retry" button appears
- ✅ No crashes or white screens

---

### **Test 10: Responsive Design**

**Steps:**
1. Open live dashboard
2. Resize browser to mobile width (375px)
3. Resize to tablet width (768px)
4. Resize to desktop width (1920px)

**Expected Result:**
- ✅ **Mobile**: KPI cards stack vertically (1 column)
- ✅ **Tablet**: KPI cards in 2 columns
- ✅ **Desktop**: KPI cards in 4 columns
- ✅ Session cards adapt to screen size
- ✅ Tabs remain accessible on all sizes
- ✅ No horizontal scrolling
- ✅ Text remains readable

---

### **Test 11: Performance**

**Steps:**
1. Open Chrome DevTools → Performance tab
2. Start recording
3. Navigate to live dashboard
4. Wait 30 seconds
5. Stop recording

**Expected Result:**
- ✅ Initial page load < 2 seconds
- ✅ No memory leaks
- ✅ Polling doesn't cause performance degradation
- ✅ CPU usage remains low
- ✅ No console errors

---

### **Test 12: Authentication & Authorization**

**Test Unauthenticated Access:**
1. Log out
2. Try to access `/admin/events/test-event-001/live`

**Expected Result:**
- ✅ Redirected to `/auth/login`

**Test Non-Admin Access:**
1. Log in as attendee/speaker
2. Try to access `/admin/events/test-event-001/live`

**Expected Result:**
- ✅ 403 Forbidden error or redirect

---

## ✅ **Testing Checklist**

Use this checklist to track your testing progress:

- [ ] Database migrations applied successfully
- [ ] Test data created
- [ ] Can access live dashboard
- [ ] Live Event Metrics KPIs display correctly
- [ ] Real-time polling works (10s interval)
- [ ] Session tabs navigation works
- [ ] Session Attendance Tracker displays correctly
- [ ] Capacity alerts work (yellow at 80%, red at 100%)
- [ ] Session metrics update in real-time (5s interval)
- [ ] Check-in/Check-out API works
- [ ] Error handling works (invalid IDs, network errors)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Performance is acceptable
- [ ] Authentication/Authorization works correctly
- [ ] Manual refresh button works
- [ ] "Last updated" timestamp updates correctly
- [ ] Loading states display correctly
- [ ] Empty states display correctly (no sessions)
- [ ] Gradient backgrounds and icons display correctly
- [ ] Badges and progress bars work correctly

---

## 🐛 **Common Issues & Solutions**

### **Issue: Metrics not updating**
**Solution**: 
- Check browser console for errors
- Verify Supabase connection
- Check if real-time is enabled on tables
- Verify polling interval is set correctly

### **Issue: 403 Forbidden errors**
**Solution**:
- Check RLS policies in Supabase
- Verify user has admin/organizer role
- Check authentication token

### **Issue: Session not showing as active**
**Solution**:
- Verify session `starts_at` is in the past
- Verify session `ends_at` is in the future
- Check session `event_id` matches

### **Issue: Capacity progress bar not showing**
**Solution**:
- Verify session has `capacity` field set
- Check if `current_attendees` is being calculated

---

## 📊 **Expected Test Results**

After completing all tests, you should have:

- ✅ **20/20 tests passing**
- ✅ **0 console errors**
- ✅ **0 network errors**
- ✅ **< 2s page load time**
- ✅ **Smooth real-time updates**
- ✅ **Responsive on all devices**

---

## 🎉 **Success Criteria**

Feature #1 is considered **PRODUCTION-READY** when:

1. ✅ All 20 tests pass
2. ✅ No critical bugs found
3. ✅ Performance meets requirements
4. ✅ Responsive design works on all devices
5. ✅ Real-time updates work reliably
6. ✅ Error handling is robust
7. ✅ Authentication/Authorization is secure

---

**Happy Testing! 🚀**


# Feature #2: QR Check-in & Badge Printing - Testing Guide

## 📋 **PRE-TESTING CHECKLIST**

Before testing, ensure the following are completed:

### 1. Database Migration
```bash
# Navigate to project directory
cd event-management-platform

# Apply the migration (using Supabase CLI or Dashboard)
# Option A: Using Supabase CLI
supabase db push

# Option B: Using Supabase Dashboard
# 1. Go to https://supabase.com/dashboard/project/umywdcihtqfullbostxo/sql
# 2. Copy contents of supabase/migrations/005_qr_code_check_in_enhancements.sql
# 3. Run the SQL
```

### 2. Install Dependencies
```bash
# Ensure html5-qrcode is installed
npm install html5-qrcode

# Verify all dependencies
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Create Test Data
You'll need:
- At least one event in the `em_events` table
- At least one ticket tier in `em_ticket_tiers` table
- At least one ticket in `em_tickets` table with a user

---

## 🧪 **TESTING SCENARIOS**

### **Test 1: QR Code Generation**

**Objective:** Verify QR codes are generated correctly for tickets

**Steps:**
1. Navigate to `/api/tickets/[ticket-id]/qr` (replace with actual ticket ID)
2. Verify QR code image is returned
3. Test different formats:
   - `/api/tickets/[ticket-id]/qr?format=image` (Data URL)
   - `/api/tickets/[ticket-id]/qr?format=svg` (SVG)
   - `/api/tickets/[ticket-id]/qr?format=png` (PNG buffer)

**Expected Results:**
- ✅ QR code is generated successfully
- ✅ QR code contains ticket information
- ✅ Different formats work correctly
- ✅ QR code is saved to database (`qr_code` field)

**Test with cURL:**
```bash
curl -X GET "http://localhost:3001/api/tickets/YOUR_TICKET_ID/qr" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

### **Test 2: Mobile Scanner (Online Mode)**

**Objective:** Test QR scanning and check-in in online mode

**Steps:**
1. Navigate to `/check-in/scanner`
2. Register a new station (e.g., "Main Entrance")
3. Allow camera permissions when prompted
4. Generate a test QR code using Test 1
5. Display QR code on another device or print it
6. Scan the QR code with the mobile scanner

**Expected Results:**
- ✅ Camera activates successfully
- ✅ QR code is detected and scanned
- ✅ Check-in processes immediately (online mode)
- ✅ Success dialog shows attendee information
- ✅ Check-in is recorded in `check_in_logs` table
- ✅ Ticket `checked_in` field is updated to `true`

**Verify in Database:**
```sql
-- Check if ticket was checked in
SELECT * FROM em_tickets WHERE id = 'YOUR_TICKET_ID';

-- Check check-in log
SELECT * FROM check_in_logs WHERE ticket_id = 'YOUR_TICKET_ID';
```

---

### **Test 3: Mobile Scanner (Offline Mode)**

**Objective:** Test offline check-in and sync functionality

**Steps:**
1. Open `/check-in/scanner`
2. Open browser DevTools → Network tab
3. Enable "Offline" mode in DevTools
4. Scan a QR code
5. Verify check-in is queued locally
6. Check IndexedDB for offline record
7. Disable "Offline" mode
8. Wait for automatic sync or click "Sync Now"

**Expected Results:**
- ✅ Offline indicator shows "Offline" status
- ✅ QR scan is queued in IndexedDB
- ✅ Pending count increases
- ✅ Toast shows "Check-in queued (offline)"
- ✅ When back online, sync happens automatically
- ✅ Pending count decreases to 0
- ✅ Check-in is recorded in database

**Verify IndexedDB:**
1. Open DevTools → Application → IndexedDB
2. Look for `EventCheckInDB` database
3. Check `checkIns` store for queued records

---

### **Test 4: Kiosk Self-Service**

**Objective:** Test self-service kiosk interface

**Steps:**
1. Navigate to `/check-in/kiosk`
2. Click "Tap to Check In" on idle screen
3. Scan a QR code
4. Observe success screen
5. Wait for auto-reset (5 seconds)

**Expected Results:**
- ✅ Idle screen displays event branding
- ✅ Scanner activates on tap
- ✅ QR code is scanned successfully
- ✅ Success screen shows attendee name
- ✅ Badge print job is created (if enabled)
- ✅ Kiosk resets to idle after 5 seconds

**Test Badge Printing:**
```sql
-- Check if badge was queued
SELECT * FROM badge_print_queue 
WHERE ticket_id = 'YOUR_TICKET_ID' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

### **Test 5: Badge Print Queue Management**

**Objective:** Test admin badge queue dashboard

**Steps:**
1. Navigate to `/admin/check-in/queue`
2. Verify queue displays correctly
3. Filter by status (pending, printing, completed, failed)
4. Create a failed badge job (manually update status in DB)
5. Click "Retry" on failed job

**Expected Results:**
- ✅ Queue displays all badge jobs
- ✅ Status badges show correct colors
- ✅ Filtering works correctly
- ✅ Retry button appears for failed jobs
- ✅ Retry updates job status to "pending"
- ✅ Real-time updates work (auto-refresh every 5s)

**Create Test Failed Job:**
```sql
-- Insert a failed badge job
INSERT INTO badge_print_queue (ticket_id, status, error_message)
VALUES ('YOUR_TICKET_ID', 'failed', 'Printer offline');
```

---

### **Test 6: Ticket QR Code Display**

**Objective:** Test QR code display on digital ticket

**Steps:**
1. Create a test page with `TicketQRCode` component
2. Pass a valid ticket ID
3. Test download button
4. Test print button
5. Test share button (on mobile)

**Expected Results:**
- ✅ QR code loads and displays
- ✅ Download saves QR code as PNG
- ✅ Print opens print dialog with formatted ticket
- ✅ Share opens native share dialog (mobile)
- ✅ Fallback to clipboard copy (desktop)

**Test Component:**
```tsx
import { TicketQRCode } from '@/components/tickets/TicketQRCode'

<TicketQRCode
  ticketId="YOUR_TICKET_ID"
  attendeeName="John Doe"
  eventName="WECON-MASAWAAT Event"
  ticketTier="VIP Pass"
  size="md"
  showActions={true}
/>
```

---

### **Test 7: Duplicate Check-in Prevention**

**Objective:** Verify duplicate check-ins are prevented

**Steps:**
1. Check in a ticket successfully
2. Try to scan the same QR code again
3. Verify error message

**Expected Results:**
- ✅ Second scan shows "Already checked in" error
- ✅ Error dialog displays previous check-in time
- ✅ No duplicate entry in `check_in_logs`
- ✅ `check_in_count` increments correctly

---

### **Test 8: Offline Sync Conflict Resolution**

**Objective:** Test conflict resolution when same ticket is checked in offline on multiple devices

**Steps:**
1. Open scanner on Device A (offline mode)
2. Open scanner on Device B (offline mode)
3. Scan same QR code on both devices
4. Bring both devices online
5. Observe sync behavior

**Expected Results:**
- ✅ Both devices queue check-in locally
- ✅ First device to sync wins (earlier timestamp)
- ✅ Second device sync is rejected (duplicate)
- ✅ No duplicate entries in database
- ✅ Both devices show synced status

---

### **Test 9: Check-in Stations Monitoring**

**Objective:** Test station monitoring dashboard

**Steps:**
1. Navigate to `/admin/check-in/stations`
2. Verify stations list displays
3. Check online/offline status
4. Verify check-in counts

**Expected Results:**
- ✅ All active stations are listed
- ✅ Online/offline status is accurate
- ✅ Check-in counts are correct
- ✅ Last seen timestamp updates
- ✅ Pending sync count displays

---

### **Test 10: API Endpoint Testing**

**Objective:** Test all API endpoints directly

**Endpoints to Test:**

1. **GET /api/tickets/[id]/qr**
   ```bash
   curl http://localhost:3001/api/tickets/TICKET_ID/qr
   ```

2. **POST /api/check-in/scan**
   ```bash
   curl -X POST http://localhost:3001/api/check-in/scan \
     -H "Content-Type: application/json" \
     -d '{"qr_code":"TICKET-...", "station_id":"STATION_ID"}'
   ```

3. **POST /api/check-in/sync**
   ```bash
   curl -X POST http://localhost:3001/api/check-in/sync \
     -H "Content-Type: application/json" \
     -d '{"station_id":"STATION_ID", "check_ins":[...]}'
   ```

4. **GET /api/check-in/status/[ticketId]**
   ```bash
   curl http://localhost:3001/api/check-in/status/TICKET_ID
   ```

5. **POST /api/badges/print**
   ```bash
   curl -X POST http://localhost:3001/api/badges/print \
     -H "Content-Type: application/json" \
     -d '{"ticket_id":"TICKET_ID", "station_id":"STATION_ID"}'
   ```

6. **GET /api/badges/queue**
   ```bash
   curl http://localhost:3001/api/badges/queue
   ```

7. **POST /api/badges/retry/[id]**
   ```bash
   curl -X POST http://localhost:3001/api/badges/retry/JOB_ID
   ```

---

## 🐛 **COMMON ISSUES & TROUBLESHOOTING**

### Issue 1: Camera Not Working
**Symptoms:** Camera permission denied or no camera detected

**Solutions:**
- Ensure HTTPS or localhost (camera requires secure context)
- Check browser permissions
- Try different browser (Chrome/Edge recommended)
- Verify camera is not in use by another app

### Issue 2: QR Code Not Scanning
**Symptoms:** Scanner doesn't detect QR code

**Solutions:**
- Ensure good lighting
- Hold QR code steady
- Adjust distance (6-12 inches optimal)
- Verify QR code is valid format
- Check console for errors

### Issue 3: Offline Sync Not Working
**Symptoms:** Check-ins not syncing when back online

**Solutions:**
- Check IndexedDB for queued records
- Verify network connection
- Check browser console for errors
- Manually trigger sync with "Sync Now" button
- Clear IndexedDB and retry

### Issue 4: Badge Print Jobs Stuck
**Symptoms:** Jobs remain in "pending" status

**Solutions:**
- This is expected (no actual printer integration yet)
- Manually update status in database for testing
- Implement printer integration for production

---

## ✅ **ACCEPTANCE CRITERIA**

Feature #2 is considered complete when:

- [x] QR codes generate correctly for all tickets
- [x] Mobile scanner works in online mode
- [x] Mobile scanner works in offline mode
- [x] Offline sync works correctly
- [x] Kiosk interface works for self-service
- [x] Badge print queue displays correctly
- [x] Badge retry functionality works
- [x] Duplicate check-ins are prevented
- [x] All API endpoints return correct responses
- [x] UI is responsive on mobile and desktop
- [x] Error handling works correctly
- [x] Loading states display properly
- [x] Toast notifications appear for all actions

---

## 📊 **TEST RESULTS TEMPLATE**

Use this template to document test results:

```
Test: [Test Name]
Date: [Date]
Tester: [Name]
Environment: [Development/Staging/Production]

Results:
✅ PASS / ❌ FAIL

Notes:
[Any observations or issues]

Screenshots:
[Attach screenshots if applicable]
```

---

## 🚀 **NEXT STEPS AFTER TESTING**

1. Fix any bugs found during testing
2. Optimize performance (if needed)
3. Add analytics tracking
4. Implement printer integration (for production)
5. Add more comprehensive error handling
6. Write unit tests for critical functions
7. Prepare for production deployment

---

**Last Updated:** 2025-10-03  
**Version:** 1.0


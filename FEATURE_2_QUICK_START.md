# Feature #2: QR Check-in & Badge Printing - Quick Start Guide

## 🚀 **GET STARTED IN 5 MINUTES**

This guide will help you quickly set up and test the QR check-in system.

---

## ⚡ **QUICK SETUP**

### Step 1: Apply Database Migration

```bash
# Navigate to project directory
cd event-management-platform

# Option A: Using Supabase Dashboard (Recommended)
# 1. Go to https://supabase.com/dashboard/project/umywdcihtqfullbostxo/sql
# 2. Copy contents of supabase/migrations/005_qr_code_check_in_enhancements.sql
# 3. Paste and run the SQL

# Option B: Using Supabase CLI
supabase db push
```

### Step 2: Verify Dependencies

```bash
# Check if html5-qrcode is installed
npm list html5-qrcode

# If not installed, run:
npm install html5-qrcode
```

### Step 3: Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:3001`

---

## 🎯 **QUICK TEST**

### Test 1: Generate QR Code (2 minutes)

1. **Get a ticket ID from your database:**
   ```sql
   SELECT id FROM em_tickets LIMIT 1;
   ```

2. **Open in browser:**
   ```
   http://localhost:3001/api/tickets/YOUR_TICKET_ID/qr
   ```

3. **You should see:**
   - JSON response with QR code data URL
   - Save this for testing scanner

### Test 2: Mobile Scanner (3 minutes)

1. **Open scanner:**
   ```
   http://localhost:3001/check-in/scanner
   ```

2. **Register station:**
   - Enter station name: "Test Station"
   - Click "Register Station"

3. **Allow camera permissions**

4. **Scan QR code:**
   - Display QR code from Test 1 on another device
   - Or print it out
   - Point camera at QR code

5. **Verify check-in:**
   - Success dialog should appear
   - Check database:
     ```sql
     SELECT * FROM check_in_logs ORDER BY created_at DESC LIMIT 1;
     ```

### Test 3: Kiosk Mode (2 minutes)

1. **Open kiosk:**
   ```
   http://localhost:3001/check-in/kiosk
   ```

2. **Tap "Tap to Check In"**

3. **Scan QR code**

4. **See success screen**

5. **Wait for auto-reset (5 seconds)**

---

## 📱 **AVAILABLE ROUTES**

### For Staff
- `/check-in/scanner` - Mobile scanner interface

### For Attendees
- `/check-in/kiosk` - Self-service kiosk

### For Admins
- `/admin/check-in/queue` - Badge print queue
- `/admin/check-in/stations` - Station monitoring

### API Endpoints
- `GET /api/tickets/[id]/qr` - Get QR code
- `POST /api/check-in/scan` - Process check-in
- `POST /api/check-in/sync` - Sync offline check-ins
- `GET /api/check-in/status/[ticketId]` - Check status
- `POST /api/badges/print` - Print badge
- `GET /api/badges/queue` - Get queue
- `POST /api/badges/retry/[id]` - Retry print

---

## 🧪 **TEST OFFLINE MODE**

1. **Open scanner:** `http://localhost:3001/check-in/scanner`

2. **Open DevTools:** Press F12

3. **Go to Network tab**

4. **Enable "Offline" mode**

5. **Scan a QR code**

6. **Verify:**
   - Toast shows "Check-in queued (offline)"
   - Pending count increases
   - Check IndexedDB (Application tab → IndexedDB → EventCheckInDB)

7. **Disable "Offline" mode**

8. **Wait or click "Sync Now"**

9. **Verify:**
   - Pending count decreases to 0
   - Check-in appears in database

---

## 🎨 **UI COMPONENTS**

### MobileScanner
```tsx
import { MobileScanner } from '@/components/check-in/MobileScanner'

<MobileScanner
  stationId="station-123"
  eventId="event-456"
  onCheckInSuccess={(data) => console.log(data)}
/>
```

### KioskCheckIn
```tsx
import { KioskCheckIn } from '@/components/check-in/KioskCheckIn'

<KioskCheckIn
  stationId="kiosk-123"
  eventId="event-456"
  eventName="My Event"
  autoPrintBadge={true}
  resetDelay={5000}
/>
```

### TicketQRCode
```tsx
import { TicketQRCode } from '@/components/tickets/TicketQRCode'

<TicketQRCode
  ticketId="ticket-123"
  attendeeName="John Doe"
  eventName="My Event"
  ticketTier="VIP"
  size="md"
  showActions={true}
/>
```

### BadgePrintQueue
```tsx
import { BadgePrintQueue } from '@/components/admin/BadgePrintQueue'

<BadgePrintQueue
  stationId="station-123" // optional
  refreshInterval={5000}
/>
```

### OfflineSyncIndicator
```tsx
import { OfflineSyncIndicator } from '@/components/check-in/OfflineSyncIndicator'

<OfflineSyncIndicator
  isOnline={true}
  pendingCount={5}
  isSyncing={false}
  lastSyncAt="2025-10-03T10:30:00Z"
  onSyncNow={() => {}}
  compact={false}
/>
```

---

## 🔧 **TROUBLESHOOTING**

### Camera Not Working
- Ensure you're on HTTPS or localhost
- Check browser permissions
- Try Chrome/Edge (best support)

### QR Code Not Scanning
- Ensure good lighting
- Hold steady 6-12 inches away
- Verify QR code is valid

### Offline Sync Not Working
- Check IndexedDB in DevTools
- Verify network connection
- Click "Sync Now" manually

### Badge Jobs Stuck
- This is expected (no printer integration yet)
- Manually update status in database for testing

---

## 📚 **FULL DOCUMENTATION**

For comprehensive testing and documentation:

- **Testing Guide:** `FEATURE_2_TESTING_GUIDE.md`
- **Implementation Summary:** `FEATURE_2_IMPLEMENTATION_SUMMARY.md`
- **Progress Report:** `FEATURE_2_IMPLEMENTATION_PROGRESS.md`

---

## ✅ **CHECKLIST**

Before going to production:

- [ ] Database migration applied
- [ ] All test scenarios passed
- [ ] Tested on actual mobile devices
- [ ] Offline sync verified
- [ ] Badge printing tested
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] Analytics added
- [ ] Printer integration implemented
- [ ] User training completed

---

## 🆘 **NEED HELP?**

1. Check the testing guide for detailed scenarios
2. Review the implementation summary for architecture
3. Check browser console for errors
4. Verify database migration was applied
5. Ensure all dependencies are installed

---

**Status:** ✅ Ready to Test  
**Last Updated:** 2025-10-03


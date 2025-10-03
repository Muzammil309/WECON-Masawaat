# Feature #2 Testing - Step-by-Step Guide

## ✅ **BUILD STATUS: SUCCESS!**

Production build completed successfully! All TypeScript errors are fixed.

---

## 🚀 **TESTING PLAN**

We'll test Feature #2 in this order:
1. ✅ **Production Build** - COMPLETE
2. 🔄 **Start Dev Server** - NEXT
3. 📊 **Create Test Data** - Database setup
4. 🎫 **Test QR Code Generation** - API endpoint
5. 📱 **Test Mobile Scanner** - Check-in interface
6. 🖥️ **Test Kiosk Interface** - Self-service check-in
7. 🖨️ **Test Badge Queue** - Print queue management
8. 📡 **Test Offline Sync** - Offline functionality

---

## 📋 **STEP 1: START DEVELOPMENT SERVER** ✅

### **Command:**
```bash
npm run dev
```

### **Expected Output:**
```
▲ Next.js 15.5.4
- Local:        http://localhost:3001
- Environments: .env.local

✓ Starting...
✓ Ready in 2.3s
```

### **Verify:**
- Server starts without errors
- Port 3001 is accessible
- No compilation errors

---

## 📋 **STEP 2: CREATE TEST DATA**

### **2.1 Create Test Event**

Open Supabase SQL Editor and run:

```sql
-- Create a test event
INSERT INTO em_events (
  id,
  title,
  description,
  start_date,
  end_date,
  location,
  venue_name,
  status,
  organizer_id
) VALUES (
  'test-event-001',
  'Tech Conference 2025',
  'Annual technology conference with workshops and networking',
  '2025-12-01 09:00:00+00',
  '2025-12-01 18:00:00+00',
  'San Francisco, CA',
  'Moscone Center',
  'published',
  (SELECT id FROM em_profiles WHERE role = 'admin' LIMIT 1)
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status;
```

### **2.2 Create Test Ticket Tier**

```sql
-- Create a ticket tier
INSERT INTO em_ticket_tiers (
  id,
  event_id,
  name,
  description,
  price,
  quantity_available,
  is_active
) VALUES (
  'tier-vip-001',
  'test-event-001',
  'VIP Pass',
  'Full access to all sessions and VIP lounge',
  299.00,
  100,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;
```

### **2.3 Create Test Tickets**

```sql
-- Create test tickets with QR codes
INSERT INTO em_tickets (
  id,
  user_id,
  ticket_tier_id,
  qr_code,
  status,
  checked_in
) VALUES 
  (
    'ticket-001',
    (SELECT id FROM em_profiles LIMIT 1),
    'tier-vip-001',
    'TICKET-ticket-001-test-event-001-' || EXTRACT(EPOCH FROM NOW())::bigint || '-ABC123',
    'confirmed',
    false
  ),
  (
    'ticket-002',
    (SELECT id FROM em_profiles LIMIT 1 OFFSET 1),
    'tier-vip-001',
    'TICKET-ticket-002-test-event-001-' || EXTRACT(EPOCH FROM NOW())::bigint || '-DEF456',
    'confirmed',
    false
  ),
  (
    'ticket-003',
    (SELECT id FROM em_profiles LIMIT 1 OFFSET 2),
    'tier-vip-001',
    'TICKET-ticket-003-test-event-001-' || EXTRACT(EPOCH FROM NOW())::bigint || '-GHI789',
    'confirmed',
    false
  )
ON CONFLICT (id) DO UPDATE SET
  qr_code = EXCLUDED.qr_code,
  status = EXCLUDED.status;
```

### **2.4 Create Check-in Station**

```sql
-- Create a check-in station
INSERT INTO check_in_stations (
  id,
  event_id,
  station_name,
  location,
  is_online
) VALUES (
  'station-main-001',
  'test-event-001',
  'Main Entrance',
  'Lobby - North Side',
  true
) ON CONFLICT (id) DO UPDATE SET
  station_name = EXCLUDED.station_name,
  is_online = EXCLUDED.is_online;
```

### **Verify Test Data:**

```sql
-- Check everything was created
SELECT 'Events' as type, COUNT(*) as count FROM em_events WHERE id = 'test-event-001'
UNION ALL
SELECT 'Ticket Tiers', COUNT(*) FROM em_ticket_tiers WHERE id = 'tier-vip-001'
UNION ALL
SELECT 'Tickets', COUNT(*) FROM em_tickets WHERE ticket_tier_id = 'tier-vip-001'
UNION ALL
SELECT 'Stations', COUNT(*) FROM check_in_stations WHERE id = 'station-main-001';
```

**Expected:**
```
type          | count
--------------+-------
Events        | 1
Ticket Tiers  | 1
Tickets       | 3
Stations      | 1
```

---

## 📋 **STEP 3: TEST QR CODE GENERATION API**

### **3.1 Test PNG Format**

**URL:** `http://localhost:3001/api/tickets/ticket-001/qr?format=png&width=300`

**Method:** GET

**Expected Response:**
- Status: 200 OK
- Content-Type: `image/png`
- Binary PNG image data

**Test in Browser:**
1. Open URL in browser
2. Should display QR code image
3. Right-click → Save image
4. Verify it's a valid PNG file

**Test with cURL:**
```bash
curl http://localhost:3001/api/tickets/ticket-001/qr?format=png --output test-qr.png
file test-qr.png
```

**Expected:**
```
test-qr.png: PNG image data, 300 x 300, 8-bit/color RGBA
```

### **3.2 Test SVG Format**

**URL:** `http://localhost:3001/api/tickets/ticket-001/qr?format=svg&width=300`

**Expected Response:**
- Status: 200 OK
- Content-Type: `image/svg+xml`
- SVG XML data

**Test in Browser:**
1. Open URL in browser
2. Should display QR code as SVG
3. View page source to see SVG XML

### **3.3 Test Data URL Format (Default)**

**URL:** `http://localhost:3001/api/tickets/ticket-001/qr`

**Expected Response:**
```json
{
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "qrString": "TICKET-ticket-001-test-event-001-1234567890-ABC123",
  "ticketId": "ticket-001",
  "format": "data-url"
}
```

### **3.4 Test Invalid Ticket**

**URL:** `http://localhost:3001/api/tickets/invalid-ticket-id/qr`

**Expected Response:**
```json
{
  "error": "Ticket not found"
}
```
**Status:** 404 Not Found

---

## 📋 **STEP 4: TEST MOBILE SCANNER**

### **4.1 Access Scanner Page**

**URL:** `http://localhost:3001/check-in/scanner`

**Expected:**
- Page loads without errors
- Shows "QR Code Scanner" interface
- Camera permission request appears
- Station registration form visible

### **4.2 Register Station**

1. **Enter station details:**
   - Station Name: "Test Scanner 1"
   - Location: "Testing Lab"

2. **Click "Register Station"**

3. **Expected:**
   - Success message appears
   - Station ID saved to localStorage
   - Scanner interface activates

### **4.3 Test QR Scanning**

**Option A: Use Physical QR Code**
1. Generate QR code from Step 3
2. Print or display on another device
3. Point camera at QR code
4. Should auto-detect and process

**Option B: Use Test Mode**
1. Open browser console (F12)
2. Manually trigger scan:
   ```javascript
   // Simulate QR scan
   const qrString = 'TICKET-ticket-001-test-event-001-1234567890-ABC123'
   // Trigger scan event
   ```

### **4.4 Verify Check-in**

After successful scan:
- ✅ Success message appears
- ✅ Attendee name displayed
- ✅ Check-in time recorded
- ✅ Database updated

**Verify in Database:**
```sql
SELECT * FROM check_in_logs 
WHERE ticket_id = 'ticket-001'
ORDER BY created_at DESC
LIMIT 1;
```

---

## 📋 **STEP 5: TEST KIOSK INTERFACE**

### **5.1 Access Kiosk Page**

**URL:** `http://localhost:3001/check-in/kiosk`

**Expected:**
- Full-screen kiosk interface
- Large "Scan Your Ticket" message
- QR scanner active
- Clean, simple UI

### **5.2 Test Self-Service Check-in**

1. **Scan QR code** (ticket-002)
2. **Expected:**
   - Large success animation
   - Welcome message with attendee name
   - "Check-in Successful" confirmation
   - Auto-reset after 5 seconds

### **5.3 Test Error Handling**

1. **Scan invalid QR code**
2. **Expected:**
   - Error message displayed
   - "Ticket not found" or "Already checked in"
   - Auto-reset after 3 seconds

---

## 📋 **STEP 6: TEST BADGE PRINT QUEUE**

### **6.1 Access Queue Management**

**URL:** `http://localhost:3001/admin/check-in/queue`

**Expected:**
- Badge queue dashboard loads
- Shows queue statistics
- Lists pending/printing/completed badges
- Filter and search options

### **6.2 Add Badge to Queue**

**API Test:**
```bash
curl -X POST http://localhost:3001/api/badges/print \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": "ticket-001",
    "station_id": "station-main-001",
    "template": "standard",
    "priority": 1
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "job": {
    "id": "...",
    "status": "pending",
    "ticket_id": "ticket-001"
  }
}
```

### **6.3 Verify Queue Display**

1. **Refresh queue page**
2. **Expected:**
   - New badge appears in "Pending" section
   - Shows attendee name
   - Shows ticket tier
   - Shows priority

### **6.4 Test Queue Actions**

1. **Click "Print" button**
2. **Expected:**
   - Status changes to "printing"
   - Moves to "Printing" section

3. **Click "Complete" button**
4. **Expected:**
   - Status changes to "completed"
   - Moves to "Completed" section

---

## 📋 **STEP 7: TEST OFFLINE SYNC**

### **7.1 Enable Offline Mode**

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Check "Offline" checkbox**
4. **Or use Application → Service Workers → Offline**

### **7.2 Test Offline Check-in**

1. **Go to scanner page** (should still work)
2. **Scan QR code** (ticket-003)
3. **Expected:**
   - Check-in processed locally
   - Saved to IndexedDB
   - "Offline - will sync when online" message
   - Offline indicator visible

### **7.3 Verify IndexedDB Storage**

**In DevTools:**
1. **Application tab → IndexedDB**
2. **Open "check-in-db" database**
3. **Check "checkIns" store**
4. **Expected:**
   - Offline check-in record present
   - `synced: false`
   - All check-in data stored

### **7.4 Test Auto-Sync**

1. **Disable offline mode** (uncheck "Offline")
2. **Wait 30 seconds** (auto-sync interval)
3. **Expected:**
   - Sync indicator shows "Syncing..."
   - Records uploaded to server
   - IndexedDB records marked as synced
   - Success message appears

### **7.5 Verify Sync in Database**

```sql
SELECT * FROM check_in_logs 
WHERE ticket_id = 'ticket-003'
AND is_offline_sync = true
ORDER BY created_at DESC
LIMIT 1;
```

**Expected:**
- Record exists
- `is_offline_sync = true`
- `synced_at` timestamp present

---

## ✅ **TESTING CHECKLIST**

### **Build & Setup:**
- [x] Production build succeeds
- [ ] Dev server starts
- [ ] Test data created

### **QR Code API:**
- [ ] PNG format works
- [ ] SVG format works
- [ ] Data URL format works
- [ ] Invalid ticket returns 404

### **Mobile Scanner:**
- [ ] Page loads
- [ ] Station registration works
- [ ] Camera access granted
- [ ] QR scanning works
- [ ] Check-in recorded

### **Kiosk Interface:**
- [ ] Full-screen mode works
- [ ] Self-service check-in works
- [ ] Success animation displays
- [ ] Auto-reset works

### **Badge Queue:**
- [ ] Queue dashboard loads
- [ ] Add badge to queue works
- [ ] Queue displays correctly
- [ ] Status updates work

### **Offline Sync:**
- [ ] Offline mode works
- [ ] Check-ins saved to IndexedDB
- [ ] Offline indicator shows
- [ ] Auto-sync works
- [ ] Records synced to database

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Camera Not Working**

**Solution:**
1. Check browser permissions
2. Use HTTPS (or localhost)
3. Try different browser
4. Check console for errors

### **Issue: QR Code Not Scanning**

**Solution:**
1. Ensure good lighting
2. Hold QR code steady
3. Check QR code is valid
4. Try different QR code size

### **Issue: Offline Sync Not Working**

**Solution:**
1. Check IndexedDB is enabled
2. Verify service worker registered
3. Check network tab for sync requests
4. Clear IndexedDB and retry

---

**Next:** Start dev server and begin testing!


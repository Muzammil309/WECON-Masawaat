# Quick Test Reference Card

## 🚀 **QUICK START**

### 1. Apply Migration
```
URL: https://supabase.com/dashboard/project/umywdcihtqfullbostxo/sql
File: supabase/migrations/005_qr_code_check_in_enhancements.sql
Action: Copy → Paste → Run
```

### 2. Start Server
```bash
cd "d:\event management\event-management-platform"
npm run dev
```

### 3. Test URLs
```
QR Generation:  http://localhost:3001/api/tickets/[TICKET_ID]/qr
Mobile Scanner: http://localhost:3001/check-in/scanner
Kiosk:          http://localhost:3001/check-in/kiosk
Badge Queue:    http://localhost:3001/admin/check-in/queue
Stations:       http://localhost:3001/admin/check-in/stations
```

---

## 📝 **QUICK SQL QUERIES**

### Create Test Ticket
```sql
-- Get your user ID
SELECT id, email FROM em_profiles LIMIT 1;

-- Get event and tier IDs
SELECT e.id as event_id, tt.id as tier_id
FROM em_events e
JOIN em_ticket_tiers tt ON tt.event_id = e.id
LIMIT 1;

-- Create ticket
INSERT INTO em_tickets (user_id, ticket_tier_id, status)
VALUES ('USER_ID', 'TIER_ID', 'confirmed')
RETURNING id;
```

### Check Check-in Status
```sql
SELECT 
  t.id,
  t.checked_in,
  t.checked_in_at,
  t.check_in_count,
  cl.checked_in_at as log_time,
  cl.check_in_method
FROM em_tickets t
LEFT JOIN check_in_logs cl ON cl.ticket_id = t.id
WHERE t.id = 'TICKET_ID';
```

### Create Badge Job
```sql
INSERT INTO badge_print_queue (ticket_id, status, priority)
VALUES ('TICKET_ID', 'pending', 1)
RETURNING id;
```

---

## ✅ **QUICK CHECKLIST**

- [ ] Migration applied
- [ ] Server running
- [ ] QR code generated
- [ ] Scanner works
- [ ] Check-in recorded
- [ ] Kiosk works
- [ ] Badge queue works
- [ ] Offline mode works
- [ ] Sync works

---

## 🐛 **QUICK FIXES**

**Camera not working?**
→ Use Chrome/Edge, allow permissions

**QR not scanning?**
→ Good lighting, 6-12 inches away

**Unauthorized error?**
→ Log in to Supabase

**Database error?**
→ Check migration applied

---

## 📞 **NEED HELP?**

Share:
1. Error message
2. Browser console (F12)
3. Terminal output
4. Screenshots

---

**Full Guide:** `PHASE_1_TESTING_INSTRUCTIONS.md`


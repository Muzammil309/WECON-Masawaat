# Feature #3: Exhibitor Lead Capture & Real-time Lead Stream
## Implementation Plan

**Status:** 🟡 IN PROGRESS  
**Started:** 2025-10-03  
**Priority:** HIGH (Revenue driver for exhibitors)

---

## 📋 **OVERVIEW**

Feature #3 provides exhibitors with tools to capture and manage leads during events. This includes:

- **Badge Scanning** - QR/NFC scanning of attendee badges
- **Lead Management** - Notes, scoring, and qualification
- **Real-time Lead Stream** - Live dashboard showing new leads
- **CRM Export** - Export to CSV, HubSpot, Salesforce
- **Exhibitor Portal** - Self-service lead management

---

## 🏗️ **ARCHITECTURE**

### **Database Schema (Already Exists)**
- ✅ `exhibitor_booths` - Booth information
- ✅ `lead_captures` - Lead capture records
- ✅ `exhibitor_analytics` - Booth analytics

### **Components to Build**
1. **Badge Scanner** - Scan attendee QR codes
2. **Lead Capture Form** - Add notes and scoring
3. **Lead Stream Dashboard** - Real-time lead feed
4. **Lead Management Table** - View and manage all leads
5. **CRM Export** - Export functionality
6. **Exhibitor Portal** - Self-service interface

---

## 📁 **FILE STRUCTURE**

### **API Routes**
```
src/app/api/exhibitor/
├── booths/
│   ├── route.ts                      # GET/POST booths
│   └── [id]/route.ts                 # GET/PATCH/DELETE booth
├── leads/
│   ├── capture/route.ts              # POST capture lead
│   ├── route.ts                      # GET leads
│   ├── [id]/route.ts                 # GET/PATCH/DELETE lead
│   └── export/route.ts               # POST export leads
└── analytics/
    └── [boothId]/route.ts            # GET booth analytics
```

### **Components**
```
src/components/exhibitor/
├── BadgeScanner.tsx                  # QR scanner for badges
├── LeadCaptureForm.tsx               # Capture form with notes
├── LeadStreamDashboard.tsx           # Real-time lead feed
├── LeadManagementTable.tsx           # Table view of leads
├── LeadExportDialog.tsx              # Export dialog
├── BoothAnalytics.tsx                # Analytics cards
└── LeadDetailsDialog.tsx             # Lead details modal
```

### **Pages**
```
src/app/exhibitor/
├── booths/
│   └── [id]/
│       ├── page.tsx                  # Booth dashboard
│       ├── capture/page.tsx          # Lead capture page
│       └── leads/page.tsx            # Lead management
└── portal/page.tsx                   # Exhibitor portal home
```

### **Utilities & Hooks**
```
src/lib/
├── hooks/
│   ├── useLeadStream.ts              # Real-time lead stream
│   └── useBoothAnalytics.ts          # Booth analytics
└── types/
    └── exhibitor.ts                  # TypeScript types
```

---

## 🎯 **IMPLEMENTATION PHASES**

### **Phase 1: Core Lead Capture (Priority 1)**
1. TypeScript types for exhibitor entities
2. API routes for lead capture
3. Badge scanner component (reuse QR scanner from Feature #2)
4. Lead capture form with notes and scoring
5. Basic lead list view

### **Phase 2: Real-time Lead Stream (Priority 2)**
6. Real-time subscription hook
7. Lead stream dashboard component
8. Live notifications for new leads
9. Lead filtering and search

### **Phase 3: CRM Export (Priority 3)**
10. CSV export functionality
11. HubSpot integration (API)
12. Salesforce integration (API)
13. Export dialog with format selection

### **Phase 4: Exhibitor Portal (Priority 4)**
14. Booth analytics dashboard
15. Lead management table with actions
16. Lead details modal
17. Exhibitor portal home page

---

## 🔑 **KEY FEATURES**

### 1. **Badge Scanning**
- Reuse QR scanner from Feature #2
- Scan attendee badge QR codes
- Auto-populate attendee information
- Duplicate lead detection

### 2. **Lead Capture Form**
- Attendee information (auto-filled from scan)
- Lead notes (text area)
- Lead scoring (0-100 slider)
- Interest level (hot/warm/cold dropdown)
- Custom fields (JSONB)
- Follow-up checkbox

### 3. **Real-time Lead Stream**
- Live feed of new leads
- Real-time updates using Supabase Realtime
- Lead cards with attendee info
- Quick actions (view, edit, export)
- Filter by interest level

### 4. **Lead Management**
- Table view with sorting and filtering
- Search by attendee name/email
- Bulk actions (export, delete)
- Lead details modal
- Edit lead information
- Mark as exported

### 5. **CRM Export**
- CSV export with custom fields
- HubSpot API integration
- Salesforce API integration
- Export history tracking
- Scheduled exports

### 6. **Booth Analytics**
- Total leads captured
- Leads by interest level (hot/warm/cold)
- Average lead score
- Leads over time chart
- Top performing staff
- Export statistics

---

## 📊 **DATA FLOW**

```
┌─────────────────────────────────────────────────────────────┐
│                    EXHIBITOR LEAD CAPTURE                   │
│                                                             │
│  1. Scan Badge → 2. Fill Form → 3. Save Lead              │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │ Badge Scan   │         │ Manual Entry │                │
│  │ (QR Code)    │         │              │                │
│  └──────┬───────┘         └──────┬───────┘                │
│         │                        │                         │
│         ▼                        ▼                         │
│  ┌─────────────────────────────────────┐                  │
│  │    Lead Capture Form                │                  │
│  │  - Attendee info (auto-filled)      │                  │
│  │  - Notes                            │                  │
│  │  - Lead score                       │                  │
│  │  - Interest level                   │                  │
│  └──────────────┬──────────────────────┘                  │
│                 │                                          │
│                 ▼                                          │
│  ┌─────────────────────────────────────┐                  │
│  │  POST /api/exhibitor/leads/capture  │                  │
│  └──────────────┬──────────────────────┘                  │
│                 │                                          │
│                 ▼                                          │
│  ┌─────────────────────────────────────┐                  │
│  │     Supabase PostgreSQL             │                  │
│  │  - lead_captures (insert)           │                  │
│  │  - exhibitor_analytics (update)     │                  │
│  └──────────────┬──────────────────────┘                  │
│                 │                                          │
│                 ▼                                          │
│  ┌─────────────────────────────────────┐                  │
│  │   Supabase Realtime Subscription    │                  │
│  │   → Lead Stream Dashboard           │                  │
│  └─────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 **IMPLEMENTATION ORDER**

### **Step 1: TypeScript Types & API Routes**
- Create `src/lib/types/exhibitor.ts`
- Create API routes for booths, leads, analytics
- Test API endpoints

### **Step 2: Badge Scanner & Lead Capture**
- Create `BadgeScanner.tsx` (reuse QR scanner)
- Create `LeadCaptureForm.tsx`
- Create lead capture page

### **Step 3: Lead Management**
- Create `LeadManagementTable.tsx`
- Create `LeadDetailsDialog.tsx`
- Create lead management page

### **Step 4: Real-time Lead Stream**
- Create `useLeadStream.ts` hook
- Create `LeadStreamDashboard.tsx`
- Add real-time subscriptions

### **Step 5: CRM Export**
- Create CSV export functionality
- Create `LeadExportDialog.tsx`
- Add export API routes

### **Step 6: Booth Analytics**
- Create `useBoothAnalytics.ts` hook
- Create `BoothAnalytics.tsx`
- Create booth dashboard page

---

## ✅ **ACCEPTANCE CRITERIA**

- [ ] Exhibitors can scan attendee badges
- [ ] Lead capture form works with notes and scoring
- [ ] Leads are saved to database
- [ ] Real-time lead stream updates automatically
- [ ] Leads can be filtered and searched
- [ ] CSV export works correctly
- [ ] HubSpot integration works (if configured)
- [ ] Salesforce integration works (if configured)
- [ ] Booth analytics display correctly
- [ ] Exhibitor portal is accessible
- [ ] Duplicate lead detection works
- [ ] Lead editing works
- [ ] Bulk actions work
- [ ] Export history is tracked

---

## 📝 **NEXT STEPS**

1. Create TypeScript types
2. Create API routes
3. Create badge scanner component
4. Create lead capture form
5. Create lead management table
6. Create real-time lead stream
7. Create CRM export functionality
8. Create booth analytics
9. Test all features
10. Write documentation

---

**Last Updated:** 2025-10-03  
**Status:** Ready to start implementation


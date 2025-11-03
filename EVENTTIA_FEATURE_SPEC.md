# WECON MASAWAAT - Feature Specification & Implementation Plan
## Inspired by Eventtia Event Management Platform

**Date:** 2025-11-03  
**Version:** 1.0  
**Status:** Planning Phase

---

## Table of Contents

1. [Feature Mapping](#1-feature-mapping)
2. [Implementation Phases](#2-implementation-phases)
3. [Database Schema](#3-database-schema)
4. [Component Architecture](#4-component-architecture)
5. [API Endpoints](#5-api-endpoints)
6. [Design System](#6-design-system)
7. [Timeline & Resources](#7-timeline--resources)

---

## 1. Feature Mapping

### 1.1 Already Implemented ✅

| Feature | Status | Location |
|---------|--------|----------|
| Authentication (Admin/Attendee) | ✅ Complete | `/auth/signin`, `/auth/signup` |
| Role-based Dashboard | ✅ Complete | `/dashboard/vision` |
| Admin Overview (KPIs) | ✅ Complete | `AdminOverviewTab` |
| Attendee Overview | ✅ Complete | `AttendeeOverviewTab` |
| Mock Data System | ✅ Complete | `/lib/mock-data/dashboard.ts` |
| Glassmorphism Design | ✅ Complete | Global CSS |
| Stat Cards | ✅ Complete | `StatCard` component |
| Empty States | ✅ Complete | `EmptyState` component |

### 1.2 Phase 2: Event Management (Priority 1)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| Event Creation Wizard | Multi-step event creation form | High |
| Event Calendar View | Calendar component with event listings | High |
| Event Templates | Reusable event templates | Medium |
| Event Status Tracking | Draft/Published/Live/Completed states | High |
| Event Cloning | Duplicate existing events | Low |

### 1.3 Phase 2: Registration & Ticketing (Priority 1)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| Custom Registration Forms | Dynamic form builder | High |
| Multiple Ticket Types | VIP, General, Early Bird, Group | High |
| Tiered Pricing | Price tiers with date ranges | Medium |
| Discount Codes | Promo code system | Medium |
| Waitlist Management | Waitlist with auto-promotion | Low |
| Payment Integration | Stripe/PayPal integration | High |

### 1.4 Phase 2: Agenda & Schedule (Priority 2)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| Session Management | Create/edit/delete sessions | High |
| Speaker Profiles | Speaker directory with bios | High |
| Personal Agenda | Attendee custom schedule | Medium |
| Session Capacity | Limit attendees per session | Medium |
| Session Check-in | QR code session check-in | Low |

### 1.5 Phase 3: Check-in & Access (Priority 2)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| QR Code Scanning | Mobile QR scanner | High |
| Badge Printing | PDF badge generation | Medium |
| Self-Service Kiosks | Kiosk mode interface | Low |
| Real-time Attendance | Live attendance tracking | Medium |
| Access Control | Role-based access | High |

### 1.6 Phase 3: Analytics & Reporting (Priority 2)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| Real-time Dashboards | Live analytics dashboard | High |
| Custom Reports | Report builder | Medium |
| Data Export | CSV/Excel/PDF export | High |
| Engagement Metrics | App usage, interactions | Medium |
| Revenue Reports | Financial analytics | High |

### 1.7 Phase 4: Networking (Priority 3)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| Attendee Directory | Searchable attendee list | High |
| Matchmaking | AI-powered matching | Low |
| Meeting Scheduler | 1-on-1 meeting booking | Medium |
| In-app Messaging | Real-time chat | Medium |
| Business Card Exchange | Digital business cards | Low |

### 1.8 Phase 4: Mobile App (Priority 3)

| Eventtia Feature | WECON MASAWAAT Implementation | Priority |
|------------------|-------------------------------|----------|
| PWA Support | Progressive Web App | High |
| Push Notifications | Web push notifications | Medium |
| Offline Mode | Service worker caching | Low |
| Native App | React Native app | Low |

---

## 2. Implementation Phases

### Phase 2: Event Management Core (Weeks 1-2)

**Goal:** Enable admins to create and manage events

**Features:**
1. Event creation wizard (multi-step form)
2. Event listing page with search/filter
3. Event detail page with tabs
4. Event editing and deletion
5. Event status management

**Deliverables:**
- `/dashboard/vision/events` page
- `/dashboard/vision/events/create` page
- `/dashboard/vision/events/[id]` page
- Event CRUD API endpoints
- Database migrations for events table

**Success Metrics:**
- Admins can create events in < 5 minutes
- Events display correctly on dashboard
- All CRUD operations work smoothly

---

### Phase 2: Registration & Ticketing (Weeks 3-4)

**Goal:** Enable attendees to register and purchase tickets

**Features:**
1. Registration form builder
2. Ticket type management
3. Pricing and discount system
4. Payment gateway integration
5. Confirmation emails

**Deliverables:**
- `/events/[id]/register` page
- Ticket management UI
- Payment integration (Stripe)
- Email notification system
- Database migrations for tickets/registrations

**Success Metrics:**
- Attendees can register in < 3 minutes
- Payment success rate > 95%
- Confirmation emails sent within 1 minute

---

### Phase 2: Agenda & Speakers (Weeks 5-6)

**Goal:** Enable event organizers to create agendas and manage speakers

**Features:**
1. Session creation and management
2. Speaker profile management
3. Agenda timeline view
4. Session registration
5. Speaker directory

**Deliverables:**
- `/dashboard/vision/events/[id]/agenda` page
- `/dashboard/vision/events/[id]/speakers` page
- `/events/[id]/agenda` public page
- `/events/[id]/speakers` public page
- Database migrations for sessions/speakers

**Success Metrics:**
- Organizers can create agenda in < 30 minutes
- Attendees can view and filter sessions
- Speaker profiles display correctly

---

### Phase 3: Check-in System (Weeks 7-8)

**Goal:** Enable on-site check-in with QR codes

**Features:**
1. QR code generation for tickets
2. QR code scanner (mobile camera)
3. Check-in dashboard
4. Badge generation (PDF)
5. Real-time attendance tracking

**Deliverables:**
- `/dashboard/vision/events/[id]/check-in` page
- QR code scanner component
- Badge PDF generator
- Check-in API endpoints
- Database migrations for check-ins

**Success Metrics:**
- Check-in time < 5 seconds per attendee
- QR code scan success rate > 98%
- Real-time attendance updates

---

### Phase 3: Analytics & Reporting (Weeks 9-10)

**Goal:** Provide comprehensive analytics and reporting

**Features:**
1. Real-time analytics dashboard
2. Custom report builder
3. Data export (CSV, Excel, PDF)
4. Engagement metrics
5. Revenue reports

**Deliverables:**
- `/dashboard/vision/analytics` page
- Report builder UI
- Export functionality
- Analytics API endpoints
- Chart components (Recharts)

**Success Metrics:**
- Dashboard loads in < 2 seconds
- Reports generate in < 10 seconds
- Export files download successfully

---

### Phase 4: Networking Features (Weeks 11-12)

**Goal:** Enable attendee networking and connections

**Features:**
1. Attendee directory with profiles
2. Connection requests
3. In-app messaging
4. Meeting scheduler
5. Business card exchange

**Deliverables:**
- `/dashboard/vision/networking` page
- Attendee profile pages
- Messaging system
- Meeting scheduler
- Database migrations for connections/messages

**Success Metrics:**
- Attendees can find and connect in < 2 minutes
- Messages delivered in real-time
- Meeting scheduling works smoothly

---

### Phase 4: Mobile Optimization (Weeks 13-14)

**Goal:** Optimize for mobile devices and add PWA support

**Features:**
1. Progressive Web App (PWA)
2. Web push notifications
3. Offline mode support
4. Mobile-optimized UI
5. Add to home screen

**Deliverables:**
- PWA manifest and service worker
- Push notification system
- Offline caching strategy
- Mobile UI improvements
- Installation prompts

**Success Metrics:**
- PWA installable on all devices
- Offline mode works for key features
- Push notifications delivered successfully

---

## 3. Database Schema

### 3.1 New Tables Required

```sql
-- Events table
CREATE TABLE em_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  venue_name VARCHAR(255),
  venue_address TEXT,
  event_type VARCHAR(50), -- 'in-person', 'virtual', 'hybrid'
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'live', 'completed', 'cancelled'
  banner_image TEXT,
  thumbnail_image TEXT,
  max_attendees INTEGER,
  registration_start TIMESTAMPTZ,
  registration_end TIMESTAMPTZ,
  organizer_id UUID REFERENCES em_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Ticket types table
CREATE TABLE em_ticket_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  quantity INTEGER,
  sold_count INTEGER DEFAULT 0,
  ticket_type VARCHAR(50), -- 'vip', 'general', 'early_bird', 'group'
  sale_start TIMESTAMPTZ,
  sale_end TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table
CREATE TABLE em_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES em_ticket_types(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'waitlist'
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_amount DECIMAL(10, 2),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  qr_code TEXT,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  registration_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, attendee_id)
);

-- Sessions/Agenda table
CREATE TABLE em_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  room VARCHAR(100),
  session_type VARCHAR(50), -- 'keynote', 'workshop', 'panel', 'networking'
  max_attendees INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Speakers table
CREATE TABLE em_speakers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  company VARCHAR(255),
  bio TEXT,
  photo_url TEXT,
  email VARCHAR(255),
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session speakers junction table
CREATE TABLE em_session_speakers (
  session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE,
  speaker_id UUID REFERENCES em_speakers(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'speaker', -- 'speaker', 'moderator', 'panelist'
  PRIMARY KEY (session_id, speaker_id)
);

-- Session registrations table
CREATE TABLE em_session_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES em_sessions(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, attendee_id)
);

-- Check-ins table
CREATE TABLE em_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id UUID REFERENCES em_registrations(id) ON DELETE CASCADE,
  session_id UUID REFERENCES em_sessions(id),
  checked_in_by UUID REFERENCES em_profiles(id),
  check_in_method VARCHAR(50), -- 'qr_code', 'manual', 'self_service'
  checked_in_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discount codes table
CREATE TABLE em_discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES em_events(id) ON DELETE CASCADE,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20), -- 'percentage', 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Networking connections table
CREATE TABLE em_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Messages table
CREATE TABLE em_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES em_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Indexes for Performance

```sql
-- Event indexes
CREATE INDEX idx_events_status ON em_events(status);
CREATE INDEX idx_events_start_date ON em_events(start_date);
CREATE INDEX idx_events_organizer ON em_events(organizer_id);

-- Registration indexes
CREATE INDEX idx_registrations_event ON em_registrations(event_id);
CREATE INDEX idx_registrations_attendee ON em_registrations(attendee_id);
CREATE INDEX idx_registrations_status ON em_registrations(status);

-- Session indexes
CREATE INDEX idx_sessions_event ON em_sessions(event_id);
CREATE INDEX idx_sessions_start_time ON em_sessions(start_time);

-- Message indexes
CREATE INDEX idx_messages_sender ON em_messages(sender_id);
CREATE INDEX idx_messages_recipient ON em_messages(recipient_id);
CREATE INDEX idx_messages_created ON em_messages(created_at);
```

### 3.3 Row Level Security (RLS) Policies

```sql
-- Events: Public can read published events, organizers can manage their events
ALTER TABLE em_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published events"
  ON em_events FOR SELECT
  USING (status = 'published' OR status = 'live');

CREATE POLICY "Organizers can manage their events"
  ON em_events FOR ALL
  USING (organizer_id = auth.uid());

-- Registrations: Users can view their own registrations
ALTER TABLE em_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their registrations"
  ON em_registrations FOR SELECT
  USING (attendee_id = auth.uid());

CREATE POLICY "Users can create registrations"
  ON em_registrations FOR INSERT
  WITH CHECK (attendee_id = auth.uid());

-- Messages: Users can view their own messages
ALTER TABLE em_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON em_messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON em_messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());
```

---

## 4. Component Architecture

### 4.1 New Page Components

```
/app/dashboard/vision/
├── events/
│   ├── page.tsx                    # Events listing
│   ├── create/
│   │   └── page.tsx                # Event creation wizard
│   └── [id]/
│       ├── page.tsx                # Event overview
│       ├── edit/
│       │   └── page.tsx            # Event editing
│       ├── tickets/
│       │   └── page.tsx            # Ticket management
│       ├── agenda/
│       │   └── page.tsx            # Agenda builder
│       ├── speakers/
│       │   └── page.tsx            # Speaker management
│       ├── attendees/
│       │   └── page.tsx            # Attendee list
│       ├── check-in/
│       │   └── page.tsx            # Check-in dashboard
│       └── analytics/
│           └── page.tsx            # Event analytics
├── networking/
│   └── page.tsx                    # Networking hub
└── analytics/
    └── page.tsx                    # Global analytics

/app/events/
└── [id]/
    ├── page.tsx                    # Public event page
    ├── register/
    │   └── page.tsx                # Registration form
    ├── agenda/
    │   └── page.tsx                # Public agenda
    └── speakers/
        └── page.tsx                # Public speakers
```

### 4.2 New Shared Components

```
/components/events/
├── event-card.tsx                  # Event card component
├── event-form.tsx                  # Event creation/edit form
├── event-wizard.tsx                # Multi-step wizard
├── ticket-selector.tsx             # Ticket selection UI
├── registration-form.tsx           # Registration form
├── payment-form.tsx                # Payment form (Stripe)
├── qr-code-generator.tsx           # QR code generator
├── qr-code-scanner.tsx             # QR code scanner
├── session-card.tsx                # Session card
├── session-timeline.tsx            # Agenda timeline
├── speaker-card.tsx                # Speaker card
├── attendee-card.tsx               # Attendee card
├── check-in-scanner.tsx            # Check-in scanner
├── badge-generator.tsx             # Badge PDF generator
└── analytics-chart.tsx             # Analytics charts

/components/networking/
├── attendee-directory.tsx          # Attendee directory
├── connection-request.tsx          # Connection request UI
├── message-thread.tsx              # Message thread
└── meeting-scheduler.tsx           # Meeting scheduler

/components/shared/
├── calendar.tsx                    # Calendar component
├── date-picker.tsx                 # Date picker
├── time-picker.tsx                 # Time picker
├── file-upload.tsx                 # File upload
├── rich-text-editor.tsx            # Rich text editor
├── data-table.tsx                  # Data table
└── export-button.tsx               # Export button
```

---

## 5. API Endpoints

### 5.1 Events API

```typescript
// GET /api/events - List all events
// GET /api/events/[id] - Get event details
// POST /api/events - Create event
// PUT /api/events/[id] - Update event
// DELETE /api/events/[id] - Delete event
// GET /api/events/[id]/stats - Get event statistics
```

### 5.2 Tickets API

```typescript
// GET /api/events/[id]/tickets - List ticket types
// POST /api/events/[id]/tickets - Create ticket type
// PUT /api/tickets/[id] - Update ticket type
// DELETE /api/tickets/[id] - Delete ticket type
```

### 5.3 Registrations API

```typescript
// GET /api/events/[id]/registrations - List registrations
// POST /api/events/[id]/register - Create registration
// GET /api/registrations/[id] - Get registration details
// PUT /api/registrations/[id] - Update registration
// DELETE /api/registrations/[id] - Cancel registration
// POST /api/registrations/[id]/check-in - Check-in attendee
```

### 5.4 Sessions API

```typescript
// GET /api/events/[id]/sessions - List sessions
// POST /api/events/[id]/sessions - Create session
// PUT /api/sessions/[id] - Update session
// DELETE /api/sessions/[id] - Delete session
// POST /api/sessions/[id]/register - Register for session
```

### 5.5 Speakers API

```typescript
// GET /api/events/[id]/speakers - List speakers
// POST /api/events/[id]/speakers - Create speaker
// PUT /api/speakers/[id] - Update speaker
// DELETE /api/speakers/[id] - Delete speaker
```

### 5.6 Analytics API

```typescript
// GET /api/events/[id]/analytics - Get event analytics
// GET /api/analytics/dashboard - Get global analytics
// POST /api/analytics/export - Export analytics data
```

### 5.7 Networking API

```typescript
// GET /api/networking/attendees - List attendees
// POST /api/networking/connect - Send connection request
// PUT /api/networking/connections/[id] - Accept/reject connection
// GET /api/networking/messages - List messages
// POST /api/networking/messages - Send message
```

---

## 6. Design System

### 6.1 Maintain Existing Vision UI Design

- **Colors:** Purple gradient (#7928CA → #4318FF)
- **Typography:** Plus Jakarta Display, Nunito
- **Spacing:** 8px, 12px, 16px, 20px, 24px, 28px
- **Border Radius:** 12px, 16px, 20px
- **Glassmorphism:** backdrop-filter: blur(21px)

### 6.2 New Component Patterns

**Event Cards:**
- Large banner image
- Event title and date
- Location and attendee count
- Status badge
- Quick actions menu

**Registration Flow:**
- Step indicator (1/3, 2/3, 3/3)
- Progress bar
- Back/Next buttons
- Save draft option

**Analytics Dashboard:**
- KPI cards at top
- Interactive charts (line, bar, pie)
- Date range selector
- Export button

---

## 7. Timeline & Resources

### 7.1 Estimated Timeline

- **Phase 2 (Weeks 1-6):** Event Management, Registration, Agenda
- **Phase 3 (Weeks 7-10):** Check-in, Analytics
- **Phase 4 (Weeks 11-14):** Networking, Mobile

**Total:** 14 weeks (3.5 months)

### 7.2 Resources Needed

- **Frontend Developer:** 1 full-time
- **Backend Developer:** 1 full-time (or same person)
- **UI/UX Designer:** 0.5 part-time
- **QA Tester:** 0.5 part-time

### 7.3 Dependencies

- Stripe account for payments
- Email service (SendGrid, Mailgun)
- File storage (Supabase Storage)
- QR code library (qrcode.react)
- Chart library (Recharts)
- PDF generation (jsPDF, react-pdf)

---

**End of Feature Specification**


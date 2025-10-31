// Mock data for dashboard testing
// This will be replaced with real Supabase data later

export interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  venue: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  attendee_count: number
  ticket_price: number
  image_url?: string
  category?: string
}

export interface Attendee {
  id: string
  full_name: string
  email: string
  ticket_type: string
  event_id: string
  event_name: string
  checked_in: boolean
  checked_in_at?: string
  created_at: string
}

export interface Ticket {
  id: string
  event_id: string
  event_name: string
  ticket_type: string
  price: number
  purchase_date: string
  qr_code: string
  status: 'active' | 'used' | 'cancelled'
}

export interface DashboardStats {
  totalEvents: number
  activeEvents: number
  totalAttendees: number
  totalRevenue: number
  newRegistrations: number
  ticketsSold: number
}

// Mock Events
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'WECON Tech Summit 2025',
    description: 'Annual technology conference featuring industry leaders',
    start_date: '2025-11-15T09:00:00Z',
    end_date: '2025-11-17T18:00:00Z',
    location: 'Karachi, Pakistan',
    venue: 'Pearl Continental Hotel',
    status: 'published',
    attendee_count: 450,
    ticket_price: 5000,
    image_url: '/images/events/tech-summit.jpg',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Startup Pitch Night',
    description: 'Pitch your startup to investors and mentors',
    start_date: '2025-11-20T18:00:00Z',
    end_date: '2025-11-20T22:00:00Z',
    location: 'Lahore, Pakistan',
    venue: 'The Nest I/O',
    status: 'published',
    attendee_count: 120,
    ticket_price: 1500,
    image_url: '/images/events/pitch-night.jpg',
    category: 'Startup',
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    description: 'Learn advanced digital marketing strategies',
    start_date: '2025-12-01T10:00:00Z',
    end_date: '2025-12-01T17:00:00Z',
    location: 'Islamabad, Pakistan',
    venue: 'Serena Hotel',
    status: 'published',
    attendee_count: 80,
    ticket_price: 3000,
    image_url: '/images/events/marketing.jpg',
    category: 'Marketing',
  },
  {
    id: '4',
    title: 'AI & Machine Learning Workshop',
    description: 'Hands-on workshop on AI and ML fundamentals',
    start_date: '2025-12-10T09:00:00Z',
    end_date: '2025-12-12T18:00:00Z',
    location: 'Karachi, Pakistan',
    venue: 'NED University',
    status: 'draft',
    attendee_count: 0,
    ticket_price: 8000,
    image_url: '/images/events/ai-workshop.jpg',
    category: 'Technology',
  },
  {
    id: '5',
    title: 'Women in Tech Conference',
    description: 'Empowering women in technology',
    start_date: '2025-10-25T09:00:00Z',
    end_date: '2025-10-25T18:00:00Z',
    location: 'Karachi, Pakistan',
    venue: 'Movenpick Hotel',
    status: 'completed',
    attendee_count: 200,
    ticket_price: 2500,
    image_url: '/images/events/women-tech.jpg',
    category: 'Technology',
  },
]

// Mock Attendees
export const mockAttendees: Attendee[] = [
  {
    id: '1',
    full_name: 'Ahmed Khan',
    email: 'ahmed.khan@example.com',
    ticket_type: 'VIP',
    event_id: '1',
    event_name: 'WECON Tech Summit 2025',
    checked_in: true,
    checked_in_at: '2025-11-15T09:15:00Z',
    created_at: '2025-10-20T10:00:00Z',
  },
  {
    id: '2',
    full_name: 'Fatima Ali',
    email: 'fatima.ali@example.com',
    ticket_type: 'Regular',
    event_id: '1',
    event_name: 'WECON Tech Summit 2025',
    checked_in: true,
    checked_in_at: '2025-11-15T09:30:00Z',
    created_at: '2025-10-22T14:30:00Z',
  },
  {
    id: '3',
    full_name: 'Hassan Raza',
    email: 'hassan.raza@example.com',
    ticket_type: 'Student',
    event_id: '2',
    event_name: 'Startup Pitch Night',
    checked_in: false,
    created_at: '2025-10-25T16:45:00Z',
  },
  {
    id: '4',
    full_name: 'Ayesha Malik',
    email: 'ayesha.malik@example.com',
    ticket_type: 'Regular',
    event_id: '3',
    event_name: 'Digital Marketing Masterclass',
    checked_in: false,
    created_at: '2025-10-28T11:20:00Z',
  },
  {
    id: '5',
    full_name: 'Usman Ahmed',
    email: 'usman.ahmed@example.com',
    ticket_type: 'VIP',
    event_id: '1',
    event_name: 'WECON Tech Summit 2025',
    checked_in: false,
    created_at: '2025-10-29T09:00:00Z',
  },
]

// Mock Tickets (for attendee view)
export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    event_id: '1',
    event_name: 'WECON Tech Summit 2025',
    ticket_type: 'VIP',
    price: 5000,
    purchase_date: '2025-10-20T10:00:00Z',
    qr_code: 'QR-WECON-2025-001',
    status: 'active',
  },
  {
    id: 'TKT-002',
    event_id: '2',
    event_name: 'Startup Pitch Night',
    ticket_type: 'Regular',
    price: 1500,
    purchase_date: '2025-10-25T16:45:00Z',
    qr_code: 'QR-PITCH-2025-002',
    status: 'active',
  },
  {
    id: 'TKT-003',
    event_id: '5',
    event_name: 'Women in Tech Conference',
    ticket_type: 'Regular',
    price: 2500,
    purchase_date: '2025-10-15T12:00:00Z',
    qr_code: 'QR-WOMEN-2025-003',
    status: 'used',
  },
]

// Mock Dashboard Stats
export const mockAdminStats: DashboardStats = {
  totalEvents: 5,
  activeEvents: 3,
  totalAttendees: 850,
  totalRevenue: 2450000,
  newRegistrations: 45,
  ticketsSold: 850,
}

export const mockAttendeeStats: DashboardStats = {
  totalEvents: 3,
  activeEvents: 2,
  totalAttendees: 0,
  totalRevenue: 9000,
  newRegistrations: 0,
  ticketsSold: 3,
}

// Helper functions
export function getUpcomingEvents(): Event[] {
  const now = new Date()
  return mockEvents
    .filter(event => new Date(event.start_date) > now && event.status === 'published')
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
}

export function getRecentAttendees(limit: number = 10): Attendee[] {
  return mockAttendees
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export function getActiveTickets(): Ticket[] {
  return mockTickets.filter(ticket => ticket.status === 'active')
}

export function getEventById(id: string): Event | undefined {
  return mockEvents.find(event => event.id === id)
}

export function getAttendeesByEvent(eventId: string): Attendee[] {
  return mockAttendees.filter(attendee => attendee.event_id === eventId)
}


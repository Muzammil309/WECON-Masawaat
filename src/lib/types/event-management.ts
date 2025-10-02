// =====================================================
// Event Management Platform - TypeScript Type Definitions
// Phase 1: MUST-HAVE Features
// =====================================================

// =====================================================
// 1. REAL-TIME ATTENDANCE & SESSION TRACKING
// =====================================================

export interface SessionAttendance {
  id: string
  session_id: string
  user_id: string
  checked_in_at: string
  checked_out_at?: string
  duration_minutes?: number
  engagement_score: number
  created_at: string
  updated_at: string
}

export interface SessionMetrics {
  id: string
  session_id: string
  current_attendees: number
  peak_attendees: number
  total_check_ins: number
  total_check_outs: number
  average_duration_minutes: number
  engagement_rate: number
  drop_off_rate: number
  last_updated: string
  created_at: string
}

export interface EventAttendanceMetrics {
  id: string
  event_id: string
  total_registered: number
  total_checked_in: number
  currently_onsite: number
  peak_concurrent: number
  check_in_rate: number
  last_updated: string
  created_at: string
}

// =====================================================
// 2. CHECK-IN & BADGE PRINTING SYSTEM
// =====================================================

export interface CheckInStation {
  id: string
  event_id: string
  station_name: string
  location?: string
  is_online: boolean
  last_heartbeat: string
  total_check_ins: number
  created_at: string
  updated_at: string
}

export type CheckInMethod = 'qr_code' | 'barcode' | 'manual' | 'kiosk'

export interface CheckInLog {
  id: string
  ticket_id: string
  station_id?: string
  checked_in_by?: string
  check_in_method: CheckInMethod
  is_offline_sync: boolean
  checked_in_at: string
  synced_at?: string
  created_at: string
}

export type BadgePrintStatus = 'pending' | 'printing' | 'completed' | 'failed'

export interface BadgePrintQueue {
  id: string
  ticket_id: string
  station_id?: string
  status: BadgePrintStatus
  priority: number
  retry_count: number
  error_message?: string
  printed_at?: string
  created_at: string
  updated_at: string
}

// =====================================================
// 3. LEAD RETRIEVAL & EXHIBITOR PORTAL
// =====================================================

export interface ExhibitorBooth {
  id: string
  event_id: string
  company_name: string
  booth_number?: string
  booth_location?: string
  description?: string
  logo_url?: string
  website_url?: string
  contact_email?: string
  contact_phone?: string
  exhibitor_user_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type LeadInterestLevel = 'hot' | 'warm' | 'cold'
export type CaptureMethod = 'qr_scan' | 'manual' | 'business_card'

export interface LeadCapture {
  id: string
  booth_id: string
  attendee_id: string
  captured_by: string
  capture_method: CaptureMethod
  lead_score: number
  interest_level?: LeadInterestLevel
  notes?: string
  follow_up_required: boolean
  follow_up_date?: string
  custom_fields: Record<string, any>
  exported_at?: string
  created_at: string
  updated_at: string
  // Joined data
  attendee?: {
    id: string
    full_name?: string
    email: string
    avatar_url?: string
  }
}

export interface ExhibitorAnalytics {
  id: string
  booth_id: string
  total_leads: number
  hot_leads: number
  warm_leads: number
  cold_leads: number
  average_lead_score: number
  total_scans: number
  unique_visitors: number
  last_updated: string
  created_at: string
}

// =====================================================
// 4. LIVE ENGAGEMENT (CHAT, Q&A, POLLS)
// =====================================================

export interface SessionChatMessage {
  id: string
  session_id: string
  user_id: string
  message: string
  is_pinned: boolean
  is_hidden: boolean
  is_moderated: boolean
  moderated_by?: string
  moderated_at?: string
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
}

export type QuestionStatus = 'pending' | 'approved' | 'rejected' | 'answered'

export interface SessionQuestion {
  id: string
  session_id: string
  user_id: string
  question: string
  status: QuestionStatus
  upvotes: number
  is_pinned: boolean
  answer?: string
  answered_by?: string
  answered_at?: string
  moderated_by?: string
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    id: string
    full_name?: string
    avatar_url?: string
  }
  has_upvoted?: boolean
}

export interface QuestionUpvote {
  id: string
  question_id: string
  user_id: string
  created_at: string
}

export type PollType = 'multiple_choice' | 'single_choice' | 'rating' | 'open_ended'

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface SessionPoll {
  id: string
  session_id: string
  created_by: string
  question: string
  poll_type: PollType
  options: PollOption[]
  is_active: boolean
  is_anonymous: boolean
  total_votes: number
  ends_at?: string
  created_at: string
  updated_at: string
  // Joined data
  user_response?: string[]
}

export interface PollResponse {
  id: string
  poll_id: string
  user_id: string
  selected_options: string[]
  text_response?: string
  created_at: string
}

// =====================================================
// 5. MOBILE APP / ATTENDEE PORTAL
// =====================================================

export interface PersonalAgenda {
  id: string
  user_id: string
  session_id: string
  is_favorite: boolean
  reminder_sent: boolean
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  session?: {
    id: string
    title: string
    starts_at: string
    ends_at: string
    location?: string
  }
}

export type MeetingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface NetworkingMeeting {
  id: string
  event_id: string
  requester_id: string
  recipient_id: string
  status: MeetingStatus
  meeting_time?: string
  duration_minutes: number
  location?: string
  virtual_meeting_url?: string
  notes?: string
  created_at: string
  updated_at: string
  // Joined data
  requester?: {
    id: string
    full_name?: string
    email: string
    avatar_url?: string
  }
  recipient?: {
    id: string
    full_name?: string
    email: string
    avatar_url?: string
  }
}

export type NotificationType = 'general' | 'session_reminder' | 'meeting_request' | 'emergency'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface PushNotification {
  id: string
  user_id: string
  event_id?: string
  title: string
  message: string
  notification_type: NotificationType
  priority: NotificationPriority
  is_read: boolean
  sent_at: string
  read_at?: string
  action_url?: string
  created_at: string
}

export type DeviceType = 'ios' | 'android' | 'web'

export interface DeviceToken {
  id: string
  user_id: string
  token: string
  device_type?: DeviceType
  is_active: boolean
  last_used: string
  created_at: string
  updated_at: string
}

// =====================================================
// 6. REAL-TIME ANALYTICS & REPORTING
// =====================================================

export type SnapshotType = 'hourly' | 'daily' | 'final'

export interface AnalyticsSnapshot {
  id: string
  event_id: string
  snapshot_type: SnapshotType
  total_registered: number
  total_checked_in: number
  total_revenue: number
  active_sessions: number
  total_engagement_actions: number
  snapshot_data: Record<string, any>
  created_at: string
}

// =====================================================
// DASHBOARD-SPECIFIC TYPES
// =====================================================

export interface LiveEventMetrics {
  total_checked_in: number
  currently_onsite: number
  total_revenue: number
  active_sessions: number
  check_in_rate: number
  peak_concurrent: number
  last_updated: string
}

export interface SessionEngagementMetrics {
  session_id: string
  current_attendees: number
  total_messages: number
  total_questions: number
  total_poll_responses: number
  engagement_rate: number
}

export interface ExhibitorDashboardData {
  booth: ExhibitorBooth
  analytics: ExhibitorAnalytics
  recent_leads: LeadCapture[]
  lead_trend: Array<{ date: string; count: number }>
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  has_more: boolean
}


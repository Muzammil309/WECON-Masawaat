/**
 * TypeScript types for Exhibitor Lead Capture & Management
 */

// =====================================================
// EXHIBITOR BOOTH TYPES
// =====================================================

export interface ExhibitorBooth {
  id: string
  event_id: string
  company_name: string
  booth_number: string | null
  booth_location: string | null
  description: string | null
  logo_url: string | null
  website_url: string | null
  contact_email: string | null
  contact_phone: string | null
  exhibitor_user_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateBoothRequest {
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
}

export interface UpdateBoothRequest {
  company_name?: string
  booth_number?: string
  booth_location?: string
  description?: string
  logo_url?: string
  website_url?: string
  contact_email?: string
  contact_phone?: string
  is_active?: boolean
}

// =====================================================
// LEAD CAPTURE TYPES
// =====================================================

export interface LeadCapture {
  id: string
  booth_id: string
  attendee_id: string
  captured_by: string
  capture_method: 'qr_scan' | 'manual' | 'business_card'
  lead_score: number // 0-100
  interest_level: 'hot' | 'warm' | 'cold' | null
  notes: string | null
  custom_fields: Record<string, any> | null
  follow_up_required: boolean
  exported: boolean
  exported_at: string | null
  created_at: string
  updated_at: string
  
  // Joined data
  attendee?: {
    id: string
    full_name: string
    email: string
    company: string | null
    job_title: string | null
    phone: string | null
  }
  booth?: {
    id: string
    company_name: string
    booth_number: string | null
  }
  captured_by_user?: {
    id: string
    full_name: string
    email: string
  }
}

export interface CaptureLeadRequest {
  booth_id: string
  attendee_id: string
  capture_method?: 'qr_scan' | 'manual' | 'business_card'
  lead_score?: number
  interest_level?: 'hot' | 'warm' | 'cold'
  notes?: string
  custom_fields?: Record<string, any>
  follow_up_required?: boolean
}

export interface UpdateLeadRequest {
  lead_score?: number
  interest_level?: 'hot' | 'warm' | 'cold'
  notes?: string
  custom_fields?: Record<string, any>
  follow_up_required?: boolean
  exported?: boolean
}

export interface LeadCaptureResponse {
  success: boolean
  lead?: LeadCapture
  error?: string
  duplicate?: boolean
}

// =====================================================
// EXHIBITOR ANALYTICS TYPES
// =====================================================

export interface ExhibitorAnalytics {
  id: string
  booth_id: string
  total_leads: number
  hot_leads: number
  warm_leads: number
  cold_leads: number
  average_lead_score: number
  total_exports: number
  last_export_at: string | null
  created_at: string
  updated_at: string
}

export interface BoothAnalyticsResponse {
  analytics: ExhibitorAnalytics
  leads_by_day: Array<{
    date: string
    count: number
  }>
  leads_by_hour: Array<{
    hour: number
    count: number
  }>
  top_staff: Array<{
    user_id: string
    full_name: string
    lead_count: number
  }>
}

// =====================================================
// LEAD EXPORT TYPES
// =====================================================

export type ExportFormat = 'csv' | 'hubspot' | 'salesforce'

export interface ExportLeadsRequest {
  booth_id: string
  format: ExportFormat
  filters?: {
    interest_level?: 'hot' | 'warm' | 'cold'
    min_score?: number
    max_score?: number
    date_from?: string
    date_to?: string
    exported?: boolean
  }
  include_fields?: string[]
}

export interface ExportLeadsResponse {
  success: boolean
  format: ExportFormat
  file_url?: string // For CSV
  export_count: number
  error?: string
  hubspot_response?: any // For HubSpot
  salesforce_response?: any // For Salesforce
}

// =====================================================
// LEAD STREAM TYPES
// =====================================================

export interface LeadStreamItem {
  id: string
  booth_id: string
  attendee_name: string
  attendee_email: string
  attendee_company: string | null
  interest_level: 'hot' | 'warm' | 'cold' | null
  lead_score: number
  notes: string | null
  captured_at: string
  captured_by_name: string
}

export interface LeadStreamFilters {
  booth_id?: string
  interest_level?: 'hot' | 'warm' | 'cold'
  min_score?: number
  date_from?: string
  date_to?: string
}

// =====================================================
// BADGE SCAN TYPES
// =====================================================

export interface BadgeScanResult {
  success: boolean
  attendee?: {
    id: string
    full_name: string
    email: string
    company: string | null
    job_title: string | null
    phone: string | null
    ticket_tier: string | null
  }
  error?: string
  already_captured?: boolean
  previous_capture?: {
    id: string
    captured_at: string
    lead_score: number
    interest_level: string | null
  }
}

// =====================================================
// QUERY PARAMS TYPES
// =====================================================

export interface GetLeadsParams {
  booth_id?: string
  interest_level?: 'hot' | 'warm' | 'cold'
  min_score?: number
  max_score?: number
  exported?: boolean
  search?: string // Search by attendee name/email
  limit?: number
  offset?: number
  sort_by?: 'created_at' | 'lead_score' | 'interest_level'
  sort_order?: 'asc' | 'desc'
}

export interface GetBoothsParams {
  event_id?: string
  is_active?: boolean
  search?: string // Search by company name
  limit?: number
  offset?: number
}

// =====================================================
// RESPONSE TYPES
// =====================================================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  has_more: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}


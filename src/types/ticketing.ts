// =====================================================
// Ticketing System Types
// =====================================================

export interface TicketType {
  id: string
  event_id: string
  name: string
  type: TicketTypeEnum
  description: string | null
  price: number
  currency: string
  
  // Discount
  discount_percentage: number
  discount_amount: number
  
  // Availability
  total_quantity: number
  available_quantity: number
  min_purchase: number
  max_purchase: number
  
  // Validity
  valid_from: string | null
  valid_until: string | null
  
  // Features
  features: string[]
  includes_sessions: boolean
  includes_workshops: boolean
  includes_meals: boolean
  
  // Status
  is_active: boolean
  is_visible: boolean
  sort_order: number
  
  // Metadata
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export type TicketTypeEnum = 
  | 'early_bird'
  | 'vip'
  | 'sponsor'
  | 'student'
  | 'group'
  | 'general'

export interface DiscountCode {
  id: string
  event_id: string | null
  code: string
  description: string | null
  
  // Discount settings
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  currency: string
  
  // Usage limits
  max_uses: number | null
  current_uses: number
  max_uses_per_user: number
  
  // Validity
  valid_from: string | null
  valid_until: string | null
  
  // Restrictions
  min_purchase_amount: number | null
  applicable_ticket_types: string[]
  
  // Status
  is_active: boolean
  
  // Metadata
  created_by: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DiscountCodeUsage {
  id: string
  discount_code_id: string
  user_id: string
  order_id: string | null
  discount_amount: number
  used_at: string
}

export interface Seat {
  id: string
  event_id: string
  session_id: string | null
  
  // Location
  section: string
  row: string
  seat_number: string
  
  // Details
  seat_type: SeatType
  price_modifier: number
  
  // Status
  status: SeatStatus
  
  // Reservation
  reserved_by: string | null
  reserved_at: string | null
  reservation_expires_at: string | null
  ticket_id: string | null
  
  // Metadata
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export type SeatType = 'standard' | 'accessible' | 'vip' | 'reserved'
export type SeatStatus = 'available' | 'reserved' | 'occupied' | 'blocked'

export interface EnhancedOrder {
  id: string
  user_id: string
  event_id: string
  ticket_type_id: string | null
  discount_code_id: string | null
  
  // Pricing
  subtotal: number | null
  discount_amount: number
  tax_amount: number
  total_amount: number | null
  currency: string
  
  // Payment
  payment_method: string | null
  payment_status: PaymentStatus
  stripe_payment_intent_id: string | null
  stripe_session_id: string | null
  
  // Status
  status: string
  
  // Metadata
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  
  // Joined data
  ticket_type?: TicketType
  discount_code?: DiscountCode
  tickets?: EnhancedTicket[]
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'refunded'

export interface EnhancedTicket {
  id: string
  order_id: string
  ticket_type_id: string | null
  seat_id: string | null
  
  // Pricing
  price_paid: number | null
  currency: string
  
  // QR Code
  qr_code: string | null
  qr_code_data: string | null
  qr_code_expires_at: string | null
  
  // Check-in
  status: TicketStatus
  checked_in: boolean
  checked_in_at: string | null
  check_in_location: string | null
  check_in_by: string | null
  
  // Metadata
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  
  // Joined data
  ticket_type?: TicketType
  seat?: Seat
  order?: EnhancedOrder
}

export type TicketStatus = 'active' | 'used' | 'cancelled' | 'expired'

// =====================================================
// API Request/Response Types
// =====================================================

export interface CreateCheckoutRequest {
  event_id: string
  ticket_type_id: string
  quantity: number
  discount_code?: string
  seat_ids?: string[]
  metadata?: Record<string, any>
}

export interface CreateCheckoutResponse {
  checkout_url: string
  session_id: string
  order_id: string
}

export interface ValidateDiscountRequest {
  code: string
  ticket_type_id: string
  subtotal: number
}

export interface ValidateDiscountResponse {
  is_valid: boolean
  discount_id?: string
  discount_amount?: number
  error_message?: string
}

export interface ValidateTicketRequest {
  qr_code: string
  event_id: string
  location?: string
}

export interface ValidateTicketResponse {
  is_valid: boolean
  ticket?: EnhancedTicket
  error_message?: string
  can_check_in: boolean
}

export interface CheckInTicketRequest {
  ticket_id: string
  location?: string
}

export interface CheckInTicketResponse {
  success: boolean
  ticket?: EnhancedTicket
  error_message?: string
}

export interface ReserveSeatRequest {
  seat_id: string
  duration_minutes?: number
}

export interface ReserveSeatResponse {
  success: boolean
  seat?: Seat
  expires_at?: string
  error_message?: string
}

// =====================================================
// Stripe Types
// =====================================================

export interface StripeCheckoutMetadata {
  user_id: string
  event_id: string
  ticket_type_id: string
  quantity: number
  discount_code_id?: string
  seat_ids?: string
}

export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: any
  }
}

// =====================================================
// UI Component Types
// =====================================================

export interface TicketPurchaseFormData {
  ticket_type_id: string
  quantity: number
  discount_code: string
  selected_seats: string[]
}

export interface SeatMapSection {
  section: string
  rows: SeatMapRow[]
}

export interface SeatMapRow {
  row: string
  seats: Seat[]
}

export interface TicketSummary {
  ticket_type: TicketType
  quantity: number
  subtotal: number
  discount_amount: number
  tax_amount: number
  total: number
  discount_code?: DiscountCode
}

// =====================================================
// Utility Types
// =====================================================

export const TICKET_TYPE_LABELS: Record<TicketTypeEnum, string> = {
  early_bird: 'Early Bird',
  vip: 'VIP',
  sponsor: 'Sponsor',
  student: 'Student',
  group: 'Group',
  general: 'General Admission',
}

export const TICKET_TYPE_COLORS: Record<TicketTypeEnum, string> = {
  early_bird: 'yellow',
  vip: 'purple',
  sponsor: 'blue',
  student: 'green',
  group: 'orange',
  general: 'gray',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  succeeded: 'Succeeded',
  failed: 'Failed',
  canceled: 'Canceled',
  refunded: 'Refunded',
}

export const SEAT_STATUS_COLORS: Record<SeatStatus, string> = {
  available: 'green',
  reserved: 'yellow',
  occupied: 'red',
  blocked: 'gray',
}


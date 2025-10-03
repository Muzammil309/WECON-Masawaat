/**
 * TypeScript Types for Check-in System
 */

// =====================================================
// CHECK-IN STATION TYPES
// =====================================================

export type DeviceType = 'mobile' | 'kiosk' | 'tablet' | 'desktop'

export interface CheckInStation {
  id: string
  event_id: string
  station_name: string
  location: string | null
  is_online: boolean
  last_heartbeat: string
  total_check_ins: number
  device_id: string | null
  device_type: DeviceType
  ip_address: string | null
  user_agent: string | null
  pending_sync_count: number
  last_sync_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateCheckInStationInput {
  event_id: string
  station_name: string
  location?: string
  device_type?: DeviceType
  device_id?: string
}

// =====================================================
// CHECK-IN LOG TYPES
// =====================================================

export type CheckInMethod = 'qr_code' | 'barcode' | 'manual' | 'kiosk'
export type ValidationStatus = 'valid' | 'invalid' | 'duplicate' | 'expired'

export interface CheckInLog {
  id: string
  ticket_id: string
  station_id: string | null
  checked_in_by: string | null
  check_in_method: CheckInMethod
  is_offline_sync: boolean
  checked_in_at: string
  synced_at: string | null
  attendee_name: string | null
  attendee_email: string | null
  ticket_tier_name: string | null
  qr_code_scanned: string | null
  validation_status: ValidationStatus
  validation_message: string | null
  client_timestamp: string | null
  sync_retry_count: number
  created_at: string
}

export interface CreateCheckInLogInput {
  ticket_id: string
  station_id?: string
  checked_in_by?: string
  check_in_method?: CheckInMethod
  is_offline_sync?: boolean
  attendee_name?: string
  attendee_email?: string
  ticket_tier_name?: string
  qr_code_scanned?: string
  client_timestamp?: string
}

// =====================================================
// BADGE PRINT QUEUE TYPES
// =====================================================

export type BadgePrintStatus = 'pending' | 'printing' | 'completed' | 'failed'

export interface BadgePrintJob {
  id: string
  ticket_id: string
  station_id: string | null
  status: BadgePrintStatus
  priority: number
  retry_count: number
  error_message: string | null
  badge_template_id: string | null
  badge_data: BadgeData | null
  printer_id: string | null
  printer_name: string | null
  queued_at: string
  started_printing_at: string | null
  printed_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface BadgeData {
  attendee_name: string
  attendee_email: string
  event_name: string
  ticket_tier: string
  qr_code: string
  company?: string
  title?: string
  photo_url?: string
}

export interface CreateBadgePrintJobInput {
  ticket_id: string
  station_id?: string
  priority?: number
  badge_template_id?: string
  badge_data?: BadgeData
  printer_id?: string
  printer_name?: string
}

// =====================================================
// OFFLINE SYNC TYPES
// =====================================================

export type OperationType = 'check_in' | 'badge_print' | 'update'
export type SyncStatus = 'pending' | 'syncing' | 'completed' | 'failed'

export interface OfflineSyncQueueItem {
  id: string
  station_id: string | null
  operation_type: OperationType
  operation_data: Record<string, unknown>
  client_timestamp: string
  sync_status: SyncStatus
  sync_attempts: number
  last_sync_attempt: string | null
  error_message: string | null
  created_at: string
  synced_at: string | null
}

export interface OfflineCheckInData {
  ticket_id: string
  qr_code: string
  station_id: string
  checked_in_by?: string
  check_in_method: CheckInMethod
  client_timestamp: string
  attendee_name?: string
  attendee_email?: string
}

// =====================================================
// CHECK-IN STATISTICS TYPES
// =====================================================

export interface CheckInStatistics {
  event_id: string
  event_title: string
  total_tickets: number
  checked_in_count: number
  not_checked_in_count: number
  check_in_percentage: number
  badges_printed: number
  total_check_in_events: number
  last_check_in_at: string | null
}

// =====================================================
// TICKET TYPES (Extended)
// =====================================================

export interface Ticket {
  id: string
  order_id: string
  ticket_tier_id: string
  user_id: string
  qr_code: string
  barcode: string | null
  checked_in: boolean
  checked_in_at: string | null
  check_in_count: number
  badge_printed: boolean
  badge_printed_at: string | null
  qr_code_generated_at: string | null
  created_at: string
  updated_at: string
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface ScanQRCodeRequest {
  qr_code: string
  station_id: string
  checked_in_by?: string
  check_in_method?: CheckInMethod
  is_offline?: boolean
  client_timestamp?: string
}

export interface ScanQRCodeResponse {
  success: boolean
  message: string
  data?: {
    check_in_log_id: string
    ticket_id: string
    attendee_name: string
    attendee_email: string
    event_name: string
    ticket_tier: string
    checked_in_at: string
    is_duplicate: boolean
    previous_check_in_at?: string
  }
  error?: string
}

export interface SyncOfflineCheckInsRequest {
  station_id: string
  check_ins: OfflineCheckInData[]
}

export interface SyncOfflineCheckInsResponse {
  success: boolean
  synced_count: number
  failed_count: number
  results: Array<{
    client_timestamp: string
    success: boolean
    check_in_log_id?: string
    error?: string
  }>
}

export interface CheckTicketStatusRequest {
  ticket_id: string
}

export interface CheckTicketStatusResponse {
  ticket_id: string
  checked_in: boolean
  checked_in_at: string | null
  check_in_count: number
  badge_printed: boolean
  attendee_name: string
  attendee_email: string
  event_name: string
  ticket_tier: string
}

export interface PrintBadgeRequest {
  ticket_id: string
  station_id?: string
  priority?: number
  printer_id?: string
}

export interface PrintBadgeResponse {
  success: boolean
  badge_job_id: string
  message: string
}

export interface BadgeQueueStatusResponse {
  total_pending: number
  total_printing: number
  total_completed: number
  total_failed: number
  queue: BadgePrintJob[]
}

// =====================================================
// INDEXEDDB TYPES (for offline storage)
// =====================================================

export interface OfflineCheckInRecord {
  id: string // Local UUID
  ticket_id: string
  qr_code: string
  station_id: string
  checked_in_by?: string
  check_in_method: CheckInMethod
  client_timestamp: string
  attendee_name?: string
  attendee_email?: string
  synced: boolean
  sync_attempts: number
  last_sync_attempt?: string
  error?: string
}

export interface OfflineStationState {
  station_id: string
  is_online: boolean
  pending_sync_count: number
  last_sync_at: string | null
  last_heartbeat: string
}


/**
 * API Route: Process QR Code Scan and Check-in
 * POST /api/check-in/scan
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseTicketQRString, isValidTicketQRFormat } from '@/lib/utils/qr-code'
import type { ScanQRCodeRequest, ScanQRCodeResponse } from '@/lib/types/check-in'

export async function POST(request: NextRequest) {
  try {
    const body: ScanQRCodeRequest = await request.json()
    const { 
      qr_code, 
      station_id, 
      checked_in_by, 
      check_in_method = 'qr_code',
      is_offline = false,
      client_timestamp
    } = body
    
    // Validate required fields
    if (!qr_code || !station_id) {
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Missing required fields',
          error: 'qr_code and station_id are required'
        },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Unauthorized',
          error: 'Authentication required'
        },
        { status: 401 }
      )
    }
    
    // Validate QR code format
    if (!isValidTicketQRFormat(qr_code)) {
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Invalid QR code format',
          error: 'The scanned QR code is not a valid ticket QR code'
        },
        { status: 400 }
      )
    }
    
    // Parse QR code to get ticket ID
    const qrData = parseTicketQRString(qr_code)
    
    if (!qrData) {
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Failed to parse QR code',
          error: 'Could not extract ticket information from QR code'
        },
        { status: 400 }
      )
    }
    
    // Fetch ticket details with related data
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        qr_code,
        checked_in,
        checked_in_at,
        check_in_count,
        user_id,
        em_profiles!em_tickets_user_id_fkey (
          full_name,
          email
        ),
        em_ticket_tiers (
          name,
          em_events (
            id,
            title
          )
        )
      `)
      .eq('qr_code', qr_code)
      .single()
    
    if (ticketError || !ticket) {
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Ticket not found',
          error: 'No ticket found with this QR code'
        },
        { status: 404 }
      )
    }
    
    // Check if ticket is already checked in (allow for offline sync)
    const isDuplicate = ticket.checked_in && !is_offline
    
    if (isDuplicate) {
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Ticket already checked in',
          data: {
            check_in_log_id: '',
            ticket_id: ticket.id,
            attendee_name: ticket.em_profiles.full_name || 'Unknown',
            attendee_email: ticket.em_profiles.email,
            event_name: ticket.em_ticket_tiers.em_events.title,
            ticket_tier: ticket.em_ticket_tiers.name,
            checked_in_at: ticket.checked_in_at || '',
            is_duplicate: true,
            previous_check_in_at: ticket.checked_in_at || undefined
          }
        },
        { status: 409 }
      )
    }
    
    // Use the database function to process check-in
    const { data: checkInResult, error: checkInError } = await supabase
      .rpc('process_check_in', {
        p_ticket_id: ticket.id,
        p_station_id: station_id,
        p_checked_in_by: checked_in_by || user.id,
        p_check_in_method: check_in_method,
        p_is_offline_sync: is_offline
      })
    
    if (checkInError || !checkInResult?.success) {
      console.error('Check-in error:', checkInError || checkInResult)
      return NextResponse.json<ScanQRCodeResponse>(
        { 
          success: false, 
          message: 'Failed to process check-in',
          error: checkInResult?.error || checkInError?.message || 'Unknown error'
        },
        { status: 500 }
      )
    }
    
    // Return success response
    return NextResponse.json<ScanQRCodeResponse>({
      success: true,
      message: is_offline ? 'Check-in synced successfully' : 'Check-in successful',
      data: {
        check_in_log_id: checkInResult.check_in_log_id,
        ticket_id: ticket.id,
        attendee_name: checkInResult.attendee_name,
        attendee_email: checkInResult.attendee_email,
        event_name: ticket.em_ticket_tiers.em_events.title,
        ticket_tier: ticket.em_ticket_tiers.name,
        checked_in_at: checkInResult.checked_in_at,
        is_duplicate: false
      }
    })
  } catch (error) {
    console.error('Error processing check-in:', error)
    return NextResponse.json<ScanQRCodeResponse>(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET: Check if a QR code is valid without checking in
 * Useful for validation before actual check-in
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const qr_code = searchParams.get('qr_code')
    
    if (!qr_code) {
      return NextResponse.json(
        { error: 'qr_code parameter is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Validate QR code format
    if (!isValidTicketQRFormat(qr_code)) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid QR code format'
      })
    }
    
    // Fetch ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        checked_in,
        checked_in_at,
        em_profiles!em_tickets_user_id_fkey (
          full_name,
          email
        ),
        em_ticket_tiers (
          name,
          em_events (
            title
          )
        )
      `)
      .eq('qr_code', qr_code)
      .single()
    
    if (ticketError || !ticket) {
      return NextResponse.json({
        valid: false,
        message: 'Ticket not found'
      })
    }
    
    return NextResponse.json({
      valid: true,
      checked_in: ticket.checked_in,
      checked_in_at: ticket.checked_in_at,
      attendee_name: ticket.em_profiles.full_name,
      attendee_email: ticket.em_profiles.email,
      event_name: ticket.em_ticket_tiers.em_events.title,
      ticket_tier: ticket.em_ticket_tiers.name
    })
  } catch (error) {
    console.error('Error validating QR code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


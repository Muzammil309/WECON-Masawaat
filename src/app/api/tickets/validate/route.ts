import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ValidateTicketRequest, ValidateTicketResponse } from '@/types/ticketing'

/**
 * POST /api/tickets/validate
 * Validates a ticket QR code and checks if it can be used for check-in
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Only admins and speakers can validate tickets
    if (!profile || !['admin', 'speaker'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and speakers can validate tickets' },
        { status: 403 }
      )
    }

    const body: ValidateTicketRequest = await request.json()
    const { qr_code, event_id, location } = body

    if (!qr_code || !event_id) {
      return NextResponse.json(
        { error: 'Missing required fields: qr_code, event_id' },
        { status: 400 }
      )
    }

    // Find ticket by QR code
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        *,
        ticket_type:em_ticket_types(*),
        order:em_orders(*),
        seat:em_seats(*)
      `)
      .eq('qr_code', qr_code)
      .single()

    if (ticketError || !ticket) {
      const response: ValidateTicketResponse = {
        is_valid: false,
        error_message: 'Invalid QR code',
        can_check_in: false,
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Verify ticket belongs to the event
    const { data: order } = await supabase
      .from('em_orders')
      .select('event_id')
      .eq('id', ticket.order_id)
      .single()

    if (!order || order.event_id !== event_id) {
      const response: ValidateTicketResponse = {
        is_valid: false,
        error_message: 'Ticket is not valid for this event',
        can_check_in: false,
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Check if ticket is already checked in
    if (ticket.checked_in) {
      const response: ValidateTicketResponse = {
        is_valid: true,
        ticket,
        error_message: `Already checked in at ${new Date(ticket.checked_in_at).toLocaleString()}`,
        can_check_in: false,
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Check ticket status
    if (ticket.status === 'cancelled') {
      const response: ValidateTicketResponse = {
        is_valid: false,
        error_message: 'Ticket has been cancelled',
        can_check_in: false,
      }
      return NextResponse.json(response, { status: 200 })
    }

    if (ticket.status === 'expired') {
      const response: ValidateTicketResponse = {
        is_valid: false,
        error_message: 'Ticket has expired',
        can_check_in: false,
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Check QR code expiration
    if (ticket.qr_code_expires_at && new Date(ticket.qr_code_expires_at) < new Date()) {
      const response: ValidateTicketResponse = {
        is_valid: false,
        error_message: 'QR code has expired',
        can_check_in: false,
      }
      return NextResponse.json(response, { status: 200 })
    }

    // Ticket is valid and can be checked in
    const response: ValidateTicketResponse = {
      is_valid: true,
      ticket,
      can_check_in: true,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    console.error('Error validating ticket:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/tickets/validate
 * Check in a validated ticket
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Only admins and speakers can check in tickets
    if (!profile || !['admin', 'speaker'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and speakers can check in tickets' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { ticket_id, location } = body

    if (!ticket_id) {
      return NextResponse.json(
        { error: 'Missing required field: ticket_id' },
        { status: 400 }
      )
    }

    // Update ticket to checked in
    const { data: ticket, error: updateError } = await supabase
      .from('em_tickets')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        check_in_location: location || null,
        check_in_by: user.id,
        status: 'used',
      })
      .eq('id', ticket_id)
      .select(`
        *,
        ticket_type:em_ticket_types(*),
        order:em_orders(*),
        seat:em_seats(*)
      `)
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    // Award points for attendance
    await supabase.from('em_points').insert({
      user_id: ticket.order?.user_id,
      event_id: ticket.order?.event_id,
      activity_type: 'session_attendance',
      points: 10,
      metadata: {
        ticket_id: ticket.id,
        check_in_location: location,
      },
    })

    return NextResponse.json({
      success: true,
      ticket,
    })

  } catch (error: any) {
    console.error('Error checking in ticket:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


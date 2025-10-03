/**
 * API Route: Check Ticket Check-in Status
 * GET /api/check-in/status/[ticketId]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CheckTicketStatusResponse } from '@/lib/types/check-in'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Fetch ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        checked_in,
        checked_in_at,
        check_in_count,
        badge_printed,
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
      .eq('id', ticketId)
      .single()
    
    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      )
    }
    
    // Check if user has access to this ticket
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isAdmin = profile?.role === 'admin' || profile?.role === 'organizer'
    
    if (!isAdmin && ticket.em_profiles.email !== user.email) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this ticket' },
        { status: 403 }
      )
    }
    
    const response: CheckTicketStatusResponse = {
      ticket_id: ticket.id,
      checked_in: ticket.checked_in,
      checked_in_at: ticket.checked_in_at,
      check_in_count: ticket.check_in_count,
      badge_printed: ticket.badge_printed,
      attendee_name: ticket.em_profiles.full_name || 'Unknown',
      attendee_email: ticket.em_profiles.email,
      event_name: ticket.em_ticket_tiers.em_events.title,
      ticket_tier: ticket.em_ticket_tiers.name
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error checking ticket status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


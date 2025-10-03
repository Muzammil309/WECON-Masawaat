/**
 * API Route: Add Badge to Print Queue
 * POST /api/badges/print
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { PrintBadgeRequest, PrintBadgeResponse } from '@/lib/types/check-in'

export async function POST(request: NextRequest) {
  try {
    const body: PrintBadgeRequest = await request.json()
    const { ticket_id, station_id, priority = 0, printer_id } = body
    
    if (!ticket_id) {
      return NextResponse.json<PrintBadgeResponse>(
        { 
          success: false,
          badge_job_id: '',
          message: 'ticket_id is required'
        },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json<PrintBadgeResponse>(
        { 
          success: false,
          badge_job_id: '',
          message: 'Unauthorized'
        },
        { status: 401 }
      )
    }
    
    // Fetch ticket details for badge data
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        qr_code,
        badge_printed,
        em_profiles!em_tickets_user_id_fkey (
          full_name,
          email,
          company,
          title
        ),
        em_ticket_tiers (
          name,
          em_events (
            title
          )
        )
      `)
      .eq('id', ticket_id)
      .single()
    
    if (ticketError || !ticket) {
      return NextResponse.json<PrintBadgeResponse>(
        { 
          success: false,
          badge_job_id: '',
          message: 'Ticket not found'
        },
        { status: 404 }
      )
    }
    
    // Prepare badge data
    const badge_data = {
      attendee_name: ticket.em_profiles.full_name || 'Guest',
      attendee_email: ticket.em_profiles.email,
      event_name: ticket.em_ticket_tiers.em_events.title,
      ticket_tier: ticket.em_ticket_tiers.name,
      qr_code: ticket.qr_code,
      company: ticket.em_profiles.company,
      title: ticket.em_profiles.title
    }
    
    // Add to badge print queue
    const { data: badgeJob, error: badgeError } = await supabase
      .from('badge_print_queue')
      .insert({
        ticket_id,
        station_id,
        priority,
        badge_data,
        printer_id,
        status: 'pending'
      })
      .select('id')
      .single()
    
    if (badgeError || !badgeJob) {
      console.error('Error adding badge to print queue:', badgeError)
      return NextResponse.json<PrintBadgeResponse>(
        { 
          success: false,
          badge_job_id: '',
          message: 'Failed to add badge to print queue'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json<PrintBadgeResponse>({
      success: true,
      badge_job_id: badgeJob.id,
      message: 'Badge added to print queue successfully'
    })
  } catch (error) {
    console.error('Error processing badge print request:', error)
    return NextResponse.json<PrintBadgeResponse>(
      { 
        success: false,
        badge_job_id: '',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}


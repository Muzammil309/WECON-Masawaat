/**
 * Badge Scan API Route
 * POST /api/exhibitor/badge/scan
 * Scan attendee badge QR code and return attendee information
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { parseTicketQRString } from '@/lib/utils/qr-code'
import type { BadgeScanResult } from '@/lib/types/exhibitor'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<BadgeScanResult>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const { qr_code, booth_id } = await request.json()

    if (!qr_code) {
      return NextResponse.json<BadgeScanResult>(
        { success: false, error: 'QR code is required' },
        { status: 400 }
      )
    }

    // Parse QR code
    const qrData = parseTicketQRString(qr_code)
    if (!qrData) {
      return NextResponse.json<BadgeScanResult>(
        { success: false, error: 'Invalid QR code format' },
        { status: 400 }
      )
    }

    // Get ticket information
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        user_id,
        ticket_tier_id,
        em_profiles!user_id (
          id,
          full_name,
          email,
          company,
          job_title,
          phone
        ),
        em_ticket_tiers!ticket_tier_id (
          name
        )
      `)
      .eq('id', qrData.ticketId)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json<BadgeScanResult>(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    const profile = Array.isArray(ticket.em_profiles) ? ticket.em_profiles[0] : ticket.em_profiles
    const ticketTier = Array.isArray(ticket.em_ticket_tiers) ? ticket.em_ticket_tiers[0] : ticket.em_ticket_tiers

    // Check if already captured (if booth_id provided)
    let previousCapture = null
    if (booth_id) {
      const { data: existingLead } = await supabase
        .from('lead_captures')
        .select('id, created_at, lead_score, interest_level')
        .eq('booth_id', booth_id)
        .eq('attendee_id', ticket.user_id)
        .single()

      if (existingLead) {
        previousCapture = {
          id: existingLead.id,
          captured_at: existingLead.created_at,
          lead_score: existingLead.lead_score,
          interest_level: existingLead.interest_level
        }
      }
    }

    return NextResponse.json<BadgeScanResult>({
      success: true,
      attendee: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        company: profile.company,
        job_title: profile.job_title,
        phone: profile.phone,
        ticket_tier: ticketTier?.name || null
      },
      already_captured: !!previousCapture,
      previous_capture: previousCapture
    })

  } catch (error) {
    console.error('Error scanning badge:', error)
    return NextResponse.json<BadgeScanResult>(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


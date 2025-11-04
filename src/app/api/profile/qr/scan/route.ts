import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ScanProfileQRRequest {
  qr_code: string
}

// POST /api/profile/qr/scan - Scan a profile QR code and return user info with events
export async function POST(request: NextRequest) {
  try {
    console.log('📡 POST /api/profile/qr/scan - Request received')
    const supabase = await createClient()
    const body: ScanProfileQRRequest = await request.json()
    const { qr_code } = body

    // Check authentication (scanner must be authenticated)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError?.message)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ Scanner authenticated:', user.id)

    // Parse QR code to validate format
    let qrData: any
    try {
      qrData = JSON.parse(qr_code)
    } catch (parseError) {
      console.error('❌ Invalid QR code format:', parseError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid QR code format',
          message: 'The scanned QR code is not a valid profile QR code'
        },
        { status: 400 }
      )
    }

    // Validate QR code type
    if (qrData.type !== 'profile') {
      console.error('❌ QR code is not a profile QR code')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid QR code type',
          message: 'This QR code is not a profile QR code'
        },
        { status: 400 }
      )
    }

    const userId = qrData.user_id

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('em_profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        company,
        job_title,
        phone,
        bio,
        role
      `)
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      console.error('❌ Profile not found:', profileError?.message)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Profile not found',
          message: 'No user profile found for this QR code'
        },
        { status: 404 }
      )
    }

    // Fetch all tickets for this user with event details
    const { data: tickets, error: ticketsError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        checked_in,
        checked_in_at,
        status,
        em_ticket_tiers (
          id,
          name,
          em_events (
            id,
            title,
            start_date,
            end_date,
            location,
            venue_name,
            status,
            cover_image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (ticketsError) {
      console.error('❌ Error fetching tickets:', ticketsError)
    }

    // Format events data
    const events = tickets?.map((ticket: any) => ({
      ticket_id: ticket.id,
      event_id: ticket.em_ticket_tiers?.em_events?.id,
      event_title: ticket.em_ticket_tiers?.em_events?.title,
      event_start_date: ticket.em_ticket_tiers?.em_events?.start_date,
      event_end_date: ticket.em_ticket_tiers?.em_events?.end_date,
      event_location: ticket.em_ticket_tiers?.em_events?.location,
      event_venue_name: ticket.em_ticket_tiers?.em_events?.venue_name,
      event_status: ticket.em_ticket_tiers?.em_events?.status,
      event_cover_image: ticket.em_ticket_tiers?.em_events?.cover_image_url,
      ticket_tier_name: ticket.em_ticket_tiers?.name,
      ticket_status: ticket.status,
      checked_in: ticket.checked_in,
      checked_in_at: ticket.checked_in_at,
    })) || []

    console.log(`✅ Profile scanned successfully - Found ${events.length} events`)

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          company: profile.company,
          job_title: profile.job_title,
          phone: profile.phone,
          bio: profile.bio,
          role: profile.role,
        },
        events: events,
        total_events: events.length,
        checked_in_events: events.filter((e: any) => e.checked_in).length,
      },
      message: `Profile found with ${events.length} registered event(s)`,
    })
  } catch (error) {
    console.error('❌ POST /api/profile/qr/scan error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to scan profile QR code',
      },
      { status: 500 }
    )
  }
}


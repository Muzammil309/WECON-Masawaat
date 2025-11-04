import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import QRCode from 'qrcode'

// Validation schema for registration
const registrationSchema = z.object({
  ticket_tier_id: z.string().uuid('Invalid ticket tier ID'),
  attendee_info: z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    company: z.string().optional(),
    job_title: z.string().optional(),
  }),
})

// POST /api/events/[id]/register - Register for an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📝 POST /api/events/[id]/register - Registration request received')
    const supabase = await createClient()
    const { id: eventId } = await params

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Authentication failed:', authError?.message)
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Parse and validate request body
    const body = await request.json()
    console.log('📊 Request body:', body)

    const validatedData = registrationSchema.parse(body)
    console.log('✅ Validation passed')

    // Check if event exists and is published
    const { data: event, error: eventError } = await supabase
      .from('em_events')
      .select('id, title, status, start_date, end_date')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      console.error('❌ Event not found:', eventError?.message)
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    if (event.status !== 'published') {
      console.error('❌ Event not published:', event.status)
      return NextResponse.json(
        { success: false, error: 'Event is not available for registration' },
        { status: 400 }
      )
    }

    console.log('✅ Event found:', event.title)

    // Check if ticket tier exists and is available
    const { data: ticketTier, error: tierError } = await supabase
      .from('em_ticket_tiers')
      .select('*')
      .eq('id', validatedData.ticket_tier_id)
      .eq('event_id', eventId)
      .single()

    if (tierError || !ticketTier) {
      console.error('❌ Ticket tier not found:', tierError?.message)
      return NextResponse.json(
        { success: false, error: 'Ticket tier not found' },
        { status: 404 }
      )
    }

    if (!ticketTier.is_active) {
      console.error('❌ Ticket tier not active')
      return NextResponse.json(
        { success: false, error: 'This ticket tier is not available' },
        { status: 400 }
      )
    }

    // Check if tickets are still available
    if (ticketTier.quantity_available !== null) {
      const soldOut = ticketTier.quantity_sold >= ticketTier.quantity_available
      if (soldOut) {
        console.error('❌ Tickets sold out')
        return NextResponse.json(
          { success: false, error: 'Tickets are sold out for this tier' },
          { status: 400 }
        )
      }
    }

    console.log('✅ Ticket tier available:', ticketTier.name)

    // Check if user already registered for this event
    const { data: existingTicket } = await supabase
      .from('em_tickets')
      .select('id')
      .eq('user_id', user.id)
      .eq('ticket_tier_id', validatedData.ticket_tier_id)
      .eq('status', 'confirmed')
      .maybeSingle()

    if (existingTicket) {
      console.error('❌ User already registered')
      return NextResponse.json(
        { success: false, error: 'You have already registered for this event' },
        { status: 400 }
      )
    }

    // Update user profile with attendee info
    const { error: profileError } = await supabase
      .from('em_profiles')
      .update({
        full_name: validatedData.attendee_info.full_name,
        email: validatedData.attendee_info.email,
        phone: validatedData.attendee_info.phone,
        company: validatedData.attendee_info.company,
        job_title: validatedData.attendee_info.job_title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) {
      console.error('⚠️ Profile update failed:', profileError.message)
      // Continue anyway - profile update is not critical
    }

    // Generate QR code data
    const qrData = {
      ticket_id: crypto.randomUUID(),
      user_id: user.id,
      event_id: eventId,
      ticket_tier_id: validatedData.ticket_tier_id,
      timestamp: new Date().toISOString(),
    }

    const qrCodeString = JSON.stringify(qrData)
    console.log('🔐 QR code data generated')

    // Generate QR code image (base64)
    const qrCodeImage = await QRCode.toDataURL(qrCodeString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 512,
      margin: 2,
    })

    console.log('✅ QR code image generated')

    // Create ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .insert({
        id: qrData.ticket_id,
        user_id: user.id,
        ticket_tier_id: validatedData.ticket_tier_id,
        qr_code: qrCodeString,
        status: 'confirmed', // Free tickets are auto-confirmed
        purchase_date: new Date().toISOString(),
      })
      .select(`
        *,
        ticket_tier:em_ticket_tiers(*),
        user:em_profiles(full_name, email, phone, company, job_title)
      `)
      .single()

    if (ticketError) {
      console.error('❌ Ticket creation failed:', ticketError.message)
      return NextResponse.json(
        { success: false, error: 'Failed to create ticket: ' + ticketError.message },
        { status: 500 }
      )
    }

    console.log('✅ Ticket created:', ticket.id)

    // Update ticket tier sold count
    const { error: updateTierError } = await supabase
      .from('em_ticket_tiers')
      .update({
        quantity_sold: (ticketTier.quantity_sold || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', validatedData.ticket_tier_id)

    if (updateTierError) {
      console.error('⚠️ Failed to update tier count:', updateTierError.message)
      // Continue anyway - ticket is already created
    }

    console.log('✅ Registration complete!')

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        qr_code_image: qrCodeImage,
        event,
      },
      message: 'Registration successful!',
    })
  } catch (error) {
    console.error('❌ POST /api/events/[id]/register error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register for event',
      },
      { status: 500 }
    )
  }
}


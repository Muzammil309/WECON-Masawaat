import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import QRCode from 'qrcode'

// GET /api/tickets/[id] - Get ticket details with QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📡 GET /api/tickets/[id] - Request received')
    const supabase = await createClient()
    const { id: ticketId } = await params

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

    // Fetch ticket with relations
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        *,
        ticket_tier:em_ticket_tiers(*),
        user:em_profiles(
          id,
          full_name,
          email,
          phone,
          company,
          job_title
        )
      `)
      .eq('id', ticketId)
      .single()

    if (ticketError || !ticket) {
      console.error('❌ Ticket not found:', ticketError?.message)
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      )
    }

    // Check if user owns this ticket or is admin
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = ticket.user_id === user.id

    if (!isAdmin && !isOwner) {
      console.error('❌ Unauthorized access to ticket')
      return NextResponse.json(
        { success: false, error: 'You do not have permission to view this ticket' },
        { status: 403 }
      )
    }

    console.log('✅ Ticket found:', ticket.id)

    // Generate QR code image from stored QR code data
    let qrCodeImage = ''
    if (ticket.qr_code) {
      try {
        qrCodeImage = await QRCode.toDataURL(ticket.qr_code, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 512,
          margin: 2,
        })
        console.log('✅ QR code image generated')
      } catch (qrError) {
        console.error('⚠️ Failed to generate QR code image:', qrError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ticket,
        qr_code_image: qrCodeImage,
      },
    })
  } catch (error) {
    console.error('❌ GET /api/tickets/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ticket',
      },
      { status: 500 }
    )
  }
}


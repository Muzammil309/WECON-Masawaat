/**
 * API Route: Generate/Retrieve QR Code for Ticket
 * GET /api/tickets/[id]/qr
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateTicketQRString,
  generateQRCodeImage,
  generateQRCodeSVG,
  generateQRCodeBuffer
} from '@/lib/utils/qr-code'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params
    const supabase = await createClient()
    
    // Get format from query params (image, svg, or buffer)
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format') || 'image' // image, svg, buffer
    const width = parseInt(searchParams.get('width') || '300')
    
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
        qr_code,
        user_id,
        ticket_tier_id,
        em_ticket_tiers (
          event_id
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
    
    // Verify user owns this ticket or is admin
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const isAdmin = profile?.role === 'admin' || profile?.role === 'organizer'
    const isOwner = ticket.user_id === user.id
    
    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have access to this ticket' },
        { status: 403 }
      )
    }
    
    // Get or generate QR code string
    let qrString = ticket.qr_code
    
    if (!qrString) {
      // Generate new QR code if it doesn't exist
      qrString = generateTicketQRString(
        ticket.id,
        ticket.em_ticket_tiers.event_id,
        ticket.user_id,
        ticket.ticket_tier_id
      )
      
      // Update ticket with QR code
      const { error: updateError } = await supabase
        .from('em_tickets')
        .update({ qr_code: qrString })
        .eq('id', ticketId)
      
      if (updateError) {
        console.error('Error updating ticket with QR code:', updateError)
      }
    }
    
    // Generate QR code in requested format
    if (format === 'svg') {
      const svg = await generateQRCodeSVG(qrString, { width })
      
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } else if (format === 'buffer' || format === 'png') {
      const buffer = await generateQRCodeBuffer(qrString, { width })

      // Convert Buffer to Uint8Array for NextResponse compatibility
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      })
    } else {
      // Default: return data URL
      const dataUrl = await generateQRCodeImage(qrString, { width })
      
      return NextResponse.json({
        qrCode: dataUrl,
        qrString,
        ticketId: ticket.id,
        format: 'data-url'
      })
    }
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

/**
 * POST: Regenerate QR code for a ticket
 * Useful if QR code is compromised or needs to be reset
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ticketId } = await params
    const supabase = await createClient()
    
    // Verify user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin' && profile?.role !== 'organizer') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can regenerate QR codes' },
        { status: 403 }
      )
    }
    
    // Fetch ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from('em_tickets')
      .select(`
        id,
        user_id,
        ticket_tier_id,
        em_ticket_tiers (
          event_id
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
    
    // Generate new QR code
    const qrString = generateTicketQRString(
      ticket.id,
      ticket.em_ticket_tiers.event_id,
      ticket.user_id,
      ticket.ticket_tier_id
    )
    
    // Update ticket with new QR code
    const { error: updateError } = await supabase
      .from('em_tickets')
      .update({ 
        qr_code: qrString,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
    
    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update ticket with new QR code' },
        { status: 500 }
      )
    }
    
    // Generate QR code image
    const dataUrl = await generateQRCodeImage(qrString)
    
    return NextResponse.json({
      success: true,
      qrCode: dataUrl,
      qrString,
      ticketId: ticket.id,
      message: 'QR code regenerated successfully'
    })
  } catch (error) {
    console.error('Error regenerating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate QR code' },
      { status: 500 }
    )
  }
}


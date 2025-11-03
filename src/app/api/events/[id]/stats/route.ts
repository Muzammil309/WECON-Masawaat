import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/[id]/stats - Get event statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('em_events')
      .select('id, title, start_date, end_date, max_attendees')
      .eq('id', id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Get ticket tiers for this event
    const { data: ticketTiers } = await supabase
      .from('em_ticket_tiers')
      .select('id, name, quantity_available, quantity_sold')
      .eq('event_id', id)

    const ticketTierIds = ticketTiers?.map((t: any) => t.id) || []

    // Get ticket statistics
    const { data: tickets } = await supabase
      .from('em_tickets')
      .select('id, status, checked_in, checked_in_at, purchase_date')
      .in('ticket_tier_id', ticketTierIds)

    // Get session statistics
    const { data: sessions } = await supabase
      .from('em_sessions')
      .select('id, title, session_type, status')
      .eq('event_id', id)

    // Get speaker statistics
    const { data: speakers } = await supabase
      .from('em_speakers')
      .select('id, name')
      .eq('event_id', id)

    // Calculate statistics
    const totalTickets = tickets?.length || 0
    const confirmedTickets = tickets?.filter((t: any) => t.status === 'confirmed').length || 0
    const checkedInTickets = tickets?.filter((t: any) => t.checked_in).length || 0
    const pendingTickets = tickets?.filter((t: any) => t.status === 'pending').length || 0
    const cancelledTickets = tickets?.filter((t: any) => t.status === 'cancelled').length || 0

    // Calculate check-in rate
    const checkInRate = confirmedTickets > 0 
      ? Math.round((checkedInTickets / confirmedTickets) * 100) 
      : 0

    // Calculate capacity
    const totalCapacity = ticketTiers?.reduce((sum: number, tier: any) => sum + (tier.quantity_available || 0), 0) || 0
    const capacityUsed = ticketTiers?.reduce((sum: number, tier: any) => sum + (tier.quantity_sold || 0), 0) || 0
    const capacityRate = totalCapacity > 0
      ? Math.round((capacityUsed / totalCapacity) * 100)
      : 0

    // Get recent check-ins (last 10)
    const recentCheckIns = tickets
      ?.filter((t: any) => t.checked_in && t.checked_in_at)
      .sort((a: any, b: any) => new Date(b.checked_in_at!).getTime() - new Date(a.checked_in_at!).getTime())
      .slice(0, 10)

    // Session breakdown
    const sessionBreakdown = {
      total: sessions?.length || 0,
      scheduled: sessions?.filter((s: any) => s.status === 'scheduled').length || 0,
      in_progress: sessions?.filter((s: any) => s.status === 'in_progress').length || 0,
      completed: sessions?.filter((s: any) => s.status === 'completed').length || 0,
      cancelled: sessions?.filter((s: any) => s.status === 'cancelled').length || 0,
    }

    // Ticket tier breakdown
    const ticketTierBreakdown = ticketTiers?.map((tier: any) => ({
      id: tier.id,
      name: tier.name,
      total: tier.quantity_available || 0,
      sold: tier.quantity_sold || 0,
      available: (tier.quantity_available || 0) - (tier.quantity_sold || 0),
      soldPercentage: tier.quantity_available
        ? Math.round((tier.quantity_sold / tier.quantity_available) * 100)
        : 0
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        event: {
          id: event.id,
          title: event.title,
          start_date: event.start_date,
          end_date: event.end_date,
          max_attendees: event.max_attendees,
        },
        tickets: {
          total: totalTickets,
          confirmed: confirmedTickets,
          pending: pendingTickets,
          cancelled: cancelledTickets,
          checked_in: checkedInTickets,
          check_in_rate: checkInRate,
        },
        capacity: {
          total: totalCapacity,
          used: capacityUsed,
          available: totalCapacity - capacityUsed,
          usage_rate: capacityRate,
        },
        sessions: sessionBreakdown,
        speakers: {
          total: speakers?.length || 0,
        },
        ticket_tiers: ticketTierBreakdown,
        recent_check_ins: recentCheckIns,
      }
    })
  } catch (error) {
    console.error('GET /api/events/[id]/stats error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch event statistics'
      },
      { status: 500 }
    )
  }
}


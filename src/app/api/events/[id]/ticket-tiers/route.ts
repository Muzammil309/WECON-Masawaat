import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/[id]/ticket-tiers - Get ticket tiers for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📡 GET /api/events/[id]/ticket-tiers - Request received')
    const supabase = await createClient()
    const { id: eventId } = await params

    // Fetch ticket tiers for the event
    const { data: ticketTiers, error } = await supabase
      .from('em_ticket_tiers')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .order('tier_order', { ascending: true })

    if (error) {
      console.error('❌ Database error:', error)
      throw error
    }

    console.log('✅ Ticket tiers fetched:', ticketTiers?.length || 0)

    return NextResponse.json({
      success: true,
      data: ticketTiers,
    })
  } catch (error) {
    console.error('❌ GET /api/events/[id]/ticket-tiers error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch ticket tiers',
      },
      { status: 500 }
    )
  }
}


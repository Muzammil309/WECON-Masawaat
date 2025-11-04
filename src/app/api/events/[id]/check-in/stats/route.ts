import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/[id]/check-in/stats - Get check-in statistics for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📡 GET /api/events/[id]/check-in/stats - Request received')
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

    // Check if user is admin
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      console.error('❌ User is not an admin')
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get total tickets for the event
    const { count: totalTickets, error: totalError } = await supabase
      .from('em_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('ticket_tier_id', eventId)

    if (totalError) {
      console.error('❌ Error fetching total tickets:', totalError)
    }

    // Get checked-in tickets
    const { count: checkedIn, error: checkedInError } = await supabase
      .from('em_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('ticket_tier_id', eventId)
      .eq('checked_in', true)

    if (checkedInError) {
      console.error('❌ Error fetching checked-in tickets:', checkedInError)
    }

    // Calculate stats
    const total = totalTickets || 0
    const checked = checkedIn || 0
    const pending = total - checked
    const checkInRate = total > 0 ? (checked / total) * 100 : 0

    const stats = {
      total_tickets: total,
      checked_in: checked,
      pending: pending,
      check_in_rate: checkInRate,
    }

    console.log('✅ Stats calculated:', stats)

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('❌ GET /api/events/[id]/check-in/stats error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch check-in stats',
      },
      { status: 500 }
    )
  }
}


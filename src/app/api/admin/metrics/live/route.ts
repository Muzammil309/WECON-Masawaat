import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/metrics/live
 * Returns real-time event metrics for the admin dashboard
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin/organizer
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'organizer'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get event attendance metrics
    const { data: eventMetrics, error: metricsError } = await supabase
      .from('event_attendance_metrics')
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (metricsError && metricsError.code !== 'PGRST116') {
      console.error('Error fetching event metrics:', metricsError)
      return NextResponse.json(
        { error: 'Failed to fetch event metrics' },
        { status: 500 }
      )
    }

    // Get active sessions count
    const now = new Date().toISOString()
    const { data: activeSessions, error: sessionsError } = await supabase
      .from('em_sessions')
      .select('id')
      .eq('event_id', eventId)
      .lte('starts_at', now)
      .gte('ends_at', now)

    // Get total revenue from orders
    const { data: revenueData, error: revenueError } = await supabase
      .from('em_orders')
      .select('total_amount')
      .eq('event_id', eventId)
      .eq('status', 'completed')

    const totalRevenue = revenueData?.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0) || 0

    // Get recent check-ins (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const { data: recentCheckIns, error: checkInsError } = await supabase
      .from('check_in_logs')
      .select('id, checked_in_at, ticket_id(event_id)')
      .gte('checked_in_at', fiveMinutesAgo)
      .order('checked_in_at', { ascending: false })
      .limit(100)

    const recentCheckInsForEvent = recentCheckIns?.filter(
      (checkIn: any) => checkIn.ticket_id?.event_id === eventId
    ) || []

    // Calculate check-in velocity (per minute)
    const checkInVelocity = recentCheckInsForEvent.length / 5

    // Get session metrics for all sessions
    const { data: sessionMetrics, error: sessionMetricsError } = await supabase
      .from('session_metrics')
      .select(`
        *,
        session:em_sessions(id, title, starts_at, ends_at)
      `)
      .in('session_id',
        (await supabase
          .from('em_sessions')
          .select('id')
          .eq('event_id', eventId)
        ).data?.map((s: any) => s.id) || []
      )

    const response = {
      event_id: eventId,
      metrics: eventMetrics || {
        total_registered: 0,
        total_checked_in: 0,
        currently_onsite: 0,
        peak_concurrent: 0,
        check_in_rate: 0,
        last_updated: new Date().toISOString()
      },
      active_sessions: activeSessions?.length || 0,
      total_revenue: totalRevenue,
      check_in_velocity: Math.round(checkInVelocity * 10) / 10,
      recent_check_ins: recentCheckInsForEvent.length,
      session_metrics: sessionMetrics || [],
      last_updated: new Date().toISOString()
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in live metrics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/metrics/live
 * Update event metrics (called by background jobs or manual refresh)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Calculate metrics
    const { data: tickets } = await supabase
      .from('em_tickets')
      .select('id, checked_in, order_id(event_id)')
      .eq('order_id.event_id', eventId)

    const totalRegistered = tickets?.length || 0
    const totalCheckedIn = tickets?.filter((t: any) => t.checked_in).length || 0
    const checkInRate = totalRegistered > 0 ? (totalCheckedIn / totalRegistered) * 100 : 0

    // Get currently onsite (checked in but not checked out)
    const { data: currentlyOnsite } = await supabase
      .from('session_attendance')
      .select('id')
      .is('checked_out_at', null)

    // Upsert metrics
    const { data: metrics, error: upsertError } = await supabase
      .from('event_attendance_metrics')
      .upsert({
        event_id: eventId,
        total_registered: totalRegistered,
        total_checked_in: totalCheckedIn,
        currently_onsite: currentlyOnsite?.length || 0,
        check_in_rate: checkInRate,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'event_id'
      })
      .select()
      .single()

    if (upsertError) {
      console.error('Error upserting metrics:', upsertError)
      return NextResponse.json(
        { error: 'Failed to update metrics' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      metrics 
    })

  } catch (error) {
    console.error('Error updating metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


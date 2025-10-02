import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/admin/sessions/[id]/metrics
 * Returns real-time metrics for a specific session
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params

    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('em_sessions')
      .select('*, event:em_events(id, title)')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get or create session metrics
    let { data: metrics, error: metricsError } = await supabase
      .from('session_metrics')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    // If metrics don't exist, create them
    if (metricsError && metricsError.code === 'PGRST116') {
      const { data: newMetrics, error: createError } = await supabase
        .from('session_metrics')
        .insert({
          session_id: sessionId,
          current_attendees: 0,
          peak_attendees: 0,
          total_check_ins: 0,
          total_check_outs: 0,
          average_duration_minutes: 0,
          engagement_rate: 0,
          drop_off_rate: 0,
          last_updated: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating session metrics:', createError)
      } else {
        metrics = newMetrics
      }
    }

    // Get current attendance (checked in but not checked out)
    const { data: currentAttendance, error: attendanceError } = await supabase
      .from('session_attendance')
      .select('*')
      .eq('session_id', sessionId)
      .is('checked_out_at', null)

    const currentAttendees = currentAttendance?.length || 0

    // Get total check-ins
    const { data: allAttendance } = await supabase
      .from('session_attendance')
      .select('*')
      .eq('session_id', sessionId)

    const totalCheckIns = allAttendance?.length || 0
    const totalCheckOuts = allAttendance?.filter((a: any) => a.checked_out_at).length || 0

    // Calculate average duration
    const completedSessions = allAttendance?.filter((a: any) => a.duration_minutes) || []
    const avgDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum: number, a: any) => sum + (a.duration_minutes || 0), 0) / completedSessions.length
      : 0

    // Calculate drop-off rate
    const dropOffRate = totalCheckIns > 0
      ? ((totalCheckIns - currentAttendees) / totalCheckIns) * 100
      : 0

    // Get engagement metrics (chat, questions, polls)
    const { data: chatMessages } = await supabase
      .from('session_chat_messages')
      .select('id')
      .eq('session_id', sessionId)

    const { data: questions } = await supabase
      .from('session_questions')
      .select('id')
      .eq('session_id', sessionId)

    const { data: polls } = await supabase
      .from('session_polls')
      .select('id, total_votes')
      .eq('session_id', sessionId)

    const totalEngagementActions =
      (chatMessages?.length || 0) +
      (questions?.length || 0) +
      (polls?.reduce((sum: number, p: any) => sum + (p.total_votes || 0), 0) || 0)

    const engagementRate = currentAttendees > 0
      ? (totalEngagementActions / currentAttendees) * 100
      : 0

    // Update metrics if they've changed
    if (metrics && (
      metrics.current_attendees !== currentAttendees ||
      metrics.total_check_ins !== totalCheckIns
    )) {
      const peakAttendees = Math.max(metrics.peak_attendees || 0, currentAttendees)

      await supabase
        .from('session_metrics')
        .update({
          current_attendees: currentAttendees,
          peak_attendees: peakAttendees,
          total_check_ins: totalCheckIns,
          total_check_outs: totalCheckOuts,
          average_duration_minutes: avgDuration,
          engagement_rate: engagementRate,
          drop_off_rate: dropOffRate,
          last_updated: new Date().toISOString()
        })
        .eq('session_id', sessionId)
    }

    const response = {
      session_id: sessionId,
      session: {
        id: session.id,
        title: session.title,
        starts_at: session.starts_at,
        ends_at: session.ends_at,
        location: session.location,
        event: session.event
      },
      metrics: {
        current_attendees: currentAttendees,
        peak_attendees: Math.max(metrics?.peak_attendees || 0, currentAttendees),
        total_check_ins: totalCheckIns,
        total_check_outs: totalCheckOuts,
        average_duration_minutes: Math.round(avgDuration * 10) / 10,
        engagement_rate: Math.round(engagementRate * 10) / 10,
        drop_off_rate: Math.round(dropOffRate * 10) / 10,
        last_updated: new Date().toISOString()
      },
      engagement: {
        total_messages: chatMessages?.length || 0,
        total_questions: questions?.length || 0,
        total_poll_votes: polls?.reduce((sum: number, p: any) => sum + (p.total_votes || 0), 0) || 0,
        total_actions: totalEngagementActions
      },
      attendance_timeline: allAttendance?.map((a: any) => ({
        user_id: a.user_id,
        checked_in_at: a.checked_in_at,
        checked_out_at: a.checked_out_at,
        duration_minutes: a.duration_minutes
      })) || []
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in session metrics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/sessions/[id]/metrics
 * Manually refresh session metrics
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params

    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Trigger a GET to recalculate metrics
    const url = new URL(request.url)
    const getResponse = await GET(request, { params })
    
    return getResponse

  } catch (error) {
    console.error('Error refreshing session metrics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


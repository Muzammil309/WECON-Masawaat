import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * POST /api/admin/attendance/track
 * Track session attendance (check-in/check-out)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, userId, action } = body

    if (!sessionId || !userId || !action) {
      return NextResponse.json(
        { error: 'Session ID, User ID, and action are required' },
        { status: 400 }
      )
    }

    if (!['check_in', 'check_out'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either check_in or check_out' },
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

    // Verify session exists
    const { data: session, error: sessionError } = await supabase
      .from('em_sessions')
      .select('id, title, event_id')
      .eq('id', sessionId)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (action === 'check_in') {
      // Check if already checked in
      const { data: existing } = await supabase
        .from('session_attendance')
        .select('id, checked_in_at')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .is('checked_out_at', null)
        .single()

      if (existing) {
        return NextResponse.json(
          { 
            error: 'User already checked in to this session',
            checked_in_at: existing.checked_in_at
          },
          { status: 400 }
        )
      }

      // Create attendance record
      const { data: attendance, error: attendanceError } = await supabase
        .from('session_attendance')
        .insert({
          session_id: sessionId,
          user_id: userId,
          checked_in_at: new Date().toISOString(),
          engagement_score: 0
        })
        .select()
        .single()

      if (attendanceError) {
        console.error('Error creating attendance:', attendanceError)
        return NextResponse.json(
          { error: 'Failed to check in' },
          { status: 500 }
        )
      }

      // Update session metrics
      await updateSessionMetrics(supabase, sessionId)

      return NextResponse.json({
        success: true,
        action: 'check_in',
        attendance,
        message: 'Successfully checked in to session'
      })

    } else if (action === 'check_out') {
      // Find active attendance record
      const { data: attendance, error: findError } = await supabase
        .from('session_attendance')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .is('checked_out_at', null)
        .single()

      if (findError || !attendance) {
        return NextResponse.json(
          { error: 'No active check-in found for this session' },
          { status: 404 }
        )
      }

      // Calculate duration
      const checkedInAt = new Date(attendance.checked_in_at)
      const checkedOutAt = new Date()
      const durationMinutes = Math.round((checkedOutAt.getTime() - checkedInAt.getTime()) / 60000)

      // Update attendance record
      const { data: updated, error: updateError } = await supabase
        .from('session_attendance')
        .update({
          checked_out_at: checkedOutAt.toISOString(),
          duration_minutes: durationMinutes,
          updated_at: new Date().toISOString()
        })
        .eq('id', attendance.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating attendance:', updateError)
        return NextResponse.json(
          { error: 'Failed to check out' },
          { status: 500 }
        )
      }

      // Update session metrics
      await updateSessionMetrics(supabase, sessionId)

      return NextResponse.json({
        success: true,
        action: 'check_out',
        attendance: updated,
        duration_minutes: durationMinutes,
        message: 'Successfully checked out of session'
      })
    }

  } catch (error) {
    console.error('Error in attendance tracking API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/attendance/track
 * Get attendance records for a session
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    const userId = searchParams.get('userId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
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

    let query = supabase
      .from('session_attendance')
      .select(`
        *,
        user:em_profiles(id, full_name, email, avatar_url)
      `)
      .eq('session_id', sessionId)
      .order('checked_in_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: attendance, error: attendanceError } = await query

    if (attendanceError) {
      console.error('Error fetching attendance:', attendanceError)
      return NextResponse.json(
        { error: 'Failed to fetch attendance records' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      session_id: sessionId,
      total_records: attendance?.length || 0,
      currently_active: attendance?.filter((a: any) => !a.checked_out_at).length || 0,
      attendance: attendance || []
    })

  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Helper function to update session metrics
 */
async function updateSessionMetrics(supabase: any, sessionId: string) {
  try {
    // Get current attendance
    const { data: currentAttendance } = await supabase
      .from('session_attendance')
      .select('*')
      .eq('session_id', sessionId)
      .is('checked_out_at', null)

    const currentAttendees = currentAttendance?.length || 0

    // Get all attendance
    const { data: allAttendance } = await supabase
      .from('session_attendance')
      .select('*')
      .eq('session_id', sessionId)

    const totalCheckIns = allAttendance?.length || 0
    const totalCheckOuts = allAttendance?.filter((a: any) => a.checked_out_at).length || 0

    // Get existing metrics
    const { data: existingMetrics } = await supabase
      .from('session_metrics')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    const peakAttendees = Math.max(existingMetrics?.peak_attendees || 0, currentAttendees)

    // Calculate average duration
    const completedSessions = allAttendance?.filter((a: any) => a.duration_minutes) || []
    const avgDuration = completedSessions.length > 0
      ? completedSessions.reduce((sum: number, a: any) => sum + (a.duration_minutes || 0), 0) / completedSessions.length
      : 0

    // Calculate drop-off rate
    const dropOffRate = totalCheckIns > 0
      ? ((totalCheckIns - currentAttendees) / totalCheckIns) * 100
      : 0

    // Upsert metrics
    await supabase
      .from('session_metrics')
      .upsert({
        session_id: sessionId,
        current_attendees: currentAttendees,
        peak_attendees: peakAttendees,
        total_check_ins: totalCheckIns,
        total_check_outs: totalCheckOuts,
        average_duration_minutes: avgDuration,
        drop_off_rate: dropOffRate,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'session_id'
      })

  } catch (error) {
    console.error('Error updating session metrics:', error)
  }
}


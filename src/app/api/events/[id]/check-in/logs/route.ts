import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/[id]/check-in/logs - Get recent check-in logs for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📡 GET /api/events/[id]/check-in/logs - Request received')
    const supabase = await createClient()
    const { id: eventId } = await params

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

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

    // Fetch recent check-in logs
    const { data: logs, error: logsError } = await supabase
      .from('check_in_logs')
      .select(`
        id,
        ticket_id,
        checked_in_at,
        check_in_method,
        check_in_stations (
          station_name
        ),
        em_tickets (
          user_id,
          em_profiles (
            full_name,
            email
          ),
          em_ticket_tiers (
            name,
            event_id
          )
        )
      `)
      .order('checked_in_at', { ascending: false })
      .limit(limit)

    if (logsError) {
      console.error('❌ Error fetching check-in logs:', logsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch check-in logs' },
        { status: 500 }
      )
    }

    // Filter logs for the specific event and format the response
    const formattedLogs = logs
      .filter((log: any) => log.em_tickets?.em_ticket_tiers?.event_id === eventId)
      .map((log: any) => ({
        id: log.id,
        ticket_id: log.ticket_id,
        checked_in_at: log.checked_in_at,
        check_in_method: log.check_in_method || 'qr_code',
        station_name: log.check_in_stations?.station_name || 'Unknown',
        attendee_name: log.em_tickets?.em_profiles?.full_name || 'Unknown',
        attendee_email: log.em_tickets?.em_profiles?.email || 'N/A',
        ticket_tier_name: log.em_tickets?.em_ticket_tiers?.name || 'N/A',
      }))

    console.log(`✅ Fetched ${formattedLogs.length} check-in logs`)

    return NextResponse.json({
      success: true,
      data: formattedLogs,
    })
  } catch (error) {
    console.error('❌ GET /api/events/[id]/check-in/logs error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch check-in logs',
      },
      { status: 500 }
    )
  }
}


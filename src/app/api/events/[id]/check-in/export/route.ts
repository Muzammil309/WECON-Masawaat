import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/[id]/check-in/export - Export check-in data as CSV
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('📡 GET /api/events/[id]/check-in/export - Request received')
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

    // Fetch all check-in logs for the event
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
            email,
            phone,
            company,
            job_title
          ),
          em_ticket_tiers (
            name,
            event_id
          )
        )
      `)
      .order('checked_in_at', { ascending: false })

    if (logsError) {
      console.error('❌ Error fetching check-in logs:', logsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch check-in logs' },
        { status: 500 }
      )
    }

    // Filter logs for the specific event
    const eventLogs = logs.filter((log: any) => log.em_tickets?.em_ticket_tiers?.event_id === eventId)

    // Generate CSV
    const csvHeaders = [
      'Ticket ID',
      'Attendee Name',
      'Email',
      'Phone',
      'Company',
      'Job Title',
      'Ticket Type',
      'Check-in Time',
      'Check-in Method',
      'Station',
    ]

    const csvRows = eventLogs.map((log: any) => [
      log.ticket_id,
      log.em_tickets?.em_profiles?.full_name || 'N/A',
      log.em_tickets?.em_profiles?.email || 'N/A',
      log.em_tickets?.em_profiles?.phone || 'N/A',
      log.em_tickets?.em_profiles?.company || 'N/A',
      log.em_tickets?.em_profiles?.job_title || 'N/A',
      log.em_tickets?.em_ticket_tiers?.name || 'N/A',
      new Date(log.checked_in_at).toLocaleString(),
      log.check_in_method || 'qr_code',
      log.check_in_stations?.station_name || 'Unknown',
    ])

    // Create CSV content
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map((row: string[]) => row.map((cell: string) => `"${cell}"`).join(','))
    ].join('\n')

    console.log(`✅ Exported ${eventLogs.length} check-in records`)

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="check-in-data-${eventId}-${new Date().toISOString()}.csv"`,
      },
    })
  } catch (error) {
    console.error('❌ GET /api/events/[id]/check-in/export error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export check-in data',
      },
      { status: 500 }
    )
  }
}


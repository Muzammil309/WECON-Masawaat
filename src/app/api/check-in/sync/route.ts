/**
 * API Route: Sync Offline Check-ins
 * POST /api/check-in/sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidTicketQRFormat } from '@/lib/utils/qr-code'
import type { 
  SyncOfflineCheckInsRequest, 
  SyncOfflineCheckInsResponse,
  OfflineCheckInData 
} from '@/lib/types/check-in'

export async function POST(request: NextRequest) {
  try {
    const body: SyncOfflineCheckInsRequest = await request.json()
    const { station_id, check_ins } = body
    
    // Validate required fields
    if (!station_id || !check_ins || !Array.isArray(check_ins)) {
      return NextResponse.json<SyncOfflineCheckInsResponse>(
        { 
          success: false,
          synced_count: 0,
          failed_count: 0,
          results: []
        },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json<SyncOfflineCheckInsResponse>(
        { 
          success: false,
          synced_count: 0,
          failed_count: 0,
          results: []
        },
        { status: 401 }
      )
    }
    
    // Verify station exists and belongs to user's accessible events
    const { data: station, error: stationError } = await supabase
      .from('check_in_stations')
      .select('id, event_id')
      .eq('id', station_id)
      .single()
    
    if (stationError || !station) {
      return NextResponse.json<SyncOfflineCheckInsResponse>(
        { 
          success: false,
          synced_count: 0,
          failed_count: 0,
          results: []
        },
        { status: 404 }
      )
    }
    
    // Process each check-in
    const results: SyncOfflineCheckInsResponse['results'] = []
    let synced_count = 0
    let failed_count = 0
    
    for (const checkIn of check_ins) {
      try {
        // Validate QR code format
        if (!isValidTicketQRFormat(checkIn.qr_code)) {
          results.push({
            client_timestamp: checkIn.client_timestamp,
            success: false,
            error: 'Invalid QR code format'
          })
          failed_count++
          continue
        }
        
        // Find ticket by QR code
        const { data: ticket, error: ticketError } = await supabase
          .from('em_tickets')
          .select('id, checked_in, checked_in_at')
          .eq('qr_code', checkIn.qr_code)
          .single()
        
        if (ticketError || !ticket) {
          results.push({
            client_timestamp: checkIn.client_timestamp,
            success: false,
            error: 'Ticket not found'
          })
          failed_count++
          continue
        }
        
        // Check if already checked in at an earlier time
        if (ticket.checked_in && ticket.checked_in_at) {
          const existingCheckInTime = new Date(ticket.checked_in_at).getTime()
          const newCheckInTime = new Date(checkIn.client_timestamp).getTime()
          
          // If existing check-in is earlier, skip this one
          if (existingCheckInTime < newCheckInTime) {
            results.push({
              client_timestamp: checkIn.client_timestamp,
              success: true,
              check_in_log_id: '', // Already checked in earlier
              error: 'Ticket already checked in at an earlier time'
            })
            synced_count++
            continue
          }
        }
        
        // Process check-in using database function
        const { data: checkInResult, error: checkInError } = await supabase
          .rpc('process_check_in', {
            p_ticket_id: ticket.id,
            p_station_id: station_id,
            p_checked_in_by: checkIn.checked_in_by || user.id,
            p_check_in_method: checkIn.check_in_method,
            p_is_offline_sync: true
          })
        
        if (checkInError || !checkInResult?.success) {
          results.push({
            client_timestamp: checkIn.client_timestamp,
            success: false,
            error: checkInResult?.error || checkInError?.message || 'Unknown error'
          })
          failed_count++
          continue
        }
        
        // Success
        results.push({
          client_timestamp: checkIn.client_timestamp,
          success: true,
          check_in_log_id: checkInResult.check_in_log_id
        })
        synced_count++
      } catch (error) {
        console.error('Error processing offline check-in:', error)
        results.push({
          client_timestamp: checkIn.client_timestamp,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        failed_count++
      }
    }
    
    // Update station sync status
    await supabase
      .from('check_in_stations')
      .update({
        last_sync_at: new Date().toISOString(),
        pending_sync_count: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', station_id)
    
    return NextResponse.json<SyncOfflineCheckInsResponse>({
      success: true,
      synced_count,
      failed_count,
      results
    })
  } catch (error) {
    console.error('Error syncing offline check-ins:', error)
    return NextResponse.json<SyncOfflineCheckInsResponse>(
      { 
        success: false,
        synced_count: 0,
        failed_count: 0,
        results: []
      },
      { status: 500 }
    )
  }
}

/**
 * GET: Get pending sync count for a station
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const station_id = searchParams.get('station_id')
    
    if (!station_id) {
      return NextResponse.json(
        { error: 'station_id parameter is required' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Get station sync status
    const { data: station, error: stationError } = await supabase
      .from('check_in_stations')
      .select('pending_sync_count, last_sync_at, is_online')
      .eq('id', station_id)
      .single()
    
    if (stationError || !station) {
      return NextResponse.json(
        { error: 'Station not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      station_id,
      pending_sync_count: station.pending_sync_count,
      last_sync_at: station.last_sync_at,
      is_online: station.is_online
    })
  } catch (error) {
    console.error('Error getting sync status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


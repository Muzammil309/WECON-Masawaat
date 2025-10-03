/**
 * API Route: Get Badge Print Queue Status
 * GET /api/badges/queue
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { BadgeQueueStatusResponse, BadgePrintJob } from '@/lib/types/check-in'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const station_id = searchParams.get('station_id')
    const status = searchParams.get('status') // pending, printing, completed, failed
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Build query
    let query = supabase
      .from('badge_print_queue')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit)
    
    if (station_id) {
      query = query.eq('station_id', station_id)
    }
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: queue, error: queueError } = await query
    
    if (queueError) {
      console.error('Error fetching badge queue:', queueError)
      return NextResponse.json(
        { error: 'Failed to fetch badge queue' },
        { status: 500 }
      )
    }
    
    // Get counts by status
    const { data: counts } = await supabase
      .from('badge_print_queue')
      .select('status')

    const total_pending = counts?.filter((c: { status: string }) => c.status === 'pending').length || 0
    const total_printing = counts?.filter((c: { status: string }) => c.status === 'printing').length || 0
    const total_completed = counts?.filter((c: { status: string }) => c.status === 'completed').length || 0
    const total_failed = counts?.filter((c: { status: string }) => c.status === 'failed').length || 0
    
    const response: BadgeQueueStatusResponse = {
      total_pending,
      total_printing,
      total_completed,
      total_failed,
      queue: queue as BadgePrintJob[]
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error getting badge queue status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


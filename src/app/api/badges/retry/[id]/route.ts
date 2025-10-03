/**
 * API Route: Retry Failed Badge Print
 * POST /api/badges/retry/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: badgeJobId } = await params
    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin' && profile?.role !== 'organizer') {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can retry badge prints' },
        { status: 403 }
      )
    }
    
    // Update badge job to retry
    const { data: updatedJob, error: updateError } = await supabase
      .from('badge_print_queue')
      .update({
        status: 'pending',
        retry_count: supabase.rpc('increment', { x: 1 }),
        error_message: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', badgeJobId)
      .select()
      .single()
    
    if (updateError || !updatedJob) {
      console.error('Error retrying badge print:', updateError)
      return NextResponse.json(
        { error: 'Failed to retry badge print' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Badge print job queued for retry',
      badge_job: updatedJob
    })
  } catch (error) {
    console.error('Error retrying badge print:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


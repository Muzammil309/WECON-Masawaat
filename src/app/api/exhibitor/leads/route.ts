/**
 * Leads API Route
 * GET /api/exhibitor/leads - Get all leads with filtering
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { GetLeadsParams, PaginatedResponse, LeadCapture } from '@/lib/types/exhibitor'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const params: GetLeadsParams = {
      booth_id: searchParams.get('booth_id') || undefined,
      interest_level: searchParams.get('interest_level') as any || undefined,
      min_score: searchParams.get('min_score') ? parseInt(searchParams.get('min_score')!) : undefined,
      max_score: searchParams.get('max_score') ? parseInt(searchParams.get('max_score')!) : undefined,
      exported: searchParams.get('exported') === 'true' ? true : searchParams.get('exported') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      sort_by: searchParams.get('sort_by') as any || 'created_at',
      sort_order: searchParams.get('sort_order') as any || 'desc'
    }

    // Build query
    let query = supabase
      .from('lead_captures')
      .select(`
        *,
        attendee:em_profiles!attendee_id (
          id,
          full_name,
          email,
          company,
          job_title,
          phone
        ),
        booth:exhibitor_booths!booth_id (
          id,
          company_name,
          booth_number
        ),
        captured_by_user:em_profiles!captured_by (
          id,
          full_name,
          email
        )
      `, { count: 'exact' })

    // Apply filters
    if (params.booth_id) {
      query = query.eq('booth_id', params.booth_id)
    }

    if (params.interest_level) {
      query = query.eq('interest_level', params.interest_level)
    }

    if (params.min_score !== undefined) {
      query = query.gte('lead_score', params.min_score)
    }

    if (params.max_score !== undefined) {
      query = query.lte('lead_score', params.max_score)
    }

    if (params.exported !== undefined) {
      query = query.eq('exported', params.exported)
    }

    // Search by attendee name or email
    if (params.search) {
      query = query.or(`attendee.full_name.ilike.%${params.search}%,attendee.email.ilike.%${params.search}%`)
    }

    // Apply sorting
    query = query.order(params.sort_by!, { ascending: params.sort_order === 'asc' })

    // Apply pagination
    query = query.range(params.offset!, params.offset! + params.limit! - 1)

    const { data: leads, error: leadsError, count } = await query

    if (leadsError) {
      console.error('Error fetching leads:', leadsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch leads' },
        { status: 500 }
      )
    }

    const response: PaginatedResponse<LeadCapture> = {
      data: leads as any,
      total: count || 0,
      limit: params.limit!,
      offset: params.offset!,
      has_more: (params.offset! + params.limit!) < (count || 0)
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error in get leads:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


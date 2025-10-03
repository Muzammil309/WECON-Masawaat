/**
 * Lead Capture API Route
 * POST /api/exhibitor/leads/capture
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { CaptureLeadRequest, LeadCaptureResponse } from '@/lib/types/exhibitor'

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body: CaptureLeadRequest = await request.json()
    
    // Validate required fields
    if (!body.booth_id || !body.attendee_id) {
      return NextResponse.json(
        { success: false, error: 'booth_id and attendee_id are required' },
        { status: 400 }
      )
    }

    // Check if lead already exists (duplicate detection)
    const { data: existingLead } = await supabase
      .from('lead_captures')
      .select('id, created_at, lead_score, interest_level')
      .eq('booth_id', body.booth_id)
      .eq('attendee_id', body.attendee_id)
      .single()

    if (existingLead) {
      return NextResponse.json<LeadCaptureResponse>(
        {
          success: false,
          error: 'Lead already captured',
          duplicate: true
        },
        { status: 409 }
      )
    }

    // Verify booth exists and user has access
    const { data: booth, error: boothError } = await supabase
      .from('exhibitor_booths')
      .select('id, exhibitor_user_id')
      .eq('id', body.booth_id)
      .single()

    if (boothError || !booth) {
      return NextResponse.json(
        { success: false, error: 'Booth not found' },
        { status: 404 }
      )
    }

    // Verify attendee exists
    const { data: attendee, error: attendeeError } = await supabase
      .from('em_profiles')
      .select('id, full_name, email')
      .eq('id', body.attendee_id)
      .single()

    if (attendeeError || !attendee) {
      return NextResponse.json(
        { success: false, error: 'Attendee not found' },
        { status: 404 }
      )
    }

    // Create lead capture
    const { data: lead, error: leadError } = await supabase
      .from('lead_captures')
      .insert({
        booth_id: body.booth_id,
        attendee_id: body.attendee_id,
        captured_by: user.id,
        capture_method: body.capture_method || 'qr_scan',
        lead_score: body.lead_score || 0,
        interest_level: body.interest_level || null,
        notes: body.notes || null,
        custom_fields: body.custom_fields || null,
        follow_up_required: body.follow_up_required || false
      })
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
      `)
      .single()

    if (leadError) {
      console.error('Error creating lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Failed to capture lead' },
        { status: 500 }
      )
    }

    // Update booth analytics
    await supabase.rpc('increment_booth_lead_count', {
      p_booth_id: body.booth_id,
      p_interest_level: body.interest_level || 'cold',
      p_lead_score: body.lead_score || 0
    })

    return NextResponse.json<LeadCaptureResponse>({
      success: true,
      lead: lead as any
    })

  } catch (error) {
    console.error('Error in lead capture:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


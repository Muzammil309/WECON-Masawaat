/**
 * Individual Lead API Route
 * GET /api/exhibitor/leads/[id] - Get lead details
 * PATCH /api/exhibitor/leads/[id] - Update lead
 * DELETE /api/exhibitor/leads/[id] - Delete lead
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { UpdateLeadRequest, LeadCapture, ApiResponse } from '@/lib/types/exhibitor'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch lead
    const { data: lead, error: leadError } = await supabase
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
      `)
      .eq('id', id)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<LeadCapture>>({
      success: true,
      data: lead as any
    })

  } catch (error) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const body: UpdateLeadRequest = await request.json()

    // Update lead
    const { data: lead, error: updateError } = await supabase
      .from('lead_captures')
      .update({
        lead_score: body.lead_score,
        interest_level: body.interest_level,
        notes: body.notes,
        custom_fields: body.custom_fields,
        follow_up_required: body.follow_up_required,
        exported: body.exported,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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

    if (updateError) {
      console.error('Error updating lead:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update lead' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<LeadCapture>>({
      success: true,
      data: lead as any,
      message: 'Lead updated successfully'
    })

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete lead
    const { error: deleteError } = await supabase
      .from('lead_captures')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting lead:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete lead' },
        { status: 500 }
      )
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Lead deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


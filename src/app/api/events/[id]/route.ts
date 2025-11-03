import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema for event update
const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  location: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  max_attendees: z.number().optional(),
  is_virtual: z.boolean().optional(),
  is_hybrid: z.boolean().optional(),
  timezone: z.string().optional(),
  cover_image_url: z.string().optional(),
  website_url: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
})

// GET /api/events/[id] - Get event details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: event, error } = await supabase
      .from('em_events')
      .select(`
        *,
        organizer:em_profiles!em_events_organizer_id_fkey(
          id,
          full_name,
          email,
          avatar_url,
          company,
          job_title
        ),
        ticket_tiers:em_ticket_tiers(
          id,
          name,
          description,
          price,
          currency,
          quantity_available,
          quantity_sold,
          is_active
        ),
        sessions:em_sessions(
          id,
          title,
          description,
          start_time,
          end_time,
          room,
          track,
          session_type,
          status
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Event not found' },
          { status: 404 }
        )
      }
      throw error
    }

    // Get ticket statistics
    const { data: ticketStats } = await supabase
      .from('em_tickets')
      .select('id, status, checked_in')
      .eq('ticket_tier_id', event.ticket_tiers?.map((t: any) => t.id) || [])

    const stats = {
      total_tickets: ticketStats?.length || 0,
      tickets_sold: ticketStats?.filter((t: any) => t.status === 'confirmed').length || 0,
      checked_in: ticketStats?.filter((t: any) => t.checked_in).length || 0,
    }

    return NextResponse.json({
      success: true,
      data: {
        ...event,
        stats
      }
    })
  } catch (error) {
    console.error('GET /api/events/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch event'
      },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if event exists and user has permission
    const { data: event, error: fetchError } = await supabase
      .from('em_events')
      .select('id, organizer_id')
      .eq('id', id)
      .single()

    if (fetchError || !event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    // Check permission: must be organizer of the event or admin
    if (event.organizer_id !== user.id && profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have permission to update this event' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = updateEventSchema.parse(body)

    // Update event
    const { data: updatedEvent, error: updateError } = await supabase
      .from('em_events')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        organizer:em_profiles!em_events_organizer_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating event:', updateError)
      throw updateError
    }

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    })
  } catch (error) {
    console.error('PUT /api/events/[id] error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update event'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if event exists and user has permission
    const { data: event, error: fetchError } = await supabase
      .from('em_events')
      .select('id, organizer_id')
      .eq('id', id)
      .single()

    if (fetchError || !event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      )
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    // Check permission: must be organizer of the event or admin
    if (event.organizer_id !== user.id && profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not have permission to delete this event' },
        { status: 403 }
      )
    }

    // Delete event (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('em_events')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting event:', deleteError)
      throw deleteError
    }

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('DELETE /api/events/[id] error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete event'
      },
      { status: 500 }
    )
  }
}


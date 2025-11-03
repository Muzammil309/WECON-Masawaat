import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema for event creation
const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  location: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  max_attendees: z.number().optional(),
  is_virtual: z.boolean().default(false),
  is_hybrid: z.boolean().default(false),
  timezone: z.string().default('UTC'),
  cover_image_url: z.string().optional(),
  website_url: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
})

// GET /api/events - List all events
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sortBy = searchParams.get('sortBy') || 'start_date'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query
    let query = supabase
      .from('em_events')
      .select(`
        *,
        organizer:em_profiles!em_events_organizer_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `, { count: 'exact' })

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: events, error, count } = await query

    if (error) {
      console.error('Error fetching events:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: events,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch events'
      },
      { status: 500 }
    )
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('em_profiles')
      .select('id, role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'organizer'].includes(profile.role)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Only admins and organizers can create events' },
        { status: 403 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createEventSchema.parse(body)

    // Create event
    const { data: event, error } = await supabase
      .from('em_events')
      .insert({
        ...validatedData,
        organizer_id: user.id,
      })
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

    if (error) {
      console.error('Error creating event:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/events error:', error)
    
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
        error: error instanceof Error ? error.message : 'Failed to create event'
      },
      { status: 500 }
    )
  }
}


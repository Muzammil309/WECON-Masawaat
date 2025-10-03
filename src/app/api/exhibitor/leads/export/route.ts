/**
 * Lead Export API Route
 * POST /api/exhibitor/leads/export
 * Export leads to CSV, HubSpot, or Salesforce
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import type { ExportLeadsRequest, ExportLeadsResponse, LeadCapture } from '@/lib/types/exhibitor'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json<ExportLeadsResponse>(
        { success: false, format: 'csv', export_count: 0, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: ExportLeadsRequest = await request.json()

    if (!body.booth_id || !body.format) {
      return NextResponse.json<ExportLeadsResponse>(
        { success: false, format: body.format || 'csv', export_count: 0, error: 'booth_id and format are required' },
        { status: 400 }
      )
    }

    // Build query for leads
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
        )
      `)
      .eq('booth_id', body.booth_id)

    // Apply filters
    if (body.filters) {
      if (body.filters.interest_level) {
        query = query.eq('interest_level', body.filters.interest_level)
      }
      if (body.filters.min_score !== undefined) {
        query = query.gte('lead_score', body.filters.min_score)
      }
      if (body.filters.max_score !== undefined) {
        query = query.lte('lead_score', body.filters.max_score)
      }
      if (body.filters.date_from) {
        query = query.gte('created_at', body.filters.date_from)
      }
      if (body.filters.date_to) {
        query = query.lte('created_at', body.filters.date_to)
      }
      if (body.filters.exported !== undefined) {
        query = query.eq('exported', body.filters.exported)
      }
    }

    const { data: leads, error: leadsError } = await query

    if (leadsError) {
      console.error('Error fetching leads for export:', leadsError)
      return NextResponse.json<ExportLeadsResponse>(
        { success: false, format: body.format, export_count: 0, error: 'Failed to fetch leads' },
        { status: 500 }
      )
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json<ExportLeadsResponse>(
        { success: false, format: body.format, export_count: 0, error: 'No leads found to export' },
        { status: 404 }
      )
    }

    // Handle different export formats
    switch (body.format) {
      case 'csv':
        return await exportToCSV(leads as any, body.include_fields)
      
      case 'hubspot':
        return await exportToHubSpot(leads as any, supabase)
      
      case 'salesforce':
        return await exportToSalesforce(leads as any, supabase)
      
      default:
        return NextResponse.json<ExportLeadsResponse>(
          { success: false, format: body.format, export_count: 0, error: 'Invalid export format' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error exporting leads:', error)
    return NextResponse.json<ExportLeadsResponse>(
      { success: false, format: 'csv', export_count: 0, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export to CSV
async function exportToCSV(leads: LeadCapture[], includeFields?: string[]) {
  const defaultFields = [
    'attendee_name',
    'attendee_email',
    'attendee_company',
    'attendee_job_title',
    'attendee_phone',
    'lead_score',
    'interest_level',
    'notes',
    'captured_at'
  ]

  const fields = includeFields || defaultFields

  // Create CSV header
  const header = fields.join(',')

  // Create CSV rows
  const rows = leads.map(lead => {
    const attendee = Array.isArray(lead.attendee) ? lead.attendee[0] : lead.attendee
    return fields.map(field => {
      switch (field) {
        case 'attendee_name':
          return `"${attendee?.full_name || ''}"`
        case 'attendee_email':
          return `"${attendee?.email || ''}"`
        case 'attendee_company':
          return `"${attendee?.company || ''}"`
        case 'attendee_job_title':
          return `"${attendee?.job_title || ''}"`
        case 'attendee_phone':
          return `"${attendee?.phone || ''}"`
        case 'lead_score':
          return lead.lead_score
        case 'interest_level':
          return `"${lead.interest_level || ''}"`
        case 'notes':
          return `"${(lead.notes || '').replace(/"/g, '""')}"`
        case 'captured_at':
          return `"${new Date(lead.created_at).toISOString()}"`
        default:
          return '""'
      }
    }).join(',')
  })

  const csv = [header, ...rows].join('\n')

  // Return CSV as downloadable file
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="leads-export-${Date.now()}.csv"`
    }
  })
}

// Export to HubSpot (placeholder - requires HubSpot API integration)
async function exportToHubSpot(leads: LeadCapture[], supabase: any) {
  // TODO: Implement HubSpot API integration
  // This would require HubSpot API key and contact creation endpoint
  
  return NextResponse.json<ExportLeadsResponse>({
    success: false,
    format: 'hubspot',
    export_count: 0,
    error: 'HubSpot integration not yet implemented'
  }, { status: 501 })
}

// Export to Salesforce (placeholder - requires Salesforce API integration)
async function exportToSalesforce(leads: LeadCapture[], supabase: any) {
  // TODO: Implement Salesforce API integration
  // This would require Salesforce OAuth and Lead creation endpoint
  
  return NextResponse.json<ExportLeadsResponse>({
    success: false,
    format: 'salesforce',
    export_count: 0,
    error: 'Salesforce integration not yet implemented'
  }, { status: 501 })
}


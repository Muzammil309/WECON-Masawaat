import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ValidateDiscountRequest, ValidateDiscountResponse } from '@/types/ticketing'

/**
 * POST /api/discount/validate
 * Validates a discount code and calculates the discount amount
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: ValidateDiscountRequest = await request.json()
    const { code, ticket_type_id, subtotal } = body

    if (!code || !ticket_type_id || subtotal === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: code, ticket_type_id, subtotal' },
        { status: 400 }
      )
    }

    // Call the database function to validate discount code
    const { data, error } = await supabase.rpc('validate_discount_code', {
      p_code: code,
      p_user_id: user.id,
      p_ticket_type_id: ticket_type_id,
      p_subtotal: subtotal,
    })

    if (error) {
      console.error('Error validating discount code:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // The function returns a single row
    const result = Array.isArray(data) ? data[0] : data

    const response: ValidateDiscountResponse = {
      is_valid: result.is_valid,
      discount_id: result.discount_id,
      discount_amount: result.discount_amount,
      error_message: result.error_message,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    console.error('Error in discount validation:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


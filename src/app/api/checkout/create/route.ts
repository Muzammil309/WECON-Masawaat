import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import type { CreateCheckoutRequest, CreateCheckoutResponse, StripeCheckoutMetadata } from '@/types/ticketing'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

/**
 * POST /api/checkout/create
 * Creates a Stripe checkout session for ticket purchase
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

    const body: CreateCheckoutRequest = await request.json()
    const { event_id, ticket_type_id, quantity, discount_code, seat_ids, metadata } = body

    // Validate required fields
    if (!event_id || !ticket_type_id || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields' },
        { status: 400 }
      )
    }

    // Get ticket type
    const { data: ticketType, error: ticketTypeError } = await supabase
      .from('em_ticket_types')
      .select('*')
      .eq('id', ticket_type_id)
      .eq('is_active', true)
      .single()

    if (ticketTypeError || !ticketType) {
      return NextResponse.json(
        { error: 'Invalid ticket type' },
        { status: 400 }
      )
    }

    // Check availability
    if (ticketType.available_quantity < quantity) {
      return NextResponse.json(
        { error: 'Not enough tickets available' },
        { status: 400 }
      )
    }

    // Check quantity limits
    if (quantity < ticketType.min_purchase || quantity > ticketType.max_purchase) {
      return NextResponse.json(
        { error: `Quantity must be between ${ticketType.min_purchase} and ${ticketType.max_purchase}` },
        { status: 400 }
      )
    }

    // Check validity period
    const now = new Date()
    if (ticketType.valid_from && new Date(ticketType.valid_from) > now) {
      return NextResponse.json(
        { error: 'Ticket sales have not started yet' },
        { status: 400 }
      )
    }
    if (ticketType.valid_until && new Date(ticketType.valid_until) < now) {
      return NextResponse.json(
        { error: 'Ticket sales have ended' },
        { status: 400 }
      )
    }

    // Calculate subtotal
    let subtotal = ticketType.price * quantity

    // Apply ticket type discount if any
    if (ticketType.discount_percentage > 0) {
      subtotal -= subtotal * (ticketType.discount_percentage / 100)
    } else if (ticketType.discount_amount > 0) {
      subtotal -= ticketType.discount_amount * quantity
    }

    // Validate and apply discount code
    let discountAmount = 0
    let discountCodeId: string | null = null

    if (discount_code) {
      const { data: discountValidation } = await supabase.rpc('validate_discount_code', {
        p_code: discount_code,
        p_user_id: user.id,
        p_ticket_type_id: ticket_type_id,
        p_subtotal: subtotal,
      })

      const validation = Array.isArray(discountValidation) ? discountValidation[0] : discountValidation

      if (validation?.is_valid) {
        discountAmount = validation.discount_amount
        discountCodeId = validation.discount_id
        subtotal -= discountAmount
      }
    }

    // Calculate tax (example: 10% - adjust based on your requirements)
    const taxRate = 0.10
    const taxAmount = subtotal * taxRate
    const totalAmount = subtotal + taxAmount

    // Ensure total is not negative
    if (totalAmount < 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      )
    }

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('em_orders')
      .insert({
        user_id: user.id,
        event_id,
        ticket_type_id,
        discount_code_id: discountCodeId,
        subtotal: ticketType.price * quantity,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        currency: ticketType.currency,
        payment_status: 'pending',
        status: 'pending',
        metadata: {
          quantity,
          seat_ids,
          ...metadata,
        },
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Get event details for checkout
    const { data: event } = await supabase
      .from('em_events')
      .select('name, description')
      .eq('id', event_id)
      .single()

    // Create Stripe checkout session
    const checkoutMetadata: StripeCheckoutMetadata = {
      user_id: user.id,
      event_id,
      ticket_type_id,
      quantity: quantity.toString(),
      discount_code_id: discountCodeId || undefined,
      seat_ids: seat_ids?.join(','),
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: ticketType.currency.toLowerCase(),
            product_data: {
              name: `${event?.name || 'Event'} - ${ticketType.name}`,
              description: ticketType.description || undefined,
              metadata: {
                event_id,
                ticket_type_id,
              },
            },
            unit_amount: Math.round(totalAmount * 100 / quantity), // Convert to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event_id}?canceled=true`,
      client_reference_id: order.id,
      customer_email: user.email,
      metadata: checkoutMetadata as any,
    })

    // Update order with Stripe session ID
    await supabase
      .from('em_orders')
      .update({
        stripe_session_id: session.id,
        payment_status: 'processing',
      })
      .eq('id', order.id)

    const response: CreateCheckoutResponse = {
      checkout_url: session.url!,
      session_id: session.id,
      order_id: order.id,
    }

    return NextResponse.json(response, { status: 200 })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}


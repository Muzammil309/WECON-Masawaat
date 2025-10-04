import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  })
}

const getSupabaseAdmin = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase environment variables are not set')
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events for payment processing
 */
export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })

  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id)

  const supabaseAdmin = getSupabaseAdmin()
  const orderId = session.client_reference_id
  if (!orderId) {
    console.error('No order ID in checkout session')
    return
  }

  const metadata = session.metadata as any
  const quantity = parseInt(metadata?.quantity || '1')

  // Update order status
  const { data: order, error: orderError } = await supabaseAdmin
    .from('em_orders')
    .update({
      payment_status: 'succeeded',
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent as string,
      payment_method: 'card',
    })
    .eq('id', orderId)
    .select()
    .single()

  if (orderError) {
    console.error('Error updating order:', orderError)
    return
  }

  // Generate tickets
  const tickets = []
  for (let i = 0; i < quantity; i++) {
    const qrCode = generateQRCode()
    const qrCodeData = await generateQRCodeData(orderId, i)
    
    tickets.push({
      order_id: orderId,
      ticket_type_id: metadata?.ticket_type_id,
      price_paid: order.total_amount / quantity,
      currency: order.currency,
      qr_code: qrCode,
      qr_code_data: qrCodeData,
      qr_code_expires_at: null, // No expiration for event tickets
      status: 'active',
      checked_in: false,
      metadata: {
        stripe_session_id: session.id,
        created_from_webhook: true,
      },
    })
  }

  const { error: ticketsError } = await supabaseAdmin
    .from('em_tickets')
    .insert(tickets)

  if (ticketsError) {
    console.error('Error creating tickets:', ticketsError)
    return
  }

  // Record discount code usage if applicable
  if (metadata?.discount_code_id) {
    await supabaseAdmin.from('em_discount_code_usage').insert({
      discount_code_id: metadata.discount_code_id,
      user_id: metadata.user_id,
      order_id: orderId,
      discount_amount: order.discount_amount,
    })

    // Increment discount code usage count
    await supabaseAdmin.rpc('increment', {
      table_name: 'em_discount_codes',
      row_id: metadata.discount_code_id,
      column_name: 'current_uses',
    })
  }

  // Award points for event registration
  await supabaseAdmin.from('em_points').insert({
    user_id: metadata.user_id,
    event_id: metadata.event_id,
    activity_type: 'event_registration',
    points: 20,
    metadata: {
      order_id: orderId,
      ticket_count: quantity,
    },
  })

  console.log(`Successfully created ${quantity} tickets for order ${orderId}`)
}

/**
 * Handle successful payment intent
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.succeeded:', paymentIntent.id)

  const supabaseAdmin = getSupabaseAdmin()
  // Update order payment status
  await supabaseAdmin
    .from('em_orders')
    .update({
      payment_status: 'succeeded',
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment_intent.payment_failed:', paymentIntent.id)

  const supabaseAdmin = getSupabaseAdmin()
  // Update order payment status
  await supabaseAdmin
    .from('em_orders')
    .update({
      payment_status: 'failed',
      status: 'failed',
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

/**
 * Handle charge refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log('Processing charge.refunded:', charge.id)

  const supabaseAdmin = getSupabaseAdmin()
  const paymentIntentId = charge.payment_intent as string

  // Update order status
  const { data: order } = await supabaseAdmin
    .from('em_orders')
    .update({
      payment_status: 'refunded',
      status: 'refunded',
    })
    .eq('stripe_payment_intent_id', paymentIntentId)
    .select()
    .single()

  if (order) {
    // Cancel all tickets for this order
    await supabaseAdmin
      .from('em_tickets')
      .update({
        status: 'cancelled',
      })
      .eq('order_id', order.id)
  }
}

/**
 * Generate a unique QR code
 */
function generateQRCode(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `TKT-${timestamp}-${random}`.toUpperCase()
}

/**
 * Generate QR code data (encrypted/hashed)
 */
async function generateQRCodeData(orderId: string, index: number): Promise<string> {
  const data = `${orderId}-${index}-${Date.now()}`
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}


'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { CreditCard, Lock, Ticket } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface TicketTier {
  id: string
  name: string
  price: number
  event_id: string
  sold: number
}

interface CheckoutFormProps {
  ticketTier: TicketTier
  quantity: number
  onSuccess?: (orderId: string) => void
  onCancel?: () => void
}

export function CheckoutForm({ ticketTier, quantity, onSuccess, onCancel }: CheckoutFormProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const totalAmount = ticketTier.price * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be signed in to purchase tickets')
      return
    }

    setIsLoading(true)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('em_orders')
        .insert({
          user_id: user.id,
          event_id: ticketTier.event_id,
          total_amount: totalAmount,
          status: totalAmount === 0 ? 'completed' : 'pending',
        })
        .select()
        .single()

      if (orderError) {
        toast.error('Failed to create order: ' + orderError.message)
        return
      }

      // Create tickets
      const tickets = Array.from({ length: quantity }, () => ({
        order_id: order.id,
        ticket_tier_id: ticketTier.id,
        user_id: user.id,
        qr_code: uuidv4(),
      }))

      const { error: ticketsError } = await supabase
        .from('em_tickets')
        .insert(tickets)

      if (ticketsError) {
        toast.error('Failed to create tickets: ' + ticketsError.message)
        return
      }

      // Update sold count
      const { error: updateError } = await supabase
        .from('em_ticket_tiers')
        .update({ sold: ticketTier.sold + quantity })
        .eq('id', ticketTier.id)

      if (updateError) {
        console.error('Failed to update sold count:', updateError)
      }

      if (totalAmount === 0) {
        toast.success('Free tickets claimed successfully!')
        onSuccess?.(order.id)
      } else {
        // For paid tickets, we would integrate with Stripe here
        toast.success('Order created! Redirecting to payment...')
        // TODO: Integrate with Stripe for payment processing
        onSuccess?.(order.id)
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please sign in to purchase tickets.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Checkout
        </CardTitle>
        <CardDescription>
          Complete your ticket purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{ticketTier.name}</span>
                <span>${ticketTier.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{quantity}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {totalAmount > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment Information
              </h3>
              
              <div className="p-4 bg-muted rounded-lg text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Stripe payment integration will be implemented here.
                  For now, this is a demo checkout.
                </p>
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={user.user_metadata?.full_name || ''}
                disabled
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading 
                ? 'Processing...' 
                : totalAmount === 0 
                  ? 'Claim Free Tickets' 
                  : `Pay $${totalAmount.toFixed(2)}`
              }
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

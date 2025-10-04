'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  Check, 
  Loader2, 
  Minus, 
  Plus, 
  Tag, 
  Calendar,
  Users,
  Sparkles,
  CreditCard
} from 'lucide-react'
import type { TicketType, ValidateDiscountResponse } from '@/types/ticketing'
import { TICKET_TYPE_LABELS, TICKET_TYPE_COLORS } from '@/types/ticketing'
import { format } from 'date-fns'

interface TicketSelectionProps {
  eventId: string
  onCheckout: (ticketTypeId: string, quantity: number, discountCode?: string) => void
}

export function TicketSelection({ eventId, onCheckout }: TicketSelectionProps) {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([])
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [discountCode, setDiscountCode] = useState('')
  const [discountValidation, setDiscountValidation] = useState<ValidateDiscountResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [validatingDiscount, setValidatingDiscount] = useState(false)
  const [processingCheckout, setProcessingCheckout] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTicketTypes()
  }, [eventId])

  const loadTicketTypes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('em_ticket_types')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_active', true)
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      setTicketTypes(data || [])
    } catch (error: any) {
      console.error('Error loading ticket types:', error)
      toast.error('Failed to load ticket types')
    } finally {
      setLoading(false)
    }
  }

  const handleValidateDiscount = async () => {
    if (!discountCode || !selectedTicketType) return

    const selectedType = ticketTypes.find(t => t.id === selectedTicketType)
    if (!selectedType) return

    const subtotal = calculateSubtotal(selectedType, quantity)

    try {
      setValidatingDiscount(true)
      const response = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode,
          ticket_type_id: selectedTicketType,
          subtotal,
        }),
      })

      const data: ValidateDiscountResponse = await response.json()
      setDiscountValidation(data)

      if (data.is_valid) {
        toast.success(`Discount applied: $${data.discount_amount?.toFixed(2)}`)
      } else {
        toast.error(data.error_message || 'Invalid discount code')
      }
    } catch (error) {
      console.error('Error validating discount:', error)
      toast.error('Failed to validate discount code')
    } finally {
      setValidatingDiscount(false)
    }
  }

  const calculateSubtotal = (ticketType: TicketType, qty: number): number => {
    let price = ticketType.price * qty
    
    if (ticketType.discount_percentage > 0) {
      price -= price * (ticketType.discount_percentage / 100)
    } else if (ticketType.discount_amount > 0) {
      price -= ticketType.discount_amount * qty
    }
    
    return price
  }

  const calculateTotal = (): number => {
    const selectedType = ticketTypes.find(t => t.id === selectedTicketType)
    if (!selectedType) return 0

    let subtotal = calculateSubtotal(selectedType, quantity)
    
    if (discountValidation?.is_valid && discountValidation.discount_amount) {
      subtotal -= discountValidation.discount_amount
    }

    const tax = subtotal * 0.10 // 10% tax
    return subtotal + tax
  }

  const handleCheckout = async () => {
    if (!selectedTicketType) {
      toast.error('Please select a ticket type')
      return
    }

    try {
      setProcessingCheckout(true)
      await onCheckout(
        selectedTicketType,
        quantity,
        discountValidation?.is_valid ? discountCode : undefined
      )
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Failed to process checkout')
    } finally {
      setProcessingCheckout(false)
    }
  }

  const isTicketAvailable = (ticketType: TicketType): boolean => {
    const now = new Date()
    if (ticketType.valid_from && new Date(ticketType.valid_from) > now) return false
    if (ticketType.valid_until && new Date(ticketType.valid_until) < now) return false
    if (ticketType.available_quantity < 1) return false
    return true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const selectedType = ticketTypes.find(t => t.id === selectedTicketType)

  return (
    <div className="space-y-6">
      {/* Ticket Types Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ticketTypes.map((ticketType) => {
          const isAvailable = isTicketAvailable(ticketType)
          const isSelected = selectedTicketType === ticketType.id

          return (
            <Card
              key={ticketType.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
              } ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isAvailable && setSelectedTicketType(ticketType.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {ticketType.name}
                      {isSelected && <Check className="h-5 w-5 text-blue-500" />}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {ticketType.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={`bg-${TICKET_TYPE_COLORS[ticketType.type as keyof typeof TICKET_TYPE_COLORS]}-100`}>
                    {TICKET_TYPE_LABELS[ticketType.type as keyof typeof TICKET_TYPE_LABELS]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      ${ticketType.price.toFixed(2)}
                    </span>
                    <span className="text-gray-500">{ticketType.currency}</span>
                  </div>

                  {/* Discount */}
                  {(ticketType.discount_percentage > 0 || ticketType.discount_amount > 0) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Tag className="h-3 w-3 mr-1" />
                      {ticketType.discount_percentage > 0
                        ? `${ticketType.discount_percentage}% OFF`
                        : `$${ticketType.discount_amount} OFF`}
                    </Badge>
                  )}

                  {/* Features */}
                  {ticketType.features && ticketType.features.length > 0 && (
                    <ul className="space-y-1 text-sm text-gray-600">
                      {ticketType.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Availability */}
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {ticketType.available_quantity} / {ticketType.total_quantity} available
                    </span>
                  </div>

                  {/* Validity */}
                  {ticketType.valid_until && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        Valid until {format(new Date(ticketType.valid_until), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Checkout Section */}
      {selectedType && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <CardDescription>
              Review your selection and proceed to checkout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(selectedType.min_purchase, quantity - 1))}
                  disabled={quantity <= selectedType.min_purchase}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(selectedType.max_purchase, quantity + 1))}
                  disabled={quantity >= selectedType.max_purchase || quantity >= selectedType.available_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  (Min: {selectedType.min_purchase}, Max: {selectedType.max_purchase})
                </span>
              </div>
            </div>

            {/* Discount Code */}
            <div className="space-y-2">
              <Label htmlFor="discount-code">Discount Code (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="discount-code"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase())
                    setDiscountValidation(null)
                  }}
                  placeholder="Enter code"
                  className="uppercase"
                />
                <Button
                  variant="outline"
                  onClick={handleValidateDiscount}
                  disabled={!discountCode || validatingDiscount}
                >
                  {validatingDiscount ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </Button>
              </div>
              {discountValidation?.is_valid && (
                <p className="text-sm text-green-600">
                  ✓ Discount applied: ${discountValidation.discount_amount?.toFixed(2)}
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({quantity} tickets)</span>
                <span>${calculateSubtotal(selectedType, quantity).toFixed(2)}</span>
              </div>
              {discountValidation?.is_valid && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${discountValidation.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span>
                <span>${(calculateTotal() - (calculateSubtotal(selectedType, quantity) - (discountValidation?.discount_amount || 0))).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={processingCheckout}
            >
              {processingCheckout ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Checkout
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


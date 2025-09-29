import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Ticket, DollarSign, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface TicketTier {
  id: string
  name: string
  description: string | null
  price: number
  quantity: number
  sold: number
  sale_start: string | null
  sale_end: string | null
}

interface TicketTierCardProps {
  ticketTier: TicketTier
  onPurchase?: (tierId: string) => void
  showPurchaseButton?: boolean
}

export function TicketTierCard({ ticketTier, onPurchase, showPurchaseButton = true }: TicketTierCardProps) {
  const soldPercentage = (ticketTier.sold / ticketTier.quantity) * 100
  const isAvailable = ticketTier.sold < ticketTier.quantity
  const isSaleActive = checkSaleActive(ticketTier.sale_start, ticketTier.sale_end)
  
  function checkSaleActive(saleStart: string | null, saleEnd: string | null): boolean {
    const now = new Date()
    
    if (saleStart && new Date(saleStart) > now) {
      return false // Sale hasn't started yet
    }
    
    if (saleEnd && new Date(saleEnd) < now) {
      return false // Sale has ended
    }
    
    return true // Sale is active
  }

  const getAvailabilityStatus = () => {
    if (!isAvailable) return { text: 'Sold Out', color: 'bg-red-100 text-red-800' }
    if (!isSaleActive && ticketTier.sale_start && new Date(ticketTier.sale_start) > new Date()) {
      return { text: 'Coming Soon', color: 'bg-blue-100 text-blue-800' }
    }
    if (!isSaleActive && ticketTier.sale_end && new Date(ticketTier.sale_end) < new Date()) {
      return { text: 'Sale Ended', color: 'bg-gray-100 text-gray-800' }
    }
    return { text: 'Available', color: 'bg-green-100 text-green-800' }
  }

  const status = getAvailabilityStatus()

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {ticketTier.name}
            </CardTitle>
            {ticketTier.description && (
              <CardDescription>{ticketTier.description}</CardDescription>
            )}
          </div>
          <Badge className={status.color}>
            {status.text}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold">
            {ticketTier.price === 0 ? 'Free' : `$${ticketTier.price.toFixed(2)}`}
          </span>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Availability
            </span>
            <span className="text-muted-foreground">
              {ticketTier.quantity - ticketTier.sold} of {ticketTier.quantity} left
            </span>
          </div>
          <Progress value={soldPercentage} className="h-2" />
        </div>

        {/* Sale Period */}
        {(ticketTier.sale_start || ticketTier.sale_end) && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Sale Period
            </div>
            <div className="space-y-1">
              {ticketTier.sale_start && (
                <div>
                  <span className="font-medium">Starts:</span>{' '}
                  {format(new Date(ticketTier.sale_start), 'PPp')}
                </div>
              )}
              {ticketTier.sale_end && (
                <div>
                  <span className="font-medium">Ends:</span>{' '}
                  {format(new Date(ticketTier.sale_end), 'PPp')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Purchase Button */}
        {showPurchaseButton && (
          <Button
            className="w-full"
            disabled={!isAvailable || !isSaleActive}
            onClick={() => onPurchase?.(ticketTier.id)}
          >
            {!isAvailable 
              ? 'Sold Out' 
              : !isSaleActive 
                ? 'Not Available' 
                : ticketTier.price === 0 
                  ? 'Get Free Ticket' 
                  : 'Purchase Ticket'
            }
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

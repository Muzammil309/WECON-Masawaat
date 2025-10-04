'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  XCircle,
  Download,
  Loader2
} from 'lucide-react'
import type { EnhancedTicket } from '@/types/ticketing'
import { format } from 'date-fns'
import QRCode from 'qrcode'

interface MyTicketsProps {
  userId: string
}

export function MyTickets({ userId }: MyTicketsProps) {
  const [tickets, setTickets] = useState<EnhancedTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})
  const supabase = createClient()

  useEffect(() => {
    loadTickets()
  }, [userId])

  const loadTickets = async () => {
    try {
      setLoading(true)

      // Get user's orders
      const { data: orders, error: ordersError } = await supabase
        .from('em_orders')
        .select('id')
        .eq('user_id', userId)
        .eq('payment_status', 'succeeded')

      if (ordersError) throw ordersError

      const orderIds = orders?.map(o => o.id) || []

      if (orderIds.length === 0) {
        setTickets([])
        return
      }

      // Get tickets for these orders
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('em_tickets')
        .select(`
          *,
          ticket_type:em_ticket_types(*),
          order:em_orders(
            *,
            event:em_events(*)
          )
        `)
        .in('order_id', orderIds)
        .order('created_at', { ascending: false })

      if (ticketsError) throw ticketsError

      setTickets(ticketsData || [])

      // Generate QR codes for each ticket
      const qrCodesMap: Record<string, string> = {}
      for (const ticket of ticketsData || []) {
        if (ticket.qr_code) {
          try {
            const qrDataUrl = await QRCode.toDataURL(ticket.qr_code, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF',
              },
            })
            qrCodesMap[ticket.id] = qrDataUrl
          } catch (error) {
            console.error('Error generating QR code:', error)
          }
        }
      }
      setQrCodes(qrCodesMap)

    } catch (error: any) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadTicket = async (ticket: EnhancedTicket) => {
    const qrDataUrl = qrCodes[ticket.id]
    if (!qrDataUrl) return

    // Create a simple ticket PDF/image (simplified version)
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `ticket-${ticket.qr_code}.png`
    link.click()
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Ticket className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Tickets Yet
          </h3>
          <p className="text-gray-600 max-w-md">
            You haven't purchased any tickets yet. Browse events and get your tickets!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const event = (ticket.order as any)?.event
        const isCheckedIn = ticket.checked_in
        const isCancelled = ticket.status === 'cancelled'
        const isExpired = ticket.status === 'expired'

        return (
          <Card key={ticket.id} className={isCancelled || isExpired ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {event?.name || 'Event'}
                    {isCheckedIn && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Checked In
                      </Badge>
                    )}
                    {isCancelled && (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancelled
                      </Badge>
                    )}
                    {isExpired && (
                      <Badge variant="secondary">
                        Expired
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {ticket.ticket_type?.name || 'General Admission'}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-lg font-bold">
                  ${ticket.price_paid?.toFixed(2) || '0.00'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-[1fr,auto]">
                {/* Ticket Details */}
                <div className="space-y-4">
                  {/* Event Info */}
                  <div className="space-y-2">
                    {event?.start_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(event.start_date), 'EEEE, MMMM d, yyyy • h:mm a')}
                        </span>
                      </div>
                    )}
                    {event?.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Ticket Code */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500">Ticket Code</p>
                    <p className="font-mono text-sm font-bold">{ticket.qr_code}</p>
                  </div>

                  {/* Check-in Info */}
                  {isCheckedIn && ticket.checked_in_at && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-900">
                        Checked in on {format(new Date(ticket.checked_in_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                      {ticket.check_in_location && (
                        <p className="text-xs text-green-700 mt-1">
                          Location: {ticket.check_in_location}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  {ticket.ticket_type?.features && ticket.ticket_type.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">Includes</p>
                      <div className="flex flex-wrap gap-2">
                        {ticket.ticket_type.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Download Button */}
                  {!isCancelled && !isExpired && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTicket(ticket)}
                      disabled={!qrCodes[ticket.id]}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Ticket
                    </Button>
                  )}
                </div>

                {/* QR Code */}
                {!isCancelled && !isExpired && qrCodes[ticket.id] && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <img
                        src={qrCodes[ticket.id]}
                        alt="Ticket QR Code"
                        className="w-48 h-48"
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Scan at venue entrance
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}


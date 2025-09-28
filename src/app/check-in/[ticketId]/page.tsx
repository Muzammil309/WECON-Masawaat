'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, User, Calendar, MapPin, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface TicketInfo {
  id: string
  qr_code: string
  checked_in: boolean
  checked_in_at: string | null
  user_id: string
  ticket_tier: {
    name: string
    price: number
  }
  order: {
    event: {
      id: string
      title: string
      start_date: string
      location: string | null
      organizer_id: string
    }
  }
  profile: {
    full_name: string | null
    email: string
  }
}

export default function CheckInPage() {
  const params = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState<TicketInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    const fetchTicketInfo = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('em_tickets')
        .select(`
          *,
          ticket_tier:em_ticket_tiers(name, price),
          order:em_orders(
            event:em_events(id, title, start_date, location, organizer_id)
          ),
          profile:em_profiles(full_name, email)
        `)
        .eq('qr_code', ticketId)
        .single()

      if (error) {
        console.error('Error fetching ticket:', error)
        toast.error('Ticket not found')
      } else {
        setTicket(data)
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
      toast.error('Failed to load ticket information')
    } finally {
      setLoading(false)
    }
    }

    if (params.ticketId) {
      fetchTicketInfo(params.ticketId as string)
    }
  }, [params.ticketId])

  const handleCheckIn = async () => {
    if (!ticket || !user) return

    setChecking(true)

    try {
      const { error } = await supabase
        .from('em_tickets')
        .update({
          checked_in: true,
          checked_in_at: new Date().toISOString(),
        })
        .eq('id', ticket.id)

      if (error) {
        toast.error('Failed to check in: ' + error.message)
      } else {
        toast.success('Successfully checked in!')
        setTicket(prev => prev ? {
          ...prev,
          checked_in: true,
          checked_in_at: new Date().toISOString()
        } : null)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Invalid Ticket
            </CardTitle>
            <CardDescription>
              This ticket could not be found or is invalid.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const isOrganizer = user?.id === ticket.order.event.organizer_id
  const canCheckIn = isOrganizer && !ticket.checked_in

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      {/* Ticket Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {ticket.checked_in ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600">Checked In</span>
              </>
            ) : (
              <>
                <Ticket className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600">Valid Ticket</span>
              </>
            )}
          </CardTitle>
          {ticket.checked_in && ticket.checked_in_at && (
            <CardDescription>
              Checked in on {format(new Date(ticket.checked_in_at), 'PPp')}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {/* Event Information */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{ticket.order.event.title}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(ticket.order.event.start_date), 'PPP')}
              </p>
            </div>
          </div>

          {ticket.order.event.location && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.order.event.location}
                  </p>
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="flex items-start gap-3">
            <Ticket className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{ticket.ticket_tier.name}</p>
              <p className="text-sm text-muted-foreground">
                ${ticket.ticket_tier.price.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendee Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Attendee Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="font-medium">
              {ticket.profile.full_name || 'Name not provided'}
            </p>
            <p className="text-sm text-muted-foreground">
              {ticket.profile.email}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Action */}
      {isOrganizer && (
        <Card>
          <CardContent className="pt-6">
            {canCheckIn ? (
              <Button 
                onClick={handleCheckIn} 
                disabled={checking}
                className="w-full"
                size="lg"
              >
                {checking ? 'Checking In...' : 'Check In Attendee'}
              </Button>
            ) : ticket.checked_in ? (
              <div className="text-center">
                <Badge variant="default" className="text-green-600 bg-green-100">
                  Already Checked In
                </Badge>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {!isOrganizer && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Only event organizers can check in attendees.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

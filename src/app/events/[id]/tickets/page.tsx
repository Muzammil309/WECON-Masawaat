'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { TicketTierForm } from '@/components/tickets/ticket-tier-form'
import { TicketTierCard } from '@/components/tickets/ticket-tier-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Plus, Ticket } from 'lucide-react'

interface Event {
  id: string
  title: string
  organizer_id: string
}

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

export default function EventTicketsPage() {
  const params = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchEventAndTickets(params.id as string)
    }
  }, [params.id])

  const fetchEventAndTickets = async (eventId: string) => {
    try {
      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('em_events')
        .select('id, title, organizer_id')
        .eq('id', eventId)
        .single()

      if (eventError) {
        console.error('Error fetching event:', eventError)
        return
      }

      setEvent(eventData)

      // Fetch ticket tiers
      const { data: ticketData, error: ticketError } = await supabase
        .from('em_ticket_tiers')
        .select('*')
        .eq('event_id', eventId)
        .order('price', { ascending: true })

      if (ticketError) {
        console.error('Error fetching ticket tiers:', ticketError)
      } else {
        setTicketTiers(ticketData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTicketTierCreated = () => {
    setShowForm(false)
    if (params.id) {
      fetchEventAndTickets(params.id as string)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
        <Button asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    )
  }

  const isOrganizer = user?.id === event.organizer_id

  if (!isOrganizer) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">
          Only event organizers can manage tickets.
        </p>
        <Button asChild>
          <Link href={`/events/${event.id}`}>Back to Event</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/events/${event.id}`} legacyBehavior>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Ticket Management</h1>
          <p className="text-muted-foreground">{event.title}</p>
        </div>
      </div>
      <Tabs defaultValue="tiers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tiers">Ticket Tiers</TabsTrigger>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-6">
          {/* Create New Tier */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ticket Tiers</h2>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? 'Cancel' : 'Add Ticket Tier'}
            </Button>
          </div>

          {showForm && (
            <TicketTierForm
              eventId={event.id}
              onSuccess={handleTicketTierCreated}
            />
          )}

          {/* Existing Ticket Tiers */}
          {ticketTiers.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  No Ticket Tiers Yet
                </CardTitle>
                <CardDescription>
                  Create your first ticket tier to start selling tickets for your event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Ticket Tier
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ticketTiers.map((tier) => (
                <TicketTierCard
                  key={tier.id}
                  ticketTier={tier}
                  showPurchaseButton={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Track your ticket sales and revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {ticketTiers.reduce((sum, tier) => sum + tier.sold, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Tickets Sold</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Available</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    ${ticketTiers.reduce((sum, tier) => sum + (tier.price * tier.sold), 0).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

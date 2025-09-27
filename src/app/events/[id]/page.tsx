'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, Clock, Edit, Share2, Ticket } from 'lucide-react'
import { toast } from 'sonner'

interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  location: string | null
  max_attendees: number | null
  organizer_id: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  created_at: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string)
    }
  }, [params.id])

  const fetchEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('em_events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) {
        console.error('Error fetching event:', error)
        toast.error('Event not found')
        router.push('/events')
      } else {
        setEvent(data)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description || '',
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Event link copied to clipboard!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
        <p className="text-muted-foreground mb-4">
          The event you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/events">Browse Events</Link>
        </Button>
      </div>
    )
  }

  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const isOrganizer = user?.id === event.organizer_id

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created on {format(new Date(event.created_at), 'PPP')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          
          {isOrganizer && (
            <Button asChild>
              <Link href={`/events/${event.id}/edit`} legacyBehavior>
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </Link>
            </Button>
          )}
          
          {!isOrganizer && event.status === 'published' && (
            <Button>
              <Ticket className="mr-2 h-4 w-4" />
              Get Tickets
            </Button>
          )}
        </div>
      </div>
      {/* Event Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description || 'No description provided for this event.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{format(startDate, 'PPPP')}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(startDate, 'p')} - {format(endDate, 'p')}
                  </p>
                </div>
              </div>

              {event.location && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                </>
              )}

              {event.max_attendees && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        Maximum {event.max_attendees} attendees
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {!isOrganizer && event.status === 'published' && (
            <Card>
              <CardHeader>
                <CardTitle>Register for Event</CardTitle>
                <CardDescription>
                  Secure your spot at this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  <Ticket className="mr-2 h-4 w-4" />
                  Get Tickets
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

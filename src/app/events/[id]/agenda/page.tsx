'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { SessionForm } from '@/components/sessions/session-form'
import { SessionCard } from '@/components/sessions/session-card'
import { SpeakerForm } from '@/components/speakers/speaker-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Plus, Calendar, Users } from 'lucide-react'
import { format, isSameDay } from 'date-fns'

interface Event {
  id: string
  title: string
  organizer_id: string
}

interface Session {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  room: string | null
  track: string | null
  max_attendees: number | null
}

interface Speaker {
  id: string
  name: string
  title: string | null
  company: string | null
  bio: string | null
  email: string | null
}

export default function EventAgendaPage() {
  const params = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [showSpeakerForm, setShowSpeakerForm] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchEventData(params.id as string)
    }
  }, [params.id])

  const fetchEventData = async (eventId: string) => {
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

      // Fetch sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('em_sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('start_time', { ascending: true })

      if (sessionError) {
        console.error('Error fetching sessions:', sessionError)
      } else {
        setSessions(sessionData || [])
      }

      // Fetch speakers
      const { data: speakerData, error: speakerError } = await supabase
        .from('em_speakers')
        .select('*')
        .eq('event_id', eventId)
        .order('name', { ascending: true })

      if (speakerError) {
        console.error('Error fetching speakers:', speakerError)
      } else {
        setSpeakers(speakerData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionCreated = () => {
    setShowSessionForm(false)
    if (params.id) {
      fetchEventData(params.id as string)
    }
  }

  const handleSpeakerCreated = () => {
    setShowSpeakerForm(false)
    if (params.id) {
      fetchEventData(params.id as string)
    }
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = format(new Date(session.start_time), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(session)
    return acc
  }, {} as Record<string, Session[]>)

  // Get unique tracks
  const tracks = [...new Set(sessions.map(s => s.track).filter(Boolean))]

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
          <h1 className="text-3xl font-bold">Event Agenda</h1>
          <p className="text-muted-foreground">{event.title}</p>
        </div>
      </div>
      <Tabs defaultValue="agenda" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
          {isOrganizer && <TabsTrigger value="manage">Manage</TabsTrigger>}
        </TabsList>

        <TabsContent value="agenda" className="space-y-6">
          {/* Track Filters */}
          {tracks.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium">Tracks:</span>
              {tracks.map((track) => (
                <Badge key={track} variant="outline">
                  {track}
                </Badge>
              ))}
            </div>
          )}

          {/* Sessions by Date */}
          {Object.keys(sessionsByDate).length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  No Sessions Yet
                </CardTitle>
                <CardDescription>
                  {isOrganizer 
                    ? 'Start building your event agenda by adding sessions.'
                    : 'The event agenda will be available soon.'
                  }
                </CardDescription>
              </CardHeader>
              {isOrganizer && (
                <CardContent>
                  <Button onClick={() => setShowSessionForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Session
                  </Button>
                </CardContent>
              )}
            </Card>
          ) : (
            <div className="space-y-8">
              {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
                <div key={date} className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                  </h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dateSessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        showActions={isOrganizer}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="speakers" className="space-y-6">
          {speakers.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  No Speakers Yet
                </CardTitle>
                <CardDescription>
                  {isOrganizer 
                    ? 'Add speakers to showcase the talent at your event.'
                    : 'Speaker information will be available soon.'
                  }
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {speakers.map((speaker) => (
                <Card key={speaker.id}>
                  <CardHeader>
                    <CardTitle>{speaker.name}</CardTitle>
                    {(speaker.title || speaker.company) && (
                      <CardDescription>
                        {[speaker.title, speaker.company].filter(Boolean).join(' at ')}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {speaker.bio && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {speaker.bio}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isOrganizer && (
          <TabsContent value="manage" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Sessions</h2>
                  <Button onClick={() => setShowSessionForm(!showSessionForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {showSessionForm ? 'Cancel' : 'Add Session'}
                  </Button>
                </div>

                {showSessionForm && (
                  <SessionForm
                    eventId={event.id}
                    onSuccess={handleSessionCreated}
                  />
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Speakers</h2>
                  <Button onClick={() => setShowSpeakerForm(!showSpeakerForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {showSpeakerForm ? 'Cancel' : 'Add Speaker'}
                  </Button>
                </div>

                {showSpeakerForm && (
                  <SpeakerForm
                    eventId={event.id}
                    onSuccess={handleSpeakerCreated}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

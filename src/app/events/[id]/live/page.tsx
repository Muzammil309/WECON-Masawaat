'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { ChatRoom } from '@/components/chat/chat-room'
import { LiveQA } from '@/components/qa/live-qa'
import { AttendeeDirectory } from '@/components/networking/attendee-directory'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Radio, MessageCircle, HelpCircle, Users, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  location: string | null
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
}

export default function LiveEventPage() {
  const params = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  
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
        .select('*')
        .eq('id', eventId)
        .single()

      if (eventError) {
        console.error('Error fetching event:', eventError)
        return
      }

      setEvent(eventData)

      // Fetch current and upcoming sessions
      const now = new Date().toISOString()
      
      // Current session (happening now)
      const { data: currentSessionData } = await supabase
        .from('em_sessions')
        .select('*')
        .eq('event_id', eventId)
        .lte('start_time', now)
        .gte('end_time', now)
        .order('start_time', { ascending: true })
        .limit(1)
        .single()

      if (currentSessionData) {
        setCurrentSession(currentSessionData)
      }

      // Upcoming sessions (next 3)
      const { data: upcomingSessionsData } = await supabase
        .from('em_sessions')
        .select('*')
        .eq('event_id', eventId)
        .gt('start_time', now)
        .order('start_time', { ascending: true })
        .limit(3)

      if (upcomingSessionsData) {
        setUpcomingSessions(upcomingSessionsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
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
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <Badge variant="default" className="bg-red-100 text-red-800">
              <Radio className="mr-1 h-3 w-3" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {format(new Date(event.start_date), 'PPP')}
            {event.location && ` • ${event.location}`}
          </p>
        </div>
      </div>
      {/* Current Session */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Now Playing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="font-semibold">{currentSession.title}</h3>
              {currentSession.description && (
                <p className="text-sm text-muted-foreground">
                  {currentSession.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(currentSession.start_time), 'HH:mm')} - 
                  {format(new Date(currentSession.end_time), 'HH:mm')}
                </div>
                {currentSession.room && (
                  <div>Room: {currentSession.room}</div>
                )}
                {currentSession.track && (
                  <Badge variant="outline">{currentSession.track}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Coming Up Next</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(session.start_time), 'HH:mm')}
                      {session.room && ` • ${session.room}`}
                    </div>
                  </div>
                  {session.track && (
                    <Badge variant="outline">{session.track}</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Live Features */}
      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Q&A
          </TabsTrigger>
          <TabsTrigger value="networking" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Networking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <ChatRoom eventId={event.id} roomName="General" />
        </TabsContent>

        <TabsContent value="qa">
          {currentSession ? (
            <LiveQA sessionId={currentSession.id} isOrganizer={isOrganizer} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Q&A Unavailable</CardTitle>
                <CardDescription>
                  Q&A is only available during active sessions.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="networking">
          <AttendeeDirectory eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

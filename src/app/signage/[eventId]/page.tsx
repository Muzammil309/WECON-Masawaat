'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Wifi,
  Coffee,
  Info,
  ArrowRight
} from 'lucide-react'
import { format, isAfter, isBefore, addMinutes } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  location: string | null
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

interface Announcement {
  id: string
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

export default function DigitalSignagePage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (params.eventId) {
      fetchEventData(params.eventId as string)
      setupRealtimeSubscription()
    }

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      clearInterval(timeInterval)
      supabase.removeAllChannels()
    }
  }, [params.eventId])

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

      // Fetch sessions
      const now = new Date().toISOString()
      
      // Current session
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

      // Upcoming sessions (next 4)
      const { data: upcomingSessionsData } = await supabase
        .from('em_sessions')
        .select('*')
        .eq('event_id', eventId)
        .gt('start_time', now)
        .order('start_time', { ascending: true })
        .limit(4)

      if (upcomingSessionsData) {
        setUpcomingSessions(upcomingSessionsData)
      }

      // Fetch announcements
      const { data: announcementsData } = await supabase
        .from('em_announcements')
        .select('*')
        .eq('event_id', eventId)
        .eq('active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3)

      if (announcementsData) {
        setAnnouncements(announcementsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`signage-${params.eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'em_sessions',
          filter: `event_id=eq.${params.eventId}`,
        },
        () => {
          fetchEventData(params.eventId as string)
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'em_announcements',
          filter: `event_id=eq.${params.eventId}`,
        },
        () => {
          fetchEventData(params.eventId as string)
        }
      )
      .subscribe()
  }

  const getSessionProgress = (session: Session) => {
    const now = new Date()
    const start = new Date(session.start_time)
    const end = new Date(session.end_time)
    
    if (isBefore(now, start)) return 0
    if (isAfter(now, end)) return 100
    
    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return (elapsed / total) * 100
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>
              The requested event could not be found.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-gray-900">{event.title}</h1>
          <div className="flex items-center justify-center gap-8 text-xl text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              {format(new Date(event.start_date), 'PPPP')}
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                {event.location}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6" />
              {format(currentTime, 'HH:mm')}
            </div>
          </div>
        </div>

        {/* Current Session */}
        {currentSession && (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl text-green-800">Now Playing</CardTitle>
                <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <h2 className="text-4xl font-bold text-green-900">{currentSession.title}</h2>
              {currentSession.description && (
                <p className="text-xl text-green-700">{currentSession.description}</p>
              )}
              <div className="flex items-center gap-8 text-lg text-green-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {format(new Date(currentSession.start_time), 'HH:mm')} - 
                  {format(new Date(currentSession.end_time), 'HH:mm')}
                </div>
                {currentSession.room && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {currentSession.room}
                  </div>
                )}
                {currentSession.track && (
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {currentSession.track}
                  </Badge>
                )}
              </div>
              <Progress value={getSessionProgress(currentSession)} className="h-3" />
            </CardContent>
          </Card>
        )}

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Info className="h-8 w-8" />
              Announcements
            </h2>
            <div className="grid gap-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className={`border-2 ${getPriorityColor(announcement.priority)}`}>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{announcement.title}</h3>
                    <p className="text-lg">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ArrowRight className="h-8 w-8" />
              Coming Up Next
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingSessions.map((session, index) => (
                <Card key={session.id} className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-blue-900">{session.title}</h3>
                      <Badge variant="outline" className="text-blue-600">
                        {index === 0 ? 'Next' : `+${index}`}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-blue-700">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {format(new Date(session.start_time), 'HH:mm')} - 
                        {format(new Date(session.end_time), 'HH:mm')}
                      </div>
                      {session.room && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {session.room}
                        </div>
                      )}
                      {session.track && (
                        <Badge variant="outline" className="text-blue-600">
                          {session.track}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center space-y-4 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-center gap-8 text-lg text-gray-600">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              WiFi: EventGuest
            </div>
            <div className="flex items-center gap-2">
              <Coffee className="h-5 w-5" />
              Refreshments: Lobby
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Help Desk: Registration
            </div>
          </div>
          <p className="text-gray-500">
            Last updated: {format(currentTime, 'HH:mm:ss')}
          </p>
        </div>
      </div>
    </div>
  )
}

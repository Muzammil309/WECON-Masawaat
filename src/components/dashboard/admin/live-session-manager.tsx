'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Play, 
  Pause, 
  Radio, 
  Users, 
  MessageSquare,
  BarChart3,
  Video,
  Mic,
  MicOff
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface LiveSession {
  id: string
  title: string
  speaker: string
  status: 'live' | 'upcoming' | 'ended'
  attendees: number
  startTime: string
  endTime: string
  room: string
}

export function LiveSessionManager() {
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLiveSessions()
    
    // Real-time updates
    const supabase = createClient()
    const channel = supabase
      .channel('live-sessions')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'em_sessions' },
        () => fetchLiveSessions()
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const fetchLiveSessions = async () => {
    try {
      const supabase = createClient()
      const now = new Date().toISOString()
      
      const { data: sessionsData } = await supabase
        .from('em_sessions')
        .select(`
          id,
          title,
          start_time,
          end_time,
          location,
          em_session_speakers (
            em_speakers (
              name
            )
          )
        `)
        .gte('end_time', now)
        .order('start_time', { ascending: true })
        .limit(5)

      if (sessionsData) {
        const formattedSessions: LiveSession[] = sessionsData.map((session: any) => {
          const startTime = new Date(session.start_time)
          const endTime = new Date(session.end_time)
          const now = new Date()
          
          let status: 'live' | 'upcoming' | 'ended' = 'upcoming'
          if (now >= startTime && now <= endTime) {
            status = 'live'
          } else if (now > endTime) {
            status = 'ended'
          }

          return {
            id: session.id,
            title: session.title,
            speaker: session.em_session_speakers?.[0]?.em_speakers?.name || 'TBA',
            status,
            attendees: Math.floor(Math.random() * 150) + 50, // Mock data
            startTime: session.start_time,
            endTime: session.end_time,
            room: session.location || 'Main Hall'
          }
        })

        setSessions(formattedSessions)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching live sessions:', error)
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
            <Radio className="h-3 w-3 mr-1" />
            LIVE
          </Badge>
        )
      case 'upcoming':
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Upcoming
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            Ended
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Session Manager</CardTitle>
          <CardDescription>Control active and upcoming sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-slate-100 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Live Session Manager</CardTitle>
            <CardDescription>Control active and upcoming sessions</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Video className="h-4 w-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No active sessions</p>
              <p className="text-sm">Sessions will appear here when they start</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(session.status)}
                      <span className="text-xs text-slate-500">{session.room}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">{session.title}</h4>
                    <p className="text-sm text-slate-600">Speaker: {session.speaker}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{session.attendees}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {new Date(session.startTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {new Date(session.endTime).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>

                  {session.status === 'live' && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Q&A
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Poll
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Pause className="h-3 w-3 mr-1" />
                        End
                      </Button>
                    </div>
                  )}

                  {session.status === 'upcoming' && (
                    <Button size="sm" variant="default">
                      <Play className="h-3 w-3 mr-1" />
                      Start Session
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}


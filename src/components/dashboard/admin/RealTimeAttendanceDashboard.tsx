'use client'

import React, { useState, useEffect } from 'react'
import { LiveEventMetrics } from './LiveEventMetrics'
import { SessionAttendanceTracker } from './SessionAttendanceTracker'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Users,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Session {
  id: string
  title: string
  starts_at: string
  ends_at: string
  location?: string
  capacity?: number
}

interface RealTimeAttendanceDashboardProps {
  eventId: string
  eventTitle: string
}

export function RealTimeAttendanceDashboard({
  eventId,
  eventTitle
}: RealTimeAttendanceDashboardProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  const supabase = createClient()

  useEffect(() => {
    fetchSessions()
  }, [eventId])

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('em_sessions')
        .select('*')
        .eq('event_id', eventId)
        .order('starts_at', { ascending: true })

      if (error) throw error

      const now = new Date()
      const allSessions = data || []

      // Categorize sessions
      const active = allSessions.filter((s: any) => {
        const start = new Date(s.starts_at)
        const end = new Date(s.ends_at)
        return start <= now && end >= now
      })

      const upcoming = allSessions.filter((s: any) => {
        const start = new Date(s.starts_at)
        return start > now
      })

      setSessions(allSessions)
      setActiveSessions(active)
      setUpcomingSessions(upcoming)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{eventTitle}</h1>
        <p className="text-slate-400">Real-time attendance tracking and session analytics</p>
      </div>

      {/* Live Event Metrics */}
      <LiveEventMetrics eventId={eventId} />

      {/* Sessions Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Active Sessions ({activeSessions.length})
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mr-2" />
            Upcoming ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Sessions Summary */}
            <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-white/10 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : activeSessions.length > 0 ? (
                  <div className="space-y-3">
                    {activeSessions.map(session => (
                      <SessionCard key={session.id} session={session} status="active" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active sessions at the moment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Sessions Summary */}
            <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-white/10 animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 5).map(session => (
                      <SessionCard key={session.id} session={session} status="upcoming" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming sessions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Sessions Tab */}
        <TabsContent value="active" className="space-y-6">
          {loading ? (
            <div className="grid gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-white/10 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : activeSessions.length > 0 ? (
            <div className="grid gap-6">
              {activeSessions.map(session => (
                <SessionAttendanceTracker
                  key={session.id}
                  sessionId={session.id}
                  sessionTitle={session.title}
                  capacity={session.capacity}
                />
              ))}
            </div>
          ) : (
            <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
              <CardContent className="py-12">
                <div className="text-center text-slate-400">
                  <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Active Sessions</h3>
                  <p>There are no sessions currently in progress</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Upcoming Sessions Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-white/10 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="grid gap-4">
              {upcomingSessions.map(session => (
                <Card key={session.id} className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">{session.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(session.starts_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          {session.location && (
                            <span>{session.location}</span>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                        Upcoming
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
              <CardContent className="py-12">
                <div className="text-center text-slate-400">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Upcoming Sessions</h3>
                  <p>All sessions for this event have concluded</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
            <CardContent className="py-12">
              <div className="text-center text-slate-400">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h3>
                <p>Detailed analytics and reporting coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface SessionCardProps {
  session: Session
  status: 'active' | 'upcoming'
}

function SessionCard({ session, status }: SessionCardProps) {
  const startTime = new Date(session.starts_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-white text-sm mb-1">{session.title}</h4>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {startTime}
            </span>
            {session.location && <span>{session.location}</span>}
          </div>
        </div>
        <Badge 
          variant="outline"
          className={`text-xs ${
            status === 'active'
              ? 'bg-green-500/20 text-green-400 border-green-500/50'
              : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
          }`}
        >
          {status === 'active' ? 'Live' : 'Upcoming'}
        </Badge>
      </div>
    </div>
  )
}


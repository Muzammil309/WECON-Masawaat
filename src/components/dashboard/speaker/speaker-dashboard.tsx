"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/storage/file-upload"
import { FileBrowser } from "@/components/storage/file-browser"
import { BarChart3, Calendar, FileUp, MessageCircle, Star, Users } from "lucide-react"

interface SessionRow { id: string; title: string; event_id: string; starts_at: string; ends_at: string; event?: { id: string; title: string } }
interface EventRow { id: string; title: string }

export function SpeakerDashboard() {
  const { user } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [events, setEvents] = useState<EventRow[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [engagementCounts, setEngagementCounts] = useState({ messages: 0, questions: 0 })
  const [activeTab, setActiveTab] = useState<string>('sessions')

  // Hash-based tab routing
  useEffect(() => {
    const applyHash = () => {
      const hash = typeof window !== 'undefined' ? window.location.hash.replace('#','') : ''
      if (hash && ['sessions','materials','feedback','engagement'].includes(hash)) {
        setActiveTab(hash)
      }
    }
    applyHash()
    const onHash = () => applyHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const current = window.location.hash.replace('#','')
      if (current !== activeTab) window.location.hash = activeTab
    }
  }, [activeTab])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        // Try to fetch sessions where user is the speaker
        let { data: sess, error } = await supabase
          .from("em_sessions")
          .select("id, title, event_id, starts_at, ends_at, event:em_events(id, title)")
          .eq("speaker_id", user.id)
          .order("starts_at", { ascending: true })

        if (error) {
          console.warn("Falling back to sessions by creator_id", error)
          const fallback = await supabase
            .from("em_sessions")
            .select("id, title, event_id, starts_at, ends_at, event:em_events(id, title)")
            .eq("creator_id", user.id)
            .order("starts_at", { ascending: true })
          sess = fallback.data || []
        }

        setSessions((sess as any) || [])

        const evMap = new Map<string, EventRow>()
        ;(sess || []).forEach((s: any) => {
          if (s.event) evMap.set(s.event.id, { id: s.event.id, title: s.event.title })
          else if (s.event_id) evMap.set(s.event_id, { id: s.event_id, title: `Event ${s.event_id.substring(0,6)}...` })
        })
        const evs = Array.from(evMap.values())
        setEvents(evs)
        if (evs.length > 0) setSelectedEventId(evs[0].id)

        // Engagement: messages for these events, questions for these sessions
        const eventIds = evs.map(e => e.id)
        const sessionIds = (sess || []).map((s: any) => s.id)

        let msgs = 0
        if (eventIds.length > 0) {
          const { count } = await supabase
            .from("em_messages")
            .select("*", { count: 'exact', head: true })
            .in("event_id", eventIds)
          msgs = count || 0
        }

        let qs = 0
        if (sessionIds.length > 0) {
          const { count } = await supabase
            .from("em_qa_questions")
            .select("*", { count: 'exact', head: true })
            .in("session_id", sessionIds)
          qs = count || 0
        }

        setEngagementCounts({ messages: msgs, questions: qs })
      } catch (e) {
        console.error("Speaker dashboard load error", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const upcoming = useMemo(() => sessions.filter(s => new Date(s.starts_at) > new Date()), [sessions])
  const past = useMemo(() => sessions.filter(s => new Date(s.ends_at) < new Date()), [sessions])

  if (!user) {
    return <div className="text-center py-12 text-muted-foreground">Please sign in.</div>
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-md border bg-muted/30 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Upcoming Sessions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{upcoming.length}</div><p className="text-xs text-muted-foreground">Next 30 days</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Past Sessions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{past.length}</div><p className="text-xs text-muted-foreground">Completed</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Messages</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{engagementCounts.messages}</div><p className="text-xs text-muted-foreground">Event chat total</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Q&A Questions</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{engagementCounts.questions}</div><p className="text-xs text-muted-foreground">Across your sessions</p></CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="sessions" className="flex items-center gap-2"><Calendar className="h-4 w-4" />Sessions</TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2"><FileUp className="h-4 w-4" />Materials</TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2"><Star className="h-4 w-4" />Feedback</TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2"><BarChart3 className="h-4 w-4" />Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Sessions</CardTitle>
                <CardDescription>We couldn't find sessions assigned to you yet.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sessions.map((s) => (
                <Card key={s.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{s.title}</CardTitle>
                        <CardDescription>{new Date(s.starts_at).toLocaleString()} • {s.event?.title || 'Event'}</CardDescription>
                      </div>
                      <Badge variant={new Date(s.starts_at) > new Date() ? 'secondary' : 'outline'}>
                        {new Date(s.starts_at) > new Date() ? 'Upcoming' : 'Past'}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Materials</CardTitle>
                <CardDescription>No events found to attach files to.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Select event</span>
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger className="w-64"><SelectValue placeholder="Event" /></SelectTrigger>
                  <SelectContent>
                    {events.map(e => (
                      <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedEventId && (
                <div className="grid gap-4 md:grid-cols-2">
                  <FileUpload eventId={selectedEventId} />
                  <FileBrowser eventId={selectedEventId} canDelete />
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Feedback</CardTitle>
              <CardDescription>Ratings and comments from attendees (coming soon)</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Engagement</CardTitle>
              <CardDescription>Charts and trends (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">We'll visualize engagement trends here using Recharts.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


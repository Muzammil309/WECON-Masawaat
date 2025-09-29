"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { QRCodeDisplay } from "@/components/tickets/qr-code-display"
import { Calendar, Ticket, Sparkles, User } from "lucide-react"
import Link from "next/link"

interface TicketRow {
  id: string
  user_id: string
  checked_in: boolean | null
  qr_code: string | null
  ticket_tier?: { name?: string | null; price?: number | null }
  order?: { event_id: string; event?: { id: string; title: string; start_date?: string | null; status?: string | null } }
}

interface SessionRow { id: string; event_id: string; title: string; starts_at: string; ends_at: string }
interface EventRow { id: string; title: string; start_date?: string | null; status?: string | null }

export function AttendeeDashboard() {
  const { user } = useAuth()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<SessionRow[]>([])
  const [recommendations, setRecommendations] = useState<EventRow[]>([])
  const [profileSaving, setProfileSaving] = useState(false)
  const [fullName, setFullName] = useState<string>(user?.user_metadata?.full_name || "")

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        // Load tickets for current user
        const { data: ticketData } = await supabase
          .from("em_tickets")
          .select(`
            id, user_id, checked_in, qr_code,
            ticket_tier:em_ticket_tiers(name, price),
            order:em_orders(event_id, event:em_events(id, title, start_date, status))
          `)
          .eq("user_id", user.id)
          .order("id")
        setTickets((ticketData as any) || [])

        // Build eventIds for schedule and recommendations
        const eventIds = Array.from(new Set((ticketData || []).map((t: any) => t.order?.event_id).filter(Boolean)))

        // Upcoming sessions for the user's events (next 30 days)
        if (eventIds.length > 0) {
          const now = new Date().toISOString()
          const in30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          const { data: sessions } = await supabase
            .from("em_sessions")
            .select("id, event_id, title, starts_at, ends_at")
            .in("event_id", eventIds)
            .gte("starts_at", now)
            .lte("starts_at", in30)
            .order("starts_at", { ascending: true })
          setUpcomingSessions((sessions as any) || [])
        } else {
          setUpcomingSessions([])
        }

        // Recommendations: published events not already registered, starting in the future
        const { data: recs } = await supabase
          .from("em_events")
          .select("id, title, start_date, status")
          .eq("status", "published")
          .gt("start_date", new Date().toISOString())
          .order("start_date", { ascending: true })
          .limit(5)
        const filtered = (recs || []).filter((e: any) => !eventIds.includes(e.id))
        setRecommendations(filtered as any)
      } catch (e) {
        console.error("Attendee dashboard load error", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const firstActiveTicket = useMemo(() => {
    return tickets.find(t => !t.checked_in && t.qr_code && t.order?.event?.title)
  }, [tickets])

  const saveProfile = async () => {
    if (!user) return
    setProfileSaving(true)
    try {
      // Update em_profiles name; also keep auth metadata in sync
      await supabase.from("em_profiles").upsert({ id: user.id, full_name: fullName })
      await supabase.auth.updateUser({ data: { full_name: fullName } })
    } catch (e) {
      console.error("Profile save failed", e)
    } finally {
      setProfileSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please sign in to see your dashboard.</p>
      </div>
    )
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
      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Registered Events</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(tickets.map(t => t.order?.event_id).filter(Boolean)).size}</div>
            <p className="text-xs text-muted-foreground">Events you are attending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Active Tickets</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets.filter(t => !t.checked_in).length}</div>
            <p className="text-xs text-muted-foreground">Valid tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Upcoming Sessions</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
            <p className="text-xs text-muted-foreground">Suggested for you</p>
          </CardContent>
        </Card>
      </div>

      {/* Schedule + QR */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card id="schedule">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Upcoming Schedule</CardTitle>
            <CardDescription>Sessions from your registered events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sessions in the next 30 days.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingSessions.slice(0, 6).map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium leading-tight">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(s.starts_at).toLocaleString()}</div>
                    </div>
                    <Badge variant="secondary">Upcoming</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" asChild className="mt-2"><Link href="/schedule">View full schedule</Link></Button>
          </CardContent>
        </Card>

        <div id="qr">
          {firstActiveTicket ? (
            <QRCodeDisplay
              ticketId={firstActiveTicket.id}
              qrCode={firstActiveTicket.qr_code as string}
              eventTitle={firstActiveTicket.order!.event!.title}
              ticketTierName={firstActiveTicket.ticket_tier?.name || "Ticket"}
              isCheckedIn={!!firstActiveTicket.checked_in}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ticket className="h-4 w-4" /> Check-in QR</CardTitle>
                <CardDescription>No active tickets found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-36 rounded-md bg-muted/50 border border-dashed grid place-items-center text-muted-foreground">Buy a ticket to get your QR</div>
                <Button asChild className="mt-3 w-full"><Link href="/events">Browse Events</Link></Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <Card id="recommendations">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Recommendations</CardTitle>
          <CardDescription>Suggested events you might like</CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recommendations available yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((e) => (
                <Card key={e.id}>
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">{e.title}</CardTitle>
                    <CardDescription>{e.start_date ? new Date(e.start_date).toLocaleDateString() : "Date TBA"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full"><Link href={`/events/${e.id}`}>View Event</Link></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile */}
      <Card id="profile">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 max-w-xl">
            <label className="text-sm font-medium">Full name</label>
            <input
              aria-label="Full name"
              className="h-10 rounded-md border bg-transparent px-3 text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={saveProfile} disabled={profileSaving}>{profileSaving ? "Saving..." : "Save"}</Button>
              <Button variant="outline" asChild><Link href="/settings">More settings</Link></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


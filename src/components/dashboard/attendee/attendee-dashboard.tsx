"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeDisplay } from "@/components/tickets/qr-code-display"
import { SoftCard, SoftStatCard, SoftGradientCard } from "../soft-ui/soft-card"
import { SoftButton } from "../soft-ui/soft-button"
import { DarkSoftCard, DarkSoftStatCard, DarkSoftGradientCard, DarkSoftButton, darkTheme } from "../soft-ui/dark-theme"
import {
  Calendar,
  Ticket,
  Sparkles,
  User,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  QrCode,
  BarChart3,
  Calendar as CalendarIcon
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

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
    <div className="space-y-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen text-gray-100 p-6">
      {/* Welcome Section */}
      <DarkSoftGradientCard gradient="primary" className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back, {user?.user_metadata?.full_name || user?.email}!
              </h2>
              <p className="text-indigo-100 text-lg">
                Ready to explore amazing events and connect with fellow attendees?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </DarkSoftGradientCard>

      {/* KPI Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DarkSoftStatCard
          title="Registered Events"
          value={new Set(tickets.map(t => t.order?.event_id).filter(Boolean)).size}
          change={{ value: "+2 this month", type: "increase" }}
          icon={<CalendarIcon className="h-5 w-5" />}
          iconGradient="primary"
        />
        <DarkSoftStatCard
          title="Active Tickets"
          value={tickets.filter(t => !t.checked_in).length}
          change={{ value: "Ready to use", type: "neutral" }}
          icon={<Ticket className="h-5 w-5" />}
          iconGradient="secondary"
        />
        <DarkSoftStatCard
          title="Upcoming Sessions"
          value={upcomingSessions.length}
          change={{ value: "Next 30 days", type: "neutral" }}
          icon={<Clock className="h-5 w-5" />}
          iconGradient="success"
        />
        <DarkSoftStatCard
          title="Recommendations"
          value={recommendations.length}
          change={{ value: "Curated for you", type: "increase" }}
          icon={<Star className="h-5 w-5" />}
          iconGradient="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Schedule & QR */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Schedule */}
          <DarkSoftCard id="schedule" variant="glass" className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: darkTheme.gradients.primary }}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-100">Upcoming Schedule</h3>
                  <p className="text-gray-300">Sessions from your registered events</p>
                </div>
              </div>
              <DarkSoftButton variant="outlined" size="sm" asChild>
                <Link href="/schedule">View All</Link>
              </DarkSoftButton>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-300 mb-2">No sessions in the next 30 days</p>
                <p className="text-sm text-gray-400">Register for events to see your schedule</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-gray-800/40 rounded-xl hover:bg-gray-700/40 transition-colors duration-200 border border-gray-600/20">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: darkTheme.gradients.success }}
                    >
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-100 truncate">{s.title}</h4>
                      <p className="text-sm text-gray-300">{new Date(s.starts_at).toLocaleString()}</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20">
                      Upcoming
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </DarkSoftCard>

          {/* Event Recommendations */}
          <DarkSoftCard id="recommendations" variant="glass">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: darkTheme.gradients.warning }}
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">Recommended Events</h3>
                <p className="text-gray-300">Curated events you might enjoy</p>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-300 mb-2">No recommendations available yet</p>
                <p className="text-sm text-gray-400">Attend more events to get personalized suggestions</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.slice(0, 4).map((e) => (
                  <div key={e.id} className="group p-4 bg-gray-800/40 rounded-xl hover:bg-gray-700/40 hover:shadow-lg transition-all duration-200 border border-gray-600/20">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-100 line-clamp-2 group-hover:text-indigo-400 transition-colors">
                        {e.title}
                      </h4>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-400 transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      {e.start_date ? new Date(e.start_date).toLocaleDateString() : "Date TBA"}
                    </p>
                    <DarkSoftButton variant="outlined" size="sm" fullWidth asChild>
                      <Link href={`/events/${e.id}`}>View Event</Link>
                    </DarkSoftButton>
                  </div>
                ))}
              </div>
            )}
          </DarkSoftCard>
        </div>

        {/* Right Column - QR Code & Profile */}
        <div className="space-y-8">
          {/* QR Code Section */}
          <div id="qr">
            {firstActiveTicket ? (
              <DarkSoftCard variant="glass" className="text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ background: darkTheme.gradients.success }}
                  >
                    <QrCode className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-100">Event Check-in</h3>
                    <p className="text-gray-300">Your active ticket QR code</p>
                  </div>
                </div>
                <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-600/20">
                  <QRCodeDisplay
                    ticketId={firstActiveTicket.id}
                    qrCode={firstActiveTicket.qr_code as string}
                    eventTitle={firstActiveTicket.order!.event!.title}
                    ticketTierName={firstActiveTicket.ticket_tier?.name || "Ticket"}
                    isCheckedIn={!!firstActiveTicket.checked_in}
                  />
                </div>
              </DarkSoftCard>
            ) : (
              <DarkSoftCard variant="glass" className="text-center">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ background: darkTheme.gradients.dark }}
                  >
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-100">Check-in QR</h3>
                    <p className="text-gray-300">No active tickets found</p>
                  </div>
                </div>
                <div className="py-12">
                  <div className="w-20 h-20 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-300 mb-4">Purchase a ticket to get your QR code</p>
                  <DarkSoftButton variant="gradient" gradient="primary" fullWidth asChild>
                    <Link href="/events">Browse Events</Link>
                  </DarkSoftButton>
                </div>
              </DarkSoftCard>
            )}
          </div>

          {/* Profile Section */}
          <DarkSoftCard id="profile" variant="glass">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: darkTheme.gradients.secondary }}
              >
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">Profile Settings</h3>
                <p className="text-gray-300">Update your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-200 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 bg-gray-800/60 border-gray-600/30 rounded-xl text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400/50"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <DarkSoftButton
                  onClick={saveProfile}
                  disabled={profileSaving}
                  variant="gradient"
                  gradient="primary"
                  className="flex-1"
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </DarkSoftButton>
                <DarkSoftButton variant="outlined" asChild>
                  <Link href="/settings">More Settings</Link>
                </DarkSoftButton>
              </div>
            </div>
          </DarkSoftCard>

          {/* Quick Actions */}
          <DarkSoftCard variant="glass">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: darkTheme.gradients.info }}
              >
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-100">Quick Actions</h3>
                <p className="text-gray-300">Common tasks and shortcuts</p>
              </div>
            </div>

            <div className="space-y-3">
              <DarkSoftButton variant="outlined" fullWidth asChild>
                <Link href="/tickets" className="flex items-center gap-2">
                  <Ticket className="h-4 w-4" />
                  View My Tickets
                </Link>
              </DarkSoftButton>
              <DarkSoftButton variant="outlined" fullWidth asChild>
                <Link href="/networking" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Find Attendees
                </Link>
              </DarkSoftButton>
              <DarkSoftButton variant="outlined" fullWidth asChild>
                <Link href="/schedule" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Full Schedule
                </Link>
              </DarkSoftButton>
            </div>
          </DarkSoftCard>
        </div>
      </div>
    </div>
  )
}


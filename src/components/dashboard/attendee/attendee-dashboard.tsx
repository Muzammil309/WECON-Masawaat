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
  EnhancedStatisticsCard,
  PrimaryStatCard,
  SuccessStatCard,
  WarningStatCard,
  InfoStatCard
} from "../soft-ui/enhanced-statistics-card"
import {
  EnhancedContentCard,
  WelcomeCard,
  EmptyStateCard,
  QuickActionCard
} from "../soft-ui/enhanced-content-cards"
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <WelcomeCard
        userName={user?.user_metadata?.full_name || user?.email || "User"}
        userRole={user?.user_metadata?.role || "attendee"}
      />

      {/* KPI Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <PrimaryStatCard
          title="Registered Events"
          count={new Set(tickets.map(t => t.order?.event_id).filter(Boolean)).size}
          percentage={{ value: "+2 this month", type: "increase" }}
          icon={<CalendarIcon className="h-5 w-5" />}
        />
        <SuccessStatCard
          title="Active Tickets"
          count={tickets.filter(t => !t.checked_in).length}
          percentage={{ value: "Ready to use", type: "neutral" }}
          icon={<Ticket className="h-5 w-5" />}
        />
        <InfoStatCard
          title="Upcoming Sessions"
          count={upcomingSessions.length}
          percentage={{ value: "Next 30 days", type: "neutral" }}
          icon={<Clock className="h-5 w-5" />}
        />
        <WarningStatCard
          title="Recommendations"
          count={recommendations.length}
          percentage={{ value: "Curated for you", type: "increase" }}
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Schedule & QR */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Schedule */}
          <EnhancedContentCard
            id="schedule"
            title="Upcoming Schedule"
            subtitle="Sessions from your registered events"
            icon={<Calendar className="h-5 w-5" />}
            action={
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
              >
                View All
              </Link>
            }
            variant="glass"
          >

            {upcomingSessions.length === 0 ? (
              <EmptyStateCard
                icon={<CalendarIcon className="h-8 w-8" />}
                title="No sessions in the next 30 days"
                description="Register for events to see your schedule"
                action={
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Browse Events
                  </Link>
                }
              />
            ) : (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 5).map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">{s.title}</h4>
                      <p className="text-sm text-gray-600">{new Date(s.starts_at).toLocaleString()}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
                      Upcoming
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </EnhancedContentCard>

          {/* Event Recommendations */}
          <EnhancedContentCard
            id="recommendations"
            title="Recommended Events"
            subtitle="Curated events you might enjoy"
            icon={<Sparkles className="h-5 w-5" />}
            variant="gradient"
          >

            {recommendations.length === 0 ? (
              <EmptyStateCard
                icon={<Star className="h-8 w-8" />}
                title="No recommendations available yet"
                description="Attend more events to get personalized suggestions"
                action={
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
                  >
                    Explore Events
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recommendations.slice(0, 4).map((e) => (
                  <div key={e.id} className="group p-4 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {e.title}
                      </h4>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {e.start_date ? new Date(e.start_date).toLocaleDateString() : "Date TBA"}
                    </p>
                    <Link
                      href={`/events/${e.id}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 text-sm font-medium"
                    >
                      View Event
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </EnhancedContentCard>
        </div>

        {/* Right Column - QR Code & Profile */}
        <div className="space-y-8">
          {/* QR Code Section */}
          <div id="qr">
            {firstActiveTicket ? (
              <EnhancedContentCard
                title="Event Check-in"
                subtitle="Your active ticket QR code"
                icon={<QrCode className="h-5 w-5" />}
                variant="elevated"
                className="text-center"
              >
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <QRCodeDisplay
                    ticketId={firstActiveTicket.id}
                    qrCode={firstActiveTicket.qr_code as string}
                    eventTitle={firstActiveTicket.order!.event!.title}
                    ticketTierName={firstActiveTicket.ticket_tier?.name || "Ticket"}
                    isCheckedIn={!!firstActiveTicket.checked_in}
                  />
                </div>
              </EnhancedContentCard>
            ) : (
              <EnhancedContentCard
                title="Check-in QR"
                subtitle="No active tickets found"
                icon={<Ticket className="h-5 w-5" />}
                variant="elevated"
                className="text-center"
              >
                <EmptyStateCard
                  icon={<QrCode className="h-10 w-10" />}
                  title="Purchase a ticket to get your QR code"
                  description="Browse available events and get your tickets"
                  action={
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 font-medium"
                    >
                      Browse Events
                    </Link>
                  }
                />
              </EnhancedContentCard>
            )}
          </div>

          {/* Profile Section */}
          <EnhancedContentCard
            id="profile"
            title="Profile Settings"
            subtitle="Update your personal information"
            icon={<User className="h-5 w-5" />}
            variant="elevated"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 bg-white border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={saveProfile}
                  disabled={profileSaving}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  More Settings
                </Link>
              </div>
            </div>
          </EnhancedContentCard>

          {/* Quick Actions */}
          <QuickActionCard
            title="Quick Actions"
            description="Common tasks and shortcuts"
            actions={[
              {
                label: "View My Tickets",
                icon: <Ticket className="h-4 w-4" />,
                href: "/tickets",
                variant: "primary"
              },
              {
                label: "Find Attendees",
                icon: <Users className="h-4 w-4" />,
                href: "/networking",
                variant: "secondary"
              },
              {
                label: "Full Schedule",
                icon: <CalendarIcon className="h-4 w-4" />,
                href: "/schedule"
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}


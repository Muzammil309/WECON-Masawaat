"use client"

import React, { useState, useEffect } from "react"
import { ProfessionalDashboardLayout } from "../professional-dashboard-layout"
import { 
  SoftBox,
  SoftButton,
  SoftTypography,
  MiniStatisticsCard,
  softUITheme
} from "@/components/soft-ui"
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart3,
  Users,
  Settings,
  Clock,
  TrendingUp,
  Plus,
  QrCode,
  User,
  Bell,
  Star,
  MapPin,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"

interface TicketData {
  id: string
  status: string
  checked_in: boolean
  qr_code: string | null
  order?: {
    event_id: string
    event?: {
      id: string
      title: string
      start_date: string
      end_date: string
      location: string | null
    }
  }
}

interface EventData {
  id: string
  title: string
  start_date: string
  end_date: string
  status: string
  location: string | null
  description: string | null
}

export function EnhancedAttendeeDashboard() {
  const { user } = useAuth()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([])
  const [recommendations, setRecommendations] = useState<EventData[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Fetch tickets
        const { data: ticketsData } = await supabase
          .from("em_tickets")
          .select(`
            id,
            status,
            checked_in,
            qr_code,
            order:em_orders!inner(
              event_id,
              event:em_events(id, title, start_date, end_date, location)
            )
          `)
          .eq("order.user_id", user.id)
          .order("created_at", { ascending: false })

        setTickets((ticketsData as any) || [])

        // Fetch upcoming events
        const eventIds = new Set((ticketsData as any)?.map((t: any) => t.order?.event_id).filter(Boolean))
        const { data: eventsData } = await supabase
          .from("em_events")
          .select("id, title, start_date, end_date, status, location, description")
          .in("id", Array.from(eventIds))
          .gte("start_date", new Date().toISOString())
          .order("start_date", { ascending: true })

        setUpcomingEvents((eventsData as any) || [])

        // Fetch recommendations
        const { data: recsData } = await supabase
          .from("em_events")
          .select("id, title, start_date, end_date, status, location, description")
          .eq("status", "published")
          .gte("start_date", new Date().toISOString())
          .not("id", "in", `(${Array.from(eventIds).join(",") || "null"})`)
          .order("start_date", { ascending: true })
          .limit(6)

        setRecommendations((recsData as any) || [])
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  // Calculate statistics
  const registeredEvents = new Set(tickets.map(t => t.order?.event_id).filter(Boolean)).size
  const activeTickets = tickets.filter(t => !t.checked_in).length
  const upcomingSessions = upcomingEvents.length

  // Dashboard tabs configuration
  const dashboardTabs = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
      content: <OverviewTab 
        loading={loading}
        registeredEvents={registeredEvents}
        activeTickets={activeTickets}
        upcomingSessions={upcomingSessions}
        tickets={tickets}
        upcomingEvents={upcomingEvents}
        user={user}
      />
    },
    {
      id: "tickets",
      title: "My Tickets",
      icon: Ticket,
      content: <TicketsTab loading={loading} tickets={tickets} />
    },
    {
      id: "schedule",
      title: "Schedule",
      icon: Calendar,
      content: <ScheduleTab loading={loading} upcomingEvents={upcomingEvents} />
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: BarChart3,
      content: <RecommendationsTab loading={loading} recommendations={recommendations} />
    },
    {
      id: "networking",
      title: "Networking",
      icon: Users,
      content: <NetworkingTab />
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      content: <SettingsTab user={user} />
    }
  ]

  return (
    <ProfessionalDashboardLayout
      role="attendee"
      tabs={dashboardTabs}
      defaultTab="overview"
      title="My Dashboard"
      description="Your tickets, schedule and recommendations"
    />
  )
}

// Overview Tab Component
function OverviewTab({ loading, registeredEvents, activeTickets, upcomingSessions, tickets, upcomingEvents, user }: any) {
  const userName = user?.user_metadata?.full_name || user?.email || "User"
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {userName}!
              </h2>
              <p className="text-white/80">
                Ready to explore amazing events and connect with like-minded people?
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="secondary">
              <Link href="/events">
                <Plus className="h-4 w-4 mr-2" />
                Browse Events
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/schedule">
                <Calendar className="h-4 w-4 mr-2" />
                View Schedule
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MiniStatisticsCard
          bgColor="primary"
          title={{ text: "Registered Events", fontWeight: "medium" }}
          count={registeredEvents}
          percentage={{ color: "success", text: "+2 this month" }}
          icon={{ color: "info", component: <Calendar className="h-5 w-5" /> }}
          direction="right"
        />
        <MiniStatisticsCard
          bgColor="success"
          title={{ text: "Active Tickets", fontWeight: "medium" }}
          count={activeTickets}
          percentage={{ color: "info", text: "All valid" }}
          icon={{ color: "warning", component: <Ticket className="h-5 w-5" /> }}
          direction="right"
        />
        <MiniStatisticsCard
          bgColor="info"
          title={{ text: "Upcoming Sessions", fontWeight: "medium" }}
          count={upcomingSessions}
          percentage={{ color: "success", text: "Next 30 days" }}
          icon={{ color: "error", component: <Clock className="h-5 w-5" /> }}
          direction="right"
        />
        <MiniStatisticsCard
          bgColor="warning"
          title={{ text: "Recommendations", fontWeight: "medium" }}
          count={6}
          percentage={{ color: "info", text: "For you" }}
          icon={{ color: "success", component: <Star className="h-5 w-5" /> }}
          direction="right"
        />
      </div>

      {/* Upcoming Events */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Events</CardTitle>
          <CardDescription className="text-slate-400">Events you're registered for</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming events</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event: EventData) => (
                <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{event.title}</h4>
                    <p className="text-sm text-slate-400">
                      {format(new Date(event.start_date), "PPP")}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10">
                    <Link href={`/events/${event.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Placeholder tabs (to be implemented)
function TicketsTab({ loading, tickets }: any) {
  return <div className="text-white">Tickets Tab - Coming Soon</div>
}

function ScheduleTab({ loading, upcomingEvents }: any) {
  return <div className="text-white">Schedule Tab - Coming Soon</div>
}

function RecommendationsTab({ loading, recommendations }: any) {
  return <div className="text-white">Recommendations Tab - Coming Soon</div>
}

function NetworkingTab() {
  return <div className="text-white">Networking Tab - Coming Soon</div>
}

function SettingsTab({ user }: any) {
  return <div className="text-white">Settings Tab - Coming Soon</div>
}


'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Calendar, 
  Ticket, 
  Star, 
  Clock, 
  Users, 
  Settings,
  Plus,
  QrCode,
  MapPin,
  TrendingUp,
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import {
  ModernWelcomeSection,
  ModernStatGrid,
  ModernEventGrid,
  ModernActivityFeed,
  ModernQuickActions,
  ModernEmptyState
} from '../modern'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

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

export function ModernAttendeeDashboard() {
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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"
  const userEmail = user?.email
  const userAvatar = user?.user_metadata?.avatar_url

  // Calculate statistics
  const registeredEvents = new Set(tickets.map(t => t.order?.event_id).filter(Boolean)).size
  const activeTickets = tickets.filter(t => !t.checked_in).length
  const upcomingSessions = upcomingEvents.length

  // Stats for KPI cards
  const stats = [
    {
      title: 'Registered Events',
      value: registeredEvents,
      icon: <Calendar className="h-5 w-5" />,
      trend: registeredEvents > 0 ? {
        value: '+2 this month',
        direction: 'up' as const
      } : undefined,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10'
    },
    {
      title: 'Active Tickets',
      value: activeTickets,
      icon: <Ticket className="h-5 w-5" />,
      trend: {
        value: 'All valid',
        direction: 'neutral' as const
      },
      gradient: 'from-emerald-500 to-green-500',
      iconBg: 'bg-emerald-500/10'
    },
    {
      title: 'Upcoming Sessions',
      value: upcomingSessions,
      icon: <Clock className="h-5 w-5" />,
      trend: {
        value: 'Next 30 days',
        direction: 'neutral' as const
      },
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10'
    },
    {
      title: 'Recommendations',
      value: recommendations.length,
      icon: <Star className="h-5 w-5" />,
      trend: recommendations.length > 0 ? {
        value: 'For you',
        direction: 'up' as const
      } : undefined,
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10'
    }
  ]

  // Quick actions
  const quickActions = [
    {
      label: 'Browse Events',
      description: 'Discover new events',
      href: '/events',
      icon: <Plus className="h-5 w-5" />,
      gradient: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-500/10'
    },
    {
      label: 'My Tickets',
      description: 'View your tickets',
      href: '/dashboard/tickets',
      icon: <Ticket className="h-5 w-5" />,
      gradient: 'from-emerald-500 to-green-500',
      iconBg: 'bg-emerald-500/10'
    },
    {
      label: 'Schedule',
      description: 'Check your schedule',
      href: '/dashboard/schedule',
      icon: <Calendar className="h-5 w-5" />,
      gradient: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10'
    },
    {
      label: 'Networking',
      description: 'Connect with others',
      href: '/dashboard/networking',
      icon: <Users className="h-5 w-5" />,
      gradient: 'from-pink-500 to-rose-500',
      iconBg: 'bg-pink-500/10'
    }
  ]

  // Generate activity feed from tickets
  const activities = tickets.slice(0, 10).map(ticket => ({
    id: ticket.id,
    type: ticket.checked_in ? 'check-in' as const : 'ticket' as const,
    title: ticket.checked_in ? 'Checked in to event' : 'Ticket purchased',
    description: ticket.order?.event?.title || 'Event',
    timestamp: new Date()
  }))

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <ModernWelcomeSection
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        description="Ready to explore amazing events and connect with like-minded people?"
        actions={[
          {
            label: 'Browse Events',
            href: '/events',
            icon: <Plus className="h-4 w-4 mr-2" />,
            variant: 'secondary'
          },
          {
            label: 'View Schedule',
            href: '/dashboard/schedule',
            icon: <Calendar className="h-4 w-4 mr-2" />,
            variant: 'outline'
          }
        ]}
      />

      {/* KPI Statistics */}
      <ModernStatGrid stats={stats} loading={loading} />

      {/* Quick Actions */}
      <ModernQuickActions actions={quickActions} title="Quick Actions" />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-700/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events you're registered for</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/events">
                    <Plus className="h-4 w-4 mr-2" />
                    Browse More
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  ))}
                </div>
              ) : upcomingEvents.length === 0 ? (
                <ModernEmptyState
                  icon={<Calendar className="h-12 w-12" />}
                  title="No upcoming events"
                  description="Browse our event catalog to find events that interest you"
                  action={{
                    label: 'Browse Events',
                    href: '/events',
                    icon: <Plus className="h-4 w-4 mr-2" />
                  }}
                />
              ) : (
                <ModernEventGrid
                  events={upcomingEvents}
                  variant="compact"
                  showActions={true}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed - Takes 1 column */}
        <div className="space-y-6">
          <ModernActivityFeed
            activities={activities}
            title="Recent Activity"
            description="Your latest actions"
            maxItems={5}
            loading={loading}
          />
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-slate-200/60 dark:border-slate-700/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  Recommended For You
                </CardTitle>
                <CardDescription>Events you might be interested in</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ModernEventGrid
              events={recommendations.slice(0, 3)}
              variant="default"
              showActions={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


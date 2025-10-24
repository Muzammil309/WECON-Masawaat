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
  ExternalLink,
  ArrowRight,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
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

  // User display info
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userInitials = userName.slice(0, 2).toUpperCase()

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)
        console.log('📊 [Dashboard] Loading data for user:', user.id)

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
        console.log('📊 [Dashboard] Loaded tickets:', ticketsData?.length || 0)

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

  // Stats for KPI cards
  const stats = [
    {
      label: 'Registered Events',
      value: registeredEvents,
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      trend: ('up' as 'up' | 'down' | 'neutral'),
      iconBg: 'bg-blue-100'
    },
    {
      label: 'Active Tickets',
      value: activeTickets,
      icon: <Ticket className="h-5 w-5 text-emerald-600" />,
      trend: ('neutral' as 'up' | 'down' | 'neutral'),
      iconBg: 'bg-emerald-100'
    },
    {
      label: 'Upcoming Sessions',
      value: upcomingSessions,
      icon: <Clock className="h-5 w-5 text-purple-600" />,
      trend: ('neutral' as 'up' | 'down' | 'neutral'),
      iconBg: 'bg-purple-100'
    },
    {
      label: 'Recommendations',
      value: recommendations.length,
      icon: <Star className="h-5 w-5 text-amber-600" />,
      trend: ('up' as 'up' | 'down' | 'neutral'),
      iconBg: 'bg-amber-100'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="space-y-8 p-6">
        {/* Welcome Section - Explicit Light Mode Styling */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={userName} />
                <AvatarFallback className="bg-white/20 text-white text-2xl font-bold backdrop-blur-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-white/90 text-lg">{userEmail}</p>
                <p className="text-white/80 mt-2">Ready to explore amazing events and connect with like-minded people?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-white text-blue-600 hover:bg-white/90 shadow-lg">
                <Link href="/events">
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Events
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/schedule">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Statistics - Explicit Light Mode */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardContent className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 w-12 rounded-xl bg-slate-200" />
                    <Skeleton className="h-4 w-24 bg-slate-200" />
                    <Skeleton className="h-8 w-16 bg-slate-200" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={`inline-flex p-3 rounded-xl ${stat.iconBg}`}>
                      {stat.icon}
                    </div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                      {stat.trend && (
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' :
                          stat.trend === 'down' ? 'text-red-600' :
                          'text-slate-500'
                        }`}>
                          {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions - Explicit Light Mode */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="bg-white border-slate-200 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${action.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                        {action.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{action.label}</p>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">Upcoming Events</CardTitle>
                    <CardDescription className="text-slate-600">Events you're registered for</CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm" className="border-slate-300 text-slate-700">
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
                      <Skeleton key={i} className="h-32 rounded-xl bg-slate-200" />
                    ))}
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No upcoming events</h3>
                    <p className="text-slate-600 mb-4">Browse our event catalog to find events that interest you</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/events">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Events
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 mb-1">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(event.start_date), 'MMM dd, yyyy')}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {event.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button asChild size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                            <Link href={`/events/${event.id}`}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card className="bg-white border-slate-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                <CardDescription className="text-slate-600">Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 rounded-lg bg-slate-200" />
                    ))}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'check-in' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {activity.type === 'check-in' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Ticket className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                          <p className="text-xs text-slate-600 truncate">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-slate-900">Recommended For You</CardTitle>
              </div>
              <CardDescription className="text-slate-600">Events you might be interested in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommendations.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-4 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 bg-white">
                    <h4 className="font-semibold text-slate-900 mb-2">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.start_date), 'MMM dd, yyyy')}
                    </div>
                    <Button asChild size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Link href={`/events/${event.id}`}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


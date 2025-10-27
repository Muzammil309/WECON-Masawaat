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
  TrendingUp,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Plus,
  Bell,
  Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { format } from 'date-fns'

interface TicketData {
  id: string
  status: string
  checked_in: boolean
  order?: {
    event?: {
      id: string
      title: string
      start_date: string
      end_date: string
      location?: string
    }
  }
}

interface EventData {
  id: string
  title: string
  start_date: string
  end_date: string
  location?: string
  description?: string
}

export function ProfessionalModernDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<EventData[]>([])

  // User display info
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  useEffect(() => {
    if (!user) return

    const loadDashboardData = async () => {
      console.log('📊 [Professional Dashboard] Loading data for user:', user.id)
      setLoading(true)

      try {
        const supabase = createClient()

        // Load tickets
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('em_tickets')
          .select(`
            id,
            status,
            checked_in,
            order:em_orders!inner(
              event:em_events(
                id,
                title,
                start_date,
                end_date,
                location
              )
            )
          `)
          .eq('order.user_id', user.id)
          .order('created_at', { ascending: false })

        if (ticketsError) {
          console.error('❌ [Professional Dashboard] Error loading tickets:', ticketsError)
        } else {
          setTickets(ticketsData || [])
          console.log('✅ [Professional Dashboard] Loaded tickets:', ticketsData?.length || 0)
        }

        // Extract unique events from tickets
        const mappedEvents = ticketsData?.map((t: TicketData) => t.order?.event) || []
        const filteredEvents = mappedEvents.filter((e: EventData | undefined): e is EventData => e !== null && e !== undefined)
        const uniqueEvents = filteredEvents.filter((e: EventData, i: number, arr: EventData[]) =>
          arr.findIndex((ev: EventData) => ev.id === e.id) === i
        )
        const futureEvents = uniqueEvents.filter((e: EventData) => new Date(e.start_date) > new Date())
        const events = futureEvents.sort((a: EventData, b: EventData) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
        )

        setUpcomingEvents(events)
        console.log('✅ [Professional Dashboard] Loaded upcoming events:', events.length)

      } catch (error) {
        console.error('❌ [Professional Dashboard] Error:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  // Calculate statistics
  const stats = [
    {
      label: 'Registered Events',
      value: upcomingEvents.length,
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      trend: upcomingEvents.length > 0 ? 'up' : 'neutral',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Tickets',
      value: tickets.filter(t => t.status === 'active').length,
      icon: <Ticket className="h-5 w-5 text-purple-600" />,
      trend: 'neutral',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      label: 'Checked In',
      value: tickets.filter(t => t.checked_in).length,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      trend: tickets.filter(t => t.checked_in).length > 0 ? 'up' : 'neutral',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'Total Tickets',
      value: tickets.length,
      icon: <BarChart3 className="h-5 w-5 text-orange-600" />,
      trend: tickets.length > 0 ? 'up' : 'neutral',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  const quickActions = [
    {
      title: 'Browse Events',
      description: 'Discover new events',
      icon: <Sparkles className="h-5 w-5" />,
      href: '/events',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'My Tickets',
      description: 'View your tickets',
      icon: <Ticket className="h-5 w-5" />,
      href: '/tickets',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Schedule',
      description: 'Check your schedule',
      icon: <Clock className="h-5 w-5" />,
      href: '/schedule',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Networking',
      description: 'Connect with others',
      icon: <Users className="h-5 w-5" />,
      href: '/networking',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              </Button>
              <Avatar className="h-9 w-9 border-2 border-slate-200">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 shadow-xl">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
            <div className="relative z-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="mb-2 text-3xl font-bold text-white">
                    Welcome back, {userName}!
                  </h2>
                  <p className="text-lg text-white/90">{userEmail}</p>
                  <p className="mt-2 text-white/80">
                    Ready to explore amazing events and connect with like-minded people?
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button asChild className="bg-white text-blue-600 hover:bg-white/90 shadow-lg">
                    <Link href="/events">
                      <Plus className="mr-2 h-4 w-4" />
                      Browse Events
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Metrics */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Overview</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Card key={index} className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    {loading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`inline-flex rounded-xl p-3 ${stat.bgColor}`}>
                          {stat.icon}
                        </div>
                        <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                          {stat.trend === 'up' && (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="group cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`rounded-xl p-3 ${action.bgColor} ${action.color} transition-transform group-hover:scale-110`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">{action.title}</h4>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Upcoming Events - 2 columns */}
            <div className="lg:col-span-2">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">Upcoming Events</CardTitle>
                      <CardDescription className="text-slate-600">Events you're registered for</CardDescription>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/events">
                        Browse More
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Separator />
                        </div>
                      ))}
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingEvents.slice(0, 5).map((event) => (
                        <div key={event.id}>
                          <Link href={`/events/${event.id}`} className="group block">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0">
                                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                                  <span className="text-xs font-medium">
                                    {format(new Date(event.start_date), 'MMM')}
                                  </span>
                                  <span className="text-lg font-bold">
                                    {format(new Date(event.start_date), 'd')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {event.title}
                                </h4>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {format(new Date(event.start_date), 'MMM d, yyyy • h:mm a')}
                                  </span>
                                  {event.location && (
                                    <span className="flex items-center gap-1">
                                      <span className="text-slate-400">•</span>
                                      {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                          </Link>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 rounded-full bg-slate-100 p-6">
                        <Calendar className="h-12 w-12 text-slate-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">No upcoming events</h3>
                      <p className="mb-6 text-sm text-slate-600">
                        Browse our event catalog to find events that interest you
                      </p>
                      <Button asChild>
                        <Link href="/events">
                          <Plus className="mr-2 h-4 w-4" />
                          Browse Events
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity - 1 column */}
            <div className="lg:col-span-1">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-xl font-bold text-slate-900">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-600">Your latest actions</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : tickets.length > 0 ? (
                    <div className="space-y-4">
                      {tickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              ticket.checked_in ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              {ticket.checked_in ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Ticket className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              {ticket.checked_in ? 'Checked in to event' : 'Ticket purchased'}
                            </p>
                            <p className="text-sm text-slate-600 truncate">
                              {ticket.order?.event?.title || 'Event'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-4">
                        <Star className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { 
  Users, 
  Ticket, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  MessageCircle,
  HelpCircle,
  UserCheck
} from 'lucide-react'

interface AnalyticsData {
  totalEvents: number
  totalTicketsSold: number
  totalRevenue: number
  totalAttendees: number
  checkedInAttendees: number
  totalMessages: number
  totalQuestions: number
  ticketTierSales: Array<{ name: string; sold: number; revenue: number }>
  dailyRegistrations: Array<{ date: string; registrations: number }>
  eventStatusBreakdown: Array<{ status: string; count: number }>
}

interface AnalyticsDashboardProps {
  organizerId?: string
  eventId?: string
}

export function AnalyticsDashboard({ organizerId, eventId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [organizerId, eventId])

  const fetchAnalytics = async () => {
    try {
      const data: AnalyticsData = {
        totalEvents: 0,
        totalTicketsSold: 0,
        totalRevenue: 0,
        totalAttendees: 0,
        checkedInAttendees: 0,
        totalMessages: 0,
        totalQuestions: 0,
        ticketTierSales: [],
        dailyRegistrations: [],
        eventStatusBreakdown: []
      }

      // Build base query filters
      let eventFilter = ''
      if (eventId) {
        eventFilter = `event_id=eq.${eventId}`
      } else if (organizerId) {
        eventFilter = `organizer_id=eq.${organizerId}`
      }

      // Total Events
      if (organizerId && !eventId) {
        const { count } = await supabase
          .from('em_events')
          .select('*', { count: 'exact', head: true })
          .eq('organizer_id', organizerId)
        data.totalEvents = count || 0
      } else {
        data.totalEvents = eventId ? 1 : 0
      }

      // Tickets and Revenue
      let ticketsQuery = supabase
        .from('em_tickets')
        .select(`
          *,
          ticket_tier:em_ticket_tiers(name, price),
          order:em_orders(event_id, event:em_events(organizer_id))
        `)

      if (eventId) {
        ticketsQuery = ticketsQuery.eq('order.event_id', eventId)
      } else if (organizerId) {
        ticketsQuery = ticketsQuery.eq('order.event.organizer_id', organizerId)
      }

      const { data: tickets } = await ticketsQuery

      if (tickets) {
        data.totalTicketsSold = tickets.length
        data.totalRevenue = tickets.reduce((sum, ticket) => 
          sum + (ticket.ticket_tier?.price || 0), 0
        )
        data.checkedInAttendees = tickets.filter(t => t.checked_in).length
        
        // Unique attendees
        const uniqueAttendees = new Set(tickets.map(t => t.user_id))
        data.totalAttendees = uniqueAttendees.size

        // Ticket tier breakdown
        const tierSales = tickets.reduce((acc, ticket) => {
          const tierName = ticket.ticket_tier?.name || 'Unknown'
          const price = ticket.ticket_tier?.price || 0
          
          if (!acc[tierName]) {
            acc[tierName] = { name: tierName, sold: 0, revenue: 0 }
          }
          acc[tierName].sold += 1
          acc[tierName].revenue += price
          return acc
        }, {} as Record<string, { name: string; sold: number; revenue: number }>)

        data.ticketTierSales = Object.values(tierSales)
      }

      // Messages
      let messagesQuery = supabase
        .from('em_messages')
        .select('*', { count: 'exact', head: true })

      if (eventId) {
        messagesQuery = messagesQuery.eq('event_id', eventId)
      } else if (organizerId) {
        // This would need a join to filter by organizer
        const { data: organizerEvents } = await supabase
          .from('em_events')
          .select('id')
          .eq('organizer_id', organizerId)
        
        if (organizerEvents) {
          const eventIds = organizerEvents.map(e => e.id)
          messagesQuery = messagesQuery.in('event_id', eventIds)
        }
      }

      const { count: messageCount } = await messagesQuery
      data.totalMessages = messageCount || 0

      // Questions
      let questionsQuery = supabase
        .from('em_qa_questions')
        .select('*', { count: 'exact', head: true })

      if (eventId) {
        // Need to join through sessions
        const { data: eventSessions } = await supabase
          .from('em_sessions')
          .select('id')
          .eq('event_id', eventId)
        
        if (eventSessions) {
          const sessionIds = eventSessions.map(s => s.id)
          questionsQuery = questionsQuery.in('session_id', sessionIds)
        }
      }

      const { count: questionCount } = await questionsQuery
      data.totalQuestions = questionCount || 0

      // Event status breakdown (only for organizer view)
      if (organizerId && !eventId) {
        const { data: events } = await supabase
          .from('em_events')
          .select('status')
          .eq('organizer_id', organizerId)

        if (events) {
          const statusBreakdown = events.reduce((acc, event) => {
            const status = event.status || 'draft'
            acc[status] = (acc[status] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          data.eventStatusBreakdown = Object.entries(statusBreakdown).map(([status, count]) => ({
            status,
            count
          }))
        }
      }

      setAnalytics(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  const checkInRate = analytics.totalAttendees > 0 
    ? (analytics.checkedInAttendees / analytics.totalAttendees) * 100 
    : 0

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalTicketsSold}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalAttendees} unique attendees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkInRate.toFixed(1)}%</div>
            <Progress value={checkInRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Q&A Questions</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalQuestions}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ticket Tier Sales */}
        {analytics.ticketTierSales.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales by Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.ticketTierSales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Event Status Breakdown */}
        {analytics.eventStatusBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Events by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.eventStatusBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.eventStatusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

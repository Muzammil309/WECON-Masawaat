'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, DollarSign, Users, Ticket, Calendar, Download, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format, subDays } from 'date-fns'

interface AnalyticsData {
  totalRevenue: number
  totalTicketsSold: number
  totalAttendees: number
  activeEvents: number
  averageAttendanceRate: number
  revenueGrowth: number
  topEvents: Array<{
    id: string
    name: string
    revenue: number
    ticketsSold: number
    attendanceRate: number
  }>
}

export function AnalyticsContent() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      console.log('📊 Fetching analytics data...')
      const supabase = createClient()

      // Calculate date range
      const startDate = subDays(new Date(), parseInt(dateRange))

      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from('em_events')
        .select('*')
        .gte('created_at', startDate.toISOString())

      if (eventsError) throw eventsError

      // Fetch tickets
      const { data: tickets, error: ticketsError } = await supabase
        .from('em_tickets')
        .select(`
          *,
          em_ticket_tiers!inner (
            price
          ),
          check_in_logs (
            checked_in_at
          )
        `)
        .gte('created_at', startDate.toISOString())

      if (ticketsError) throw ticketsError

      // Calculate total revenue
      const totalRevenue = tickets?.reduce((sum: number, ticket: any) => {
        return sum + (ticket.em_ticket_tiers?.price || 0)
      }, 0) || 0

      // Calculate total tickets sold
      const totalTicketsSold = tickets?.length || 0

      // Get unique attendees
      const uniqueAttendees = new Set(tickets?.map((t: any) => t.user_id)).size

      // Get active events
      const activeEvents = events?.filter((e: any) => e.status === 'published').length || 0

      // Calculate average attendance rate
      const checkedInTickets = tickets?.filter((t: any) => t.check_in_logs && t.check_in_logs.length > 0).length || 0
      const averageAttendanceRate = totalTicketsSold > 0 ? (checkedInTickets / totalTicketsSold) * 100 : 0

      // Calculate revenue by event for top events
      const eventRevenue = new Map<string, { name: string; revenue: number; ticketsSold: number; checkedIn: number }>()

      tickets?.forEach((ticket: any) => {
        const eventId = ticket.event_id
        const event = events?.find((e: any) => e.id === eventId)
        if (!event) return

        const current = eventRevenue.get(eventId) || {
          name: event.name,
          revenue: 0,
          ticketsSold: 0,
          checkedIn: 0
        }

        current.revenue += ticket.em_ticket_tiers?.price || 0
        current.ticketsSold += 1
        if (ticket.check_in_logs && ticket.check_in_logs.length > 0) {
          current.checkedIn += 1
        }

        eventRevenue.set(eventId, current)
      })

      // Get top 5 events by revenue
      const topEvents = Array.from(eventRevenue.entries())
        .map(([id, data]) => ({
          id,
          name: data.name,
          revenue: data.revenue,
          ticketsSold: data.ticketsSold,
          attendanceRate: data.ticketsSold > 0 ? (data.checkedIn / data.ticketsSold) * 100 : 0
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)

      const analyticsData: AnalyticsData = {
        totalRevenue,
        totalTicketsSold,
        totalAttendees: uniqueAttendees,
        activeEvents,
        averageAttendanceRate,
        revenueGrowth: 12.5, // Mock data - would need historical comparison
        topEvents
      }

      console.log('✅ Analytics data loaded:', analyticsData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('❌ Error fetching analytics:', err)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    toast.info('Report export feature coming soon!')
  }

  if (loading) {
    return (
      <div className="space-y-[24px] mt-[28px]">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[200px] w-full rounded-[20px]" />
        ))}
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="vision-glass-card p-[48px] text-center mt-[28px]">
        <BarChart3 className="h-[64px] w-[64px] text-gray-400 mx-auto mb-[16px]" />
        <h3 className="text-[20px] font-bold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          No Analytics Data
        </h3>
        <p className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Unable to load analytics data
        </p>
      </div>
    )
  }

  return (
    <div className="mt-[28px] space-y-[24px]">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex gap-[12px]">
          {(['7', '30', '90'] as const).map((days) => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className="px-[20px] py-[12px] rounded-[12px] text-sm font-medium transition-all"
              style={{
                background: dateRange === days
                  ? 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)'
                  : 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                color: '#fff',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            >
              Last {days} Days
            </button>
          ))}
        </div>

        <button
          onClick={handleExportReport}
          className="px-[20px] py-[12px] rounded-[12px] text-sm font-medium transition-all flex items-center gap-[8px]"
          style={{
            background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
            color: '#fff',
          }}
        >
          <Download className="h-[16px] w-[16px]" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <DollarSign className="h-[24px] w-[24px] text-green-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Revenue
            </span>
          </div>
          <p className="text-[32px] font-bold text-white mb-[4px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            PKR {analytics.totalRevenue.toLocaleString()}
          </p>
          <div className="flex items-center gap-[4px] text-[12px] text-green-400">
            <TrendingUp className="h-[14px] w-[14px]" />
            <span>+{analytics.revenueGrowth}% from last period</span>
          </div>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Ticket className="h-[24px] w-[24px] text-purple-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Tickets Sold
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {analytics.totalTicketsSold}
          </p>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Users className="h-[24px] w-[24px] text-blue-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Attendees
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {analytics.totalAttendees}
          </p>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Calendar className="h-[24px] w-[24px] text-orange-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Active Events
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {analytics.activeEvents}
          </p>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="vision-glass-card p-[24px]">
        <h3 className="text-[20px] font-bold text-white mb-[16px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Average Attendance Rate
        </h3>
        <div className="flex items-center gap-[16px]">
          <div className="flex-1 h-[12px] bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${analytics.averageAttendanceRate}%`,
                background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
              }}
            />
          </div>
          <span className="text-[24px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {analytics.averageAttendanceRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Top Performing Events */}
      <div className="vision-glass-card p-[24px]">
        <h3 className="text-[20px] font-bold text-white mb-[20px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Top Performing Events
        </h3>
        {analytics.topEvents.length === 0 ? (
          <p className="text-[14px] text-gray-400 text-center py-[32px]">No events data available</p>
        ) : (
          <div className="space-y-[16px]">
            {analytics.topEvents.map((event, index) => (
              <div key={event.id} className="flex items-center gap-[16px] p-[16px] rounded-[12px] bg-white/5">
                <div
                  className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[18px] font-bold text-white"
                  style={{
                    background: index === 0
                      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                      : index === 1
                      ? 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)'
                      : index === 2
                      ? 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'
                      : 'rgba(26, 31, 55, 0.5)'
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-[16px] font-bold text-white mb-[4px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    {event.name}
                  </h4>
                  <div className="flex gap-[16px] text-[12px] text-gray-400">
                    <span>Revenue: PKR {event.revenue.toLocaleString()}</span>
                    <span>Tickets: {event.ticketsSold}</span>
                    <span>Attendance: {event.attendanceRate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        <div className="vision-glass-card p-[24px]">
          <h3 className="text-[20px] font-bold text-white mb-[16px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            Revenue Trend
          </h3>
          <div className="h-[300px] flex items-center justify-center bg-white/5 rounded-[12px]">
            <p className="text-gray-400 text-[14px]">Chart visualization coming soon</p>
          </div>
        </div>

        <div className="vision-glass-card p-[24px]">
          <h3 className="text-[20px] font-bold text-white mb-[16px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            Ticket Sales by Tier
          </h3>
          <div className="h-[300px] flex items-center justify-center bg-white/5 rounded-[12px]">
            <p className="text-gray-400 text-[14px]">Chart visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}


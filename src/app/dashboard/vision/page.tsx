'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionStatCard } from '@/components/vision-ui/cards/stat-card'
import { VisionProjectsTable } from '@/components/vision-ui/tables/projects-table'
import { VisionOrdersTimeline } from '@/components/vision-ui/timeline/orders-timeline'
import { Wallet, Globe, FileText, ShoppingCart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardStats {
  totalRevenue: number
  activeAttendeesToday: number
  newRegistrations: number
  totalTicketsSold: number
}

interface Event {
  id: string
  title: string
  attendee_count: number
  ticket_price: number
  start_date: string
  end_date: string
}

interface Activity {
  id: string
  title: string
  description: string
  timestamp: Date
  type: 'success' | 'order' | 'payment' | 'notification'
}

export default function VisionDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeAttendeesToday: 0,
    newRegistrations: 0,
    totalTicketsSold: 0,
  })
  const [events, setEvents] = useState<Event[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🔒 Vision Dashboard: User not authenticated, redirecting to login')
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!user) {
      console.log('⏳ Vision Dashboard: Waiting for authentication...')
      return
    }

    async function fetchDashboardData() {
      try {
        console.log('🔄 Vision Dashboard: Fetching data for user:', user?.id)
        const supabase = createClient()

        // Fetch total revenue from orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('em_orders')
          .select('total_amount')
          .eq('status', 'completed')

        if (ordersError) {
          console.error('❌ Error fetching orders:', ordersError)
        }

        const totalRevenue = ordersData?.reduce((sum: number, order: { total_amount: number }) => sum + (order.total_amount || 0), 0) || 0

        // Fetch active attendees today (checked in today)
        const today = new Date().toISOString().split('T')[0]
        const { data: checkInsData, error: checkInsError } = await supabase
          .from('em_tickets')
          .select('id')
          .eq('checked_in', true)
          .gte('checked_in_at', `${today}T00:00:00`)

        if (checkInsError) {
          console.error('❌ Error fetching check-ins:', checkInsError)
        }

        const activeAttendeesToday = checkInsData?.length || 0

        // Fetch new registrations (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const { data: profilesData, error: profilesError } = await supabase
          .from('em_profiles')
          .select('id')
          .gte('created_at', thirtyDaysAgo.toISOString())

        if (profilesError) {
          console.error('❌ Error fetching profiles:', profilesError)
        }

        const newRegistrations = profilesData?.length || 0

        // Fetch total tickets sold
        const { data: ticketsData, error: ticketsError } = await supabase
          .from('em_tickets')
          .select('id')

        if (ticketsError) {
          console.error('❌ Error fetching tickets:', ticketsError)
        }

        const totalTicketsSold = ticketsData?.length || 0

        // Fetch events for projects table
        const { data: eventsData, error: eventsError } = await supabase
          .from('em_events')
          .select('id, title, start_date, end_date')
          .order('start_date', { ascending: false })
          .limit(5)

        if (eventsError) {
          console.error('❌ Error fetching events:', eventsError)
        }

        // For each event, count attendees
        const eventsWithAttendees = await Promise.all(
          (eventsData || []).map(async (event: { id: string; title: string; start_date: string; end_date: string }) => {
            const { data: ticketsForEvent } = await supabase
              .from('em_tickets')
              .select('id')
              .eq('event_id', event.id)

            return {
              ...event,
              attendee_count: ticketsForEvent?.length || 0,
              ticket_price: 50, // Default price, you can fetch from event details
            }
          })
        )

        // Fetch recent activities (orders and check-ins)
        const { data: recentOrders, error: recentOrdersError } = await supabase
          .from('em_orders')
          .select('id, created_at, total_amount, status')
          .order('created_at', { ascending: false })
          .limit(3)

        if (recentOrdersError) {
          console.error('❌ Error fetching recent orders:', recentOrdersError)
        }

        const { data: recentCheckIns, error: recentCheckInsError } = await supabase
          .from('em_tickets')
          .select('id, checked_in_at')
          .eq('checked_in', true)
          .order('checked_in_at', { ascending: false })
          .limit(2)

        if (recentCheckInsError) {
          console.error('❌ Error fetching recent check-ins:', recentCheckInsError)
        }

        // Combine activities
        const combinedActivities: Activity[] = [
          ...(recentOrders || []).map((order: { id: string; created_at: string; total_amount: number; status: string }) => ({
            id: order.id,
            title: 'New order',
            description: `Order #${order.id.slice(0, 8)} - $${order.total_amount}`,
            timestamp: new Date(order.created_at),
            type: 'order' as const,
          })),
          ...(recentCheckIns || []).map((checkIn: { id: string; checked_in_at: string }) => ({
            id: checkIn.id,
            title: 'Attendee checked in',
            description: `Ticket #${checkIn.id.slice(0, 8)}`,
            timestamp: new Date(checkIn.checked_in_at),
            type: 'success' as const,
          })),
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

        setStats({
          totalRevenue,
          activeAttendeesToday,
          newRegistrations,
          totalTicketsSold,
        })
        setEvents(eventsWithAttendees)
        setActivities(combinedActivities)

        console.log('✅ Vision Dashboard: Data loaded successfully')
      } catch (error) {
        console.error('❌ Vision Dashboard: Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  // Calculate event completion percentage
  const projectsData = events.map((event) => {
    const now = new Date()
    const start = new Date(event.start_date)
    const end = new Date(event.end_date)
    
    let completion = 0
    if (now > end) {
      completion = 100
    } else if (now >= start && now <= end) {
      const total = end.getTime() - start.getTime()
      const elapsed = now.getTime() - start.getTime()
      completion = Math.round((elapsed / total) * 100)
    }

    return {
      id: event.id,
      name: event.title,
      attendeeCount: event.attendee_count,
      budget: `$${event.ticket_price * event.attendee_count}`,
      completion,
    }
  })

  // Show loading state while checking authentication
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
      {/* Sidebar */}
      <VisionSidebar />

      {/* Main Content */}
      <div className="ml-[284px] p-[20px]">
        {/* Top Navigation */}
        <VisionTopbar title="Dashboard" breadcrumb="Pages" />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] mb-[24px]">
          <VisionStatCard
            label="Today's Money"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            trend="+55%"
            trendPositive={true}
            icon={Wallet}
          />
          <VisionStatCard
            label="Today's Users"
            value={stats.activeAttendeesToday.toLocaleString()}
            trend="+5%"
            trendPositive={true}
            icon={Globe}
          />
          <VisionStatCard
            label="New Clients"
            value={`+${stats.newRegistrations.toLocaleString()}`}
            trend="-14%"
            trendPositive={false}
            icon={FileText}
          />
          <VisionStatCard
            label="Total Sales"
            value={stats.totalTicketsSold.toLocaleString()}
            trend="+8%"
            trendPositive={true}
            icon={ShoppingCart}
          />
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          {/* Projects Table (2/3 width) */}
          <div className="lg:col-span-2">
            <VisionProjectsTable projects={projectsData} loading={loading} />
          </div>

          {/* Orders Timeline (1/3 width) */}
          <div className="lg:col-span-1">
            <VisionOrdersTimeline items={activities} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserCheck, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface KPIMetric {
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  color: string
}

export function KPIMetrics({ eventId }: { eventId?: string }) {
  const [metrics, setMetrics] = useState<KPIMetric[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
    
    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel('kpi-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'em_tickets' },
        () => fetchMetrics()
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [eventId])

  const fetchMetrics = async () => {
    try {
      const supabase = createClient()
      
      // Fetch total registrations
      const { count: totalRegistrations } = await supabase
        .from('em_tickets')
        .select('*', { count: 'exact', head: true })
      
      // Fetch checked-in count
      const { count: checkedInCount } = await supabase
        .from('em_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('checked_in', true)
      
      // Fetch currently onsite (checked in within last 12 hours)
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      const { count: currentlyOnsite } = await supabase
        .from('em_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('checked_in', true)
        .gte('checked_in_at', twelveHoursAgo)
      
      // Calculate revenue (mock for now)
      const revenue = (totalRegistrations || 0) * 299 // Average ticket price
      
      // Calculate check-in rate
      const checkInRate = totalRegistrations 
        ? Math.round((checkedInCount || 0) / totalRegistrations * 100)
        : 0

      setMetrics([
        {
          label: 'Total Registrations',
          value: totalRegistrations || 0,
          change: 12.5,
          trend: 'up',
          icon: <Users className="h-5 w-5" />,
          color: 'text-blue-500'
        },
        {
          label: 'Checked In',
          value: checkedInCount || 0,
          change: checkInRate,
          trend: checkInRate > 50 ? 'up' : 'neutral',
          icon: <UserCheck className="h-5 w-5" />,
          color: 'text-green-500'
        },
        {
          label: 'Currently Onsite',
          value: currentlyOnsite || 0,
          change: 8.2,
          trend: 'up',
          icon: <Activity className="h-5 w-5" />,
          color: 'text-purple-500'
        },
        {
          label: 'Revenue',
          value: `$${(revenue / 1000).toFixed(1)}k`,
          change: 15.3,
          trend: 'up',
          icon: <DollarSign className="h-5 w-5" />,
          color: 'text-emerald-500'
        }
      ])
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching KPI metrics:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-5 w-5 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-20 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card 
          key={index}
          className="relative overflow-hidden border-slate-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
          
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {metric.label}
            </CardTitle>
            <div className={`${metric.color} bg-slate-50 p-2 rounded-lg`}>
              {metric.icon}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {metric.value}
            </div>
            
            <div className="flex items-center text-xs">
              {metric.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : metric.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              ) : (
                <Clock className="h-3 w-3 text-slate-400 mr-1" />
              )}
              <span className={
                metric.trend === 'up' 
                  ? 'text-green-600 font-medium' 
                  : metric.trend === 'down'
                  ? 'text-red-600 font-medium'
                  : 'text-slate-500'
              }>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </span>
              <span className="text-slate-500 ml-1">vs last event</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


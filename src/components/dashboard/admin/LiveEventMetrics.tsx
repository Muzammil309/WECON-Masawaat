'use client'

import React from 'react'
import { useLiveEventMetrics } from '@/lib/hooks/useEventMetrics'
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp,
  RefreshCw,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface LiveEventMetricsProps {
  eventId: string
}

export function LiveEventMetrics({ eventId }: LiveEventMetricsProps) {
  const { 
    total_checked_in,
    currently_onsite,
    total_revenue,
    active_sessions,
    check_in_rate,
    peak_concurrent,
    last_updated,
    loading,
    error,
    refresh
  } = useLiveEventMetrics(eventId)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="font-semibold">Error loading metrics</p>
            <p className="text-sm mt-1">{error}</p>
            <Button 
              onClick={() => refresh()} 
              variant="outline" 
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Live Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Live Event Dashboard</h2>
          <Badge 
            variant="outline" 
            className="bg-green-500/20 text-green-400 border-green-500/50 animate-pulse"
          >
            <div className="h-2 w-2 rounded-full bg-green-400 mr-2" />
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Updated {formatTime(last_updated)}
          </div>
          <Button
            onClick={() => refresh()}
            variant="outline"
            size="sm"
            disabled={loading}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Checked In */}
        <MetricCard
          title="Total Checked In"
          value={total_checked_in}
          icon={<Users className="h-5 w-5" />}
          trend={check_in_rate > 0 ? `${check_in_rate.toFixed(1)}% rate` : undefined}
          trendUp={check_in_rate > 50}
          gradient="from-blue-500 to-cyan-500"
          loading={loading}
        />

        {/* Currently Onsite */}
        <MetricCard
          title="Currently Onsite"
          value={currently_onsite}
          icon={<Activity className="h-5 w-5" />}
          subtitle={`Peak: ${peak_concurrent}`}
          gradient="from-green-500 to-emerald-500"
          loading={loading}
          pulse
        />

        {/* Total Revenue */}
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(total_revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          gradient="from-purple-500 to-pink-500"
          loading={loading}
        />

        {/* Active Sessions */}
        <MetricCard
          title="Active Sessions"
          value={active_sessions}
          icon={<TrendingUp className="h-5 w-5" />}
          subtitle="Live now"
          gradient="from-orange-500 to-red-500"
          loading={loading}
        />
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  subtitle?: string
  gradient: string
  loading?: boolean
  pulse?: boolean
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  trendUp,
  subtitle,
  gradient,
  loading,
  pulse
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />
      
      <CardContent className="relative pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-10 w-32 bg-white/10 animate-pulse rounded" />
              ) : (
                <h3 className={`text-3xl font-bold text-white ${pulse ? 'animate-pulse' : ''}`}>
                  {value}
                </h3>
              )}
            </div>
            {(trend || subtitle) && (
              <div className="mt-2 flex items-center gap-2">
                {trend && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      trendUp 
                        ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                        : 'bg-slate-500/20 text-slate-400 border-slate-500/50'
                    }`}
                  >
                    {trend}
                  </Badge>
                )}
                {subtitle && (
                  <span className="text-xs text-slate-400">{subtitle}</span>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


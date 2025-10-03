'use client'

import { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ModernKPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
  gradient?: string
  iconBg?: string
  loading?: boolean
  className?: string
}

export function ModernKPICard({
  title,
  value,
  icon,
  trend,
  gradient = 'from-blue-500 to-cyan-500',
  iconBg = 'bg-blue-500/10',
  loading = false,
  className
}: ModernKPICardProps) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden border-slate-200/60 dark:border-slate-700/60">
        <CardContent className="p-6">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  return (
    <Card className={cn(
      "relative overflow-hidden border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group",
      className
    )}>
      {/* Gradient Background Accent */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity duration-300",
        gradient
      )} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
          </div>
          
          {/* Icon */}
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
            iconBg
          )}>
            <div className="text-slate-700 dark:text-white">
              {icon}
            </div>
          </div>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.direction === 'up' && "text-emerald-600 dark:text-emerald-400",
              trend.direction === 'down' && "text-red-600 dark:text-red-400",
              trend.direction === 'neutral' && "text-slate-600 dark:text-slate-400"
            )}>
              <TrendIcon className="h-4 w-4" />
              <span>{trend.value}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ModernGradientKPICardProps {
  title: string
  value: string | number
  icon: ReactNode
  subtitle?: string
  gradient: string
  loading?: boolean
  pulse?: boolean
  className?: string
}

export function ModernGradientKPICard({
  title,
  value,
  icon,
  subtitle,
  gradient,
  loading = false,
  pulse = false,
  className
}: ModernGradientKPICardProps) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-white/20 rounded w-1/2" />
            <div className="h-8 bg-white/20 rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      "relative overflow-hidden border-0 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
      className
    )}>
      {/* Gradient Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
      
      {pulse && (
        <div className="absolute top-4 right-4">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
      )}
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-white/80 mb-1">
              {title}
            </p>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-white/70 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ModernStatGridProps {
  stats: Array<{
    title: string
    value: string | number
    icon: ReactNode
    trend?: {
      value: string
      direction: 'up' | 'down' | 'neutral'
    }
    gradient?: string
    iconBg?: string
  }>
  loading?: boolean
  className?: string
}

export function ModernStatGrid({ stats, loading = false, className }: ModernStatGridProps) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat, index) => (
        <ModernKPICard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          gradient={stat.gradient}
          iconBg={stat.iconBg}
          loading={loading}
        />
      ))}
    </div>
  )
}


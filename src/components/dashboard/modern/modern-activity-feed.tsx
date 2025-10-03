'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { 
  UserCheck, 
  Ticket, 
  Calendar, 
  MessageSquare, 
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Activity
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'check-in' | 'ticket' | 'event' | 'message' | 'notification' | 'success' | 'warning' | 'info'
  title: string
  description?: string
  timestamp: string | Date
  user?: {
    name: string
    avatar?: string
  }
  metadata?: Record<string, any>
}

interface ModernActivityFeedProps {
  activities: ActivityItem[]
  title?: string
  description?: string
  maxItems?: number
  showTimestamp?: boolean
  loading?: boolean
  className?: string
}

const activityConfig = {
  'check-in': {
    icon: UserCheck,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  },
  'ticket': {
    icon: Ticket,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  'event': {
    icon: Calendar,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  'message': {
    icon: MessageSquare,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    borderColor: 'border-pink-200 dark:border-pink-800'
  },
  'notification': {
    icon: Bell,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  'success': {
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  },
  'warning': {
    icon: AlertCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-200 dark:border-amber-800'
  },
  'info': {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-200 dark:border-blue-800'
  }
}

export function ModernActivityFeed({
  activities,
  title = 'Recent Activity',
  description,
  maxItems = 10,
  showTimestamp = true,
  loading = false,
  className
}: ModernActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)

  if (loading) {
    return (
      <Card className={cn("border-slate-200/60 dark:border-slate-700/60", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (displayedActivities.length === 0) {
    return (
      <Card className={cn("border-slate-200/60 dark:border-slate-700/60", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("border-slate-200/60 dark:border-slate-700/60", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge variant="secondary" className="text-xs">
            {activities.length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity, index) => {
            const config = activityConfig[activity.type] || activityConfig.info
            const Icon = config.icon
            const timestamp = typeof activity.timestamp === 'string' 
              ? new Date(activity.timestamp) 
              : activity.timestamp

            return (
              <div
                key={activity.id}
                className={cn(
                  "flex gap-4 p-3 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
                  config.borderColor,
                  "bg-white dark:bg-slate-800/50"
                )}
              >
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                  config.bgColor
                )}>
                  <Icon className={cn("h-5 w-5", config.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                        {activity.title}
                      </h4>
                      {activity.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                      {activity.user && (
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          by {activity.user.name}
                        </p>
                      )}
                    </div>
                    {showTimestamp && (
                      <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {activities.length > maxItems && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
              View all {activities.length} activities
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ModernTimelineActivityProps {
  activities: ActivityItem[]
  title?: string
  description?: string
  className?: string
}

export function ModernTimelineActivity({
  activities,
  title = 'Activity Timeline',
  description,
  className
}: ModernTimelineActivityProps) {
  return (
    <Card className={cn("border-slate-200/60 dark:border-slate-700/60", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />

          {/* Timeline Items */}
          <div className="space-y-6">
            {activities.map((activity, index) => {
              const config = activityConfig[activity.type] || activityConfig.info
              const Icon = config.icon
              const timestamp = typeof activity.timestamp === 'string' 
                ? new Date(activity.timestamp) 
                : activity.timestamp

              return (
                <div key={activity.id} className="relative flex gap-4 pl-12">
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute left-0 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900",
                    config.bgColor
                  )}>
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <span className="text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap">
                        {formatDistanceToNow(timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.description}
                      </p>
                    )}
                    {activity.user && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        by {activity.user.name}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


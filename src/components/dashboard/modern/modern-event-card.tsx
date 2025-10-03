'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Calendar, MapPin, Users, Clock, ExternalLink, Ticket } from 'lucide-react'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'

interface ModernEventCardProps {
  event: {
    id: string
    title: string
    description?: string | null
    start_date: string
    end_date: string
    location?: string | null
    status?: string
    image_url?: string | null
  }
  showActions?: boolean
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function ModernEventCard({
  event,
  showActions = true,
  variant = 'default',
  className
}: ModernEventCardProps) {
  const statusColors: Record<string, string> = {
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  }

  const startDate = new Date(event.start_date)
  const isUpcoming = startDate > new Date()
  const timeUntil = isUpcoming ? formatDistanceToNow(startDate, { addSuffix: true }) : null

  if (variant === 'compact') {
    return (
      <Card className={cn(
        "group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-slate-200/60 dark:border-slate-700/60",
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Date Badge */}
            <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-lg">
              <span className="text-xs font-medium uppercase">
                {format(startDate, 'MMM')}
              </span>
              <span className="text-2xl font-bold">
                {format(startDate, 'd')}
              </span>
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {event.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{format(startDate, 'p')}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {showActions && (
              <Button asChild size="sm" variant="ghost" className="flex-shrink-0">
                <Link href={`/events/${event.id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className={cn(
        "group relative overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
        className
      )}>
        {/* Background Image or Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          {event.image_url && (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <CardContent className="relative p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            {event.status && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {event.status}
              </Badge>
            )}
            {timeUntil && (
              <Badge className="bg-emerald-500/90 text-white border-0">
                {timeUntil}
              </Badge>
            )}
          </div>

          <h3 className="text-2xl font-bold mb-2 line-clamp-2">
            {event.title}
          </h3>

          {event.description && (
            <p className="text-white/80 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <Calendar className="h-4 w-4" />
              <span>{format(startDate, 'PPP')}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-white/90">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {showActions && (
            <Button asChild className="w-full bg-white text-slate-900 hover:bg-white/90">
              <Link href={`/events/${event.id}`}>
                View Event Details
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn(
      "group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200/60 dark:border-slate-700/60 overflow-hidden",
      className
    )}>
      {/* Header with gradient accent */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
          {event.status && (
            <Badge className={statusColors[event.status] || statusColors.draft}>
              {event.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>{format(startDate, 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>{format(startDate, 'p')} - {format(new Date(event.end_date), 'p')}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-pink-500" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Time Until Event */}
        {timeUntil && (
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Starts {timeUntil}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link href={`/events/${event.id}`}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/events/${event.id}/tickets`}>
                <Ticket className="mr-2 h-4 w-4" />
                Tickets
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ModernEventGridProps {
  events: Array<any>
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  emptyMessage?: string
  className?: string
}

export function ModernEventGrid({
  events,
  variant = 'default',
  showActions = true,
  emptyMessage = 'No events found',
  className
}: ModernEventGridProps) {
  if (events.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-slate-400 mb-3" />
          <p className="text-slate-600 dark:text-slate-400">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn(
      "grid gap-6",
      variant === 'compact' && "grid-cols-1",
      variant === 'default' && "md:grid-cols-2 lg:grid-cols-3",
      variant === 'featured' && "md:grid-cols-2",
      className
    )}>
      {events.map((event) => (
        <ModernEventCard
          key={event.id}
          event={event}
          variant={variant}
          showActions={showActions}
        />
      ))}
    </div>
  )
}


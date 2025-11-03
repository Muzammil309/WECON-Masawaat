'use client'

import { CalendarDays, MapPin, Users2, Clock, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface EventCardProps {
  event: {
    id: string
    title: string
    description?: string
    start_date: string
    end_date: string
    location?: string
    venue_name?: string
    cover_image_url?: string
    status: 'draft' | 'published' | 'cancelled' | 'completed'
    max_attendees?: number
    is_virtual: boolean
    organizer?: {
      full_name?: string
      avatar_url?: string
    }
  }
  stats?: {
    total_tickets?: number
    checked_in?: number
  }
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function EventCard({ event, stats, onEdit, onDelete, showActions = true }: EventCardProps) {
  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    published: 'bg-green-500/20 text-green-300 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
    completed: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  }

  const statusLabels = {
    draft: 'Draft',
    published: 'Published',
    cancelled: 'Cancelled',
    completed: 'Completed',
  }

  return (
    <div
      className="group vision-glass-card overflow-hidden hover:bg-white/8 transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-transparent hover:border-[#7928CA]/30"
      style={{
        borderRadius: '20px',
      }}
    >
      {/* Cover Image */}
      <div className="relative h-[180px] overflow-hidden">
        {event.cover_image_url ? (
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
            }}
          >
            <CalendarDays className="h-16 w-16 text-white/40" strokeWidth={1.5} />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[event.status]}`}
            style={{
              backdropFilter: 'blur(10px)',
            }}
          >
            {statusLabels[event.status]}
          </span>
        </div>

        {/* Actions Menu */}
        {showActions && (
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-2 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1A1F37] border-white/10">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/vision/events/${event.id}`} className="cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(event.id)
                    }}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(event.id)
                    }}
                    className="cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Event
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#7928CA] transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-[#A0AEC0] mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-[#A0AEC0]">
            <CalendarDays className="h-4 w-4 text-[#7928CA]" strokeWidth={2} />
            <span>
              {format(new Date(event.start_date), 'MMM dd, yyyy')}
              {event.end_date && event.end_date !== event.start_date && (
                <> - {format(new Date(event.end_date), 'MMM dd, yyyy')}</>
              )}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-[#A0AEC0]">
            <Clock className="h-4 w-4 text-[#7928CA]" strokeWidth={2} />
            <span>{format(new Date(event.start_date), 'h:mm a')}</span>
          </div>

          {/* Location */}
          {(event.location || event.venue_name || event.is_virtual) && (
            <div className="flex items-center gap-2 text-sm text-[#A0AEC0]">
              <MapPin className="h-4 w-4 text-[#7928CA]" strokeWidth={2} />
              <span className="line-clamp-1">
                {event.is_virtual ? 'Virtual Event' : event.venue_name || event.location || 'TBA'}
              </span>
            </div>
          )}

          {/* Attendees */}
          {(stats?.total_tickets || event.max_attendees) && (
            <div className="flex items-center gap-2 text-sm text-[#A0AEC0]">
              <Users2 className="h-4 w-4 text-[#7928CA]" strokeWidth={2} />
              <span>
                {stats?.total_tickets || 0}
                {event.max_attendees && ` / ${event.max_attendees}`} attendees
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        {stats && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-[#A0AEC0]">
              <span className="font-semibold text-white">{stats.checked_in || 0}</span> checked in
            </div>
            <div className="text-xs text-[#A0AEC0]">
              {stats.total_tickets && stats.checked_in ? (
                <span className="font-semibold text-[#7928CA]">
                  {Math.round((stats.checked_in / stats.total_tickets) * 100)}%
                </span>
              ) : (
                <span className="font-semibold text-[#7928CA]">0%</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Edit, 
  Trash2,
  Eye,
  Globe,
  Image as ImageIcon,
  Video,
  FileText,
  Settings as SettingsIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  capacity: number
  status: string
  image_url?: string
  category?: string
  language?: string
  created_at: string
}

export function EventsContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('em_events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error: any) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Events Management</h2>
          <p className="text-white/60 text-sm mt-1">Create and manage your events</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          asChild
        >
          <Link href="/events/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No events found</h3>
          <p className="text-white/60 mb-4">Create your first event to get started</p>
          <Button asChild>
            <Link href="/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onUpdate={fetchEvents} />
          ))}
        </div>
      )}
    </div>
  )
}

function EventCard({ event, onUpdate }: { event: Event; onUpdate: () => void }) {
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const { error } = await supabase
        .from('em_events')
        .delete()
        .eq('id', event.id)

      if (error) throw error
      toast.success('Event deleted successfully')
      onUpdate()
    } catch (error: any) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-white/10 text-white/60 border-white/20'
    }
  }

  return (
    <div className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
      {/* Event Image */}
      <div className="relative h-40 bg-gradient-to-br from-purple-600/20 to-blue-600/20 overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Calendar className="h-12 w-12 text-white/40" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`${getStatusColor(event.status)} border`}>
            {event.status}
          </Badge>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white text-lg line-clamp-1">{event.title}</h3>
          <p className="text-white/60 text-sm line-clamp-2 mt-1">{event.description}</p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-white/60">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.start_date), 'MMM dd, yyyy')}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          {event.capacity && (
            <div className="flex items-center gap-2 text-white/60">
              <Users className="h-4 w-4" />
              <span>{event.capacity} capacity</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-white/10">
          <Button size="sm" variant="ghost" className="flex-1 text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href={`/events/${event.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
          <Button size="sm" variant="ghost" className="flex-1 text-white/80 hover:text-white hover:bg-white/10" asChild>
            <Link href={`/events/${event.id}/edit`}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}


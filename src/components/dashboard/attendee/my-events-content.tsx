'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Calendar, MapPin, Clock, Download, X, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface EventRegistration {
  id: string
  event_id: string
  ticket_id: string
  event_name: string
  event_date: string
  event_time: string
  location: string
  banner_url: string | null
  ticket_tier: string
  price: number
  status: string
  checked_in: boolean
  qr_code: string
}

export function MyEventsContent() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventRegistration[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    if (user) {
      fetchMyEvents()
    }
  }, [user])

  useEffect(() => {
    filterEvents()
  }, [events, searchQuery, filterType])

  const fetchMyEvents = async () => {
    try {
      console.log('📅 Fetching my events for user:', user?.id)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('em_tickets')
        .select(`
          id,
          event_id,
          qr_code,
          status,
          em_events!inner (
            id,
            name,
            start_date,
            start_time,
            location,
            banner_url
          ),
          em_ticket_tiers!inner (
            name,
            price
          ),
          check_in_logs (
            checked_in_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching events:', error)
        toast.error('Failed to load your events')
        return
      }

      const formattedEvents: EventRegistration[] = (data || []).map((ticket: any) => ({
        id: ticket.id,
        event_id: ticket.em_events.id,
        ticket_id: ticket.id,
        event_name: ticket.em_events.name,
        event_date: ticket.em_events.start_date,
        event_time: ticket.em_events.start_time || '09:00',
        location: ticket.em_events.location || 'TBA',
        banner_url: ticket.em_events.banner_url,
        ticket_tier: ticket.em_ticket_tiers?.name || 'General',
        price: ticket.em_ticket_tiers?.price || 0,
        status: ticket.status,
        checked_in: ticket.check_in_logs && ticket.check_in_logs.length > 0,
        qr_code: ticket.qr_code
      }))

      console.log('✅ Loaded events:', formattedEvents.length)
      setEvents(formattedEvents)
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    const now = new Date()
    if (filterType === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.event_date) >= now)
    } else if (filterType === 'past') {
      filtered = filtered.filter(event => new Date(event.event_date) < now)
    }

    setFilteredEvents(filtered)
  }

  const handleDownloadTicket = (eventId: string) => {
    toast.info('Ticket download feature coming soon!')
  }

  const handleCancelRegistration = async (ticketId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('em_tickets')
        .update({ status: 'cancelled' })
        .eq('id', ticketId)

      if (error) throw error

      toast.success('Registration cancelled successfully')
      fetchMyEvents()
    } catch (err) {
      console.error('❌ Error cancelling registration:', err)
      toast.error('Failed to cancel registration')
    }
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

  return (
    <div className="mt-[28px] space-y-[24px]">
      {/* Search and Filter Bar */}
      <div className="vision-glass-card p-[20px]">
        <div className="flex flex-col md:flex-row gap-[16px]">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-[16px] top-1/2 transform -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-[48px] pr-[16px] py-[12px] rounded-[12px] text-sm outline-none transition-all text-white"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                fontFamily: '"Plus Jakarta Display", sans-serif',
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-[12px]">
            {(['all', 'upcoming', 'past'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className="px-[20px] py-[12px] rounded-[12px] text-sm font-medium transition-all capitalize"
                style={{
                  background: filterType === filter
                    ? 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)'
                    : 'rgba(26, 31, 55, 0.5)',
                  border: '2px solid #151515',
                  color: '#fff',
                  fontFamily: '"Plus Jakarta Display", sans-serif',
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="vision-glass-card p-[48px] text-center">
          <Calendar className="h-[64px] w-[64px] text-gray-400 mx-auto mb-[16px]" />
          <h3 className="text-[20px] font-bold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            No Events Found
          </h3>
          <p className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {searchQuery || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'You haven\'t registered for any events yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[24px]">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="vision-glass-card p-[24px] hover:bg-white/5 transition-all"
            >
              <div className="flex flex-col md:flex-row gap-[24px]">
                {/* Event Banner */}
                <div
                  className="w-full md:w-[200px] h-[150px] rounded-[16px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: event.banner_url ? `url(${event.banner_url})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {!event.banner_url && (
                    <Calendar className="h-[48px] w-[48px] text-white/50" />
                  )}
                </div>

                {/* Event Details */}
                <div className="flex-1 space-y-[16px]">
                  <div>
                    <div className="flex items-start justify-between mb-[8px]">
                      <h3 className="text-[20px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                        {event.event_name}
                      </h3>
                      {event.checked_in && (
                        <span className="px-[12px] py-[4px] rounded-[8px] text-[12px] font-medium bg-green-500/20 text-green-400">
                          Checked In
                        </span>
                      )}
                    </div>

                    <div className="space-y-[8px]">
                      <div className="flex items-center gap-[8px] text-[14px] text-gray-300">
                        <Calendar className="h-[16px] w-[16px]" />
                        <span>{format(new Date(event.event_date), 'MMMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-[8px] text-[14px] text-gray-300">
                        <Clock className="h-[16px] w-[16px]" />
                        <span>{event.event_time}</span>
                      </div>
                      <div className="flex items-center gap-[8px] text-[14px] text-gray-300">
                        <MapPin className="h-[16px] w-[16px]" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Info */}
                  <div className="flex items-center gap-[16px] text-[14px]">
                    <span className="px-[12px] py-[6px] rounded-[8px] bg-purple-500/20 text-purple-300 font-medium">
                      {event.ticket_tier}
                    </span>
                    <span className="text-gray-400">
                      PKR {event.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-[12px]">
                    <button
                      onClick={() => window.location.href = `/events/${event.event_id}`}
                      className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                        color: '#fff',
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDownloadTicket(event.id)}
                      className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
                      style={{
                        background: 'rgba(26, 31, 55, 0.5)',
                        border: '2px solid #151515',
                        color: '#fff',
                      }}
                    >
                      <Download className="h-[16px] w-[16px]" />
                      Download Ticket
                    </button>
                    {event.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelRegistration(event.ticket_id)}
                        className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '2px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                        }}
                      >
                        <X className="h-[16px] w-[16px]" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


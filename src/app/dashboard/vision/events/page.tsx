'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { EventCard } from '@/components/events/event-card'
import { Plus, Search, Filter, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Event {
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

export default function EventsListingPage() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Debug logging
  useEffect(() => {
    console.log('🔍 Events Page State:', {
      authLoading,
      hasUser: !!user,
      role,
      eventsLoading: loading,
      eventsCount: events.length
    })
  }, [authLoading, user, role, loading, events.length])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('❌ No user found, redirecting to login')
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Fetch events
  useEffect(() => {
    if (!authLoading && user) {
      console.log('✅ User authenticated, fetching events...')
      fetchEvents()
    }
  }, [user, authLoading, statusFilter])

  const fetchEvents = async () => {
    try {
      console.log('📡 Fetching events with filter:', statusFilter)
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      params.append('sortBy', 'start_date')
      params.append('sortOrder', 'desc')

      const url = `/api/events?${params.toString()}`
      console.log('📡 API URL:', url)

      const response = await fetch(url)
      console.log('📡 Response status:', response.status)

      const data = await response.json()
      console.log('📡 Response data:', data)

      if (data.success) {
        setEvents(data.data || [])
        console.log('✅ Events loaded:', data.data?.length || 0)
      } else {
        console.error('❌ API returned error:', data.error)
        toast.error(data.error || 'Failed to fetch events')
        setEvents([])
      }
    } catch (error) {
      console.error('❌ Error fetching events:', error)
      toast.error('Failed to fetch events')
      setEvents([])
    } finally {
      setLoading(false)
      console.log('✅ Loading complete')
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/vision/events/${id}/edit`)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Event deleted successfully')
        fetchEvents() // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  // Filter events by search query
  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.venue_name?.toLowerCase().includes(query)
    )
  })

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
      {/* Decorative Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.3) 0%, rgba(15, 21, 53, 0) 70%)',
          filter: 'blur(136px)',
        }}
      />

      {/* Sidebar */}
      <VisionSidebar />

      {/* Main Content */}
      <div className="ml-[284px] p-[20px] relative z-10">
        {/* Top Navigation */}
        <VisionTopbar title="Events" breadcrumb="Events" />

        {/* Page Content */}
        <div className="mt-[24px] space-y-[24px]">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-white mb-[8px]">All Events</h2>
              <p className="text-[14px] text-[#A0AEC0]">
                Manage your events, view analytics, and track registrations
              </p>
            </div>
            {role === 'admin' && (
              <Link
                href="/dashboard/vision/events/create"
                className="flex items-center gap-2 px-[20px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                }}
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
                Create Event
              </Link>
            )}
          </div>

          {/* Filters Section */}
          <div className="vision-glass-card p-[20px]" style={{ borderRadius: '20px' }}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#A0AEC0]" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#A0AEC0]" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="vision-glass-card h-[400px] animate-pulse" style={{ borderRadius: '20px' }} />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  showActions={role === 'admin'}
                />
              ))}
            </div>
          ) : (
            <div className="vision-glass-card p-[60px] text-center" style={{ borderRadius: '20px' }}>
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-[80px] h-[80px] rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                    opacity: 0.2,
                  }}
                >
                  <CalendarDays className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-white mb-2">No events found</h3>
                  <p className="text-[14px] text-[#A0AEC0] mb-6">
                    {searchQuery
                      ? 'Try adjusting your search or filters'
                      : 'Get started by creating your first event'}
                  </p>
                  {role === 'admin' && !searchQuery && (
                    <Link
                      href="/dashboard/vision/events/create"
                      className="inline-flex items-center gap-2 px-[20px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                      }}
                    >
                      <Plus className="h-5 w-5" strokeWidth={2.5} />
                      Create Your First Event
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <VisionFooter />
      </div>
    </div>
  )
}


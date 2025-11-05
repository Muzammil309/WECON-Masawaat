'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Edit, 
  Trash2,
  Video,
  Mic,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface Session {
  id: string
  event_id: string
  title: string
  description: string
  start_time: string
  end_time: string
  location: string
  speaker_name?: string
  speaker_email?: string
  capacity: number
  status: string
  session_type: string
  created_at: string
}

export function AgendaSessionsContent() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [events, setEvents] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
    fetchSessions()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('em_events')
        .select('id, title')
        .eq('status', 'published')
        .order('start_date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error: any) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('em_sessions')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) throw error
      setSessions(data || [])
    } catch (error: any) {
      console.error('Error fetching sessions:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = selectedEvent === 'all' 
    ? sessions 
    : sessions.filter(s => s.event_id === selectedEvent)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Agenda & Sessions</h2>
          <p className="text-white/60 text-sm mt-1">Manage event schedules and sessions</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          onClick={() => toast.info('Session creation form coming soon')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Session
        </Button>
      </div>

      {/* Event Filter */}
      <div className="flex gap-4">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
        >
          <option value="all">All Events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <Calendar className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No sessions found</h3>
          <p className="text-white/60 mb-4">Create your first session to get started</p>
          <Button onClick={() => toast.info('Session creation form coming soon')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Session
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <SessionCard key={session.id} session={session} onUpdate={fetchSessions} />
          ))}
        </div>
      )}
    </div>
  )
}

function SessionCard({ session, onUpdate }: { session: Session; onUpdate: () => void }) {
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      const { error } = await supabase
        .from('em_sessions')
        .delete()
        .eq('id', session.id)

      if (error) throw error
      toast.success('Session deleted successfully')
      onUpdate()
    } catch (error: any) {
      console.error('Error deleting session:', error)
      toast.error('Failed to delete session')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ongoing': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-white/10 text-white/60 border-white/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentation': return <FileText className="h-4 w-4" />
      case 'workshop': return <Users className="h-4 w-4" />
      case 'panel': return <Mic className="h-4 w-4" />
      case 'virtual': return <Video className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              {getTypeIcon(session.session_type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white text-lg">{session.title}</h3>
                <Badge className={`${getStatusColor(session.status)} border text-xs`}>
                  {session.status}
                </Badge>
              </div>
              <p className="text-white/60 text-sm line-clamp-2">{session.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(session.start_time), 'HH:mm')}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(session.start_time), 'MMM dd')}</span>
            </div>
            {session.location && (
              <div className="flex items-center gap-2 text-white/60">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{session.location}</span>
              </div>
            )}
            {session.speaker_name && (
              <div className="flex items-center gap-2 text-white/60">
                <Mic className="h-4 w-4" />
                <span className="line-clamp-1">{session.speaker_name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
            <Edit className="h-4 w-4 mr-1" />
            Edit
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


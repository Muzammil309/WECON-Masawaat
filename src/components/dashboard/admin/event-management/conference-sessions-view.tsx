'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Presentation, Plus, Search, Filter, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { VisionBreadcrumb } from '@/components/vision-ui/breadcrumb'
import type { ConferenceSession } from '../event-management-content'

export default function ConferenceSessionsView() {
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState<ConferenceSession[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      console.log('🔄 [CONFERENCE SESSIONS] Fetching sessions...')

      const { data, error } = await supabase
        .from('em_conference_sessions')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) {
        console.error('❌ Error fetching conference sessions:', error)
        toast.error('Failed to load conference sessions')
        return
      }

      setSessions(data || [])
      console.log('✅ [CONFERENCE SESSIONS] Fetched successfully:', data?.length || 0)
    } catch (error: any) {
      console.error('❌ [CONFERENCE SESSIONS] Error:', error)
      toast.error('Failed to load conference sessions')
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      searchQuery === '' ||
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-[20px]">
      <div className="max-w-[1440px]">
        {/* Breadcrumb */}
        <VisionBreadcrumb
          items={[
            { label: 'Admin', href: '/dashboard/vision' },
            { label: 'Event Management' },
            { label: 'Conference Sessions' },
          ]}
        />

        {/* Header */}
        <div className="mb-[24px] md:mb-[32px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-[12px] bg-gradient-to-br from-[#7928CA] to-[#4318FF]">
              <Presentation className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] text-white" />
            </div>
            <h1
              className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Conference Sessions
            </h1>
          </div>
          <p
            className="text-white/60 text-[13px] md:text-[14px] ml-[52px] md:ml-[60px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Manage conference sessions, keynotes, panels, and presentations
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] mb-[24px]">
          <div className="flex items-center gap-[12px] flex-1 w-full sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-[12px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-white/40" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-[40px] bg-white/5 border-white/10 text-white placeholder:text-white/40 h-[40px] md:h-[44px] rounded-[12px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-[12px] w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none bg-white/5 border-white/10 text-white hover:bg-white/10 h-[40px] md:h-[44px] rounded-[12px] min-h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Filter className="h-[16px] w-[16px] mr-[8px]" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
            <Button
              className="flex-1 sm:flex-none bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white hover:opacity-90 h-[40px] md:h-[44px] rounded-[12px] min-h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Plus className="h-[16px] w-[16px] mr-[8px]" />
              Add Session
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-white/60 text-center py-[60px] md:py-[80px]">
            <div className="animate-pulse">Loading sessions...</div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <EmptyState onAdd={() => {}} />
        ) : (
          <div className="grid grid-cols-1 gap-[16px]">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} onUpdate={fetchSessions} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="p-[32px] md:p-[48px] text-center rounded-[20px] border-2 border-white/10"
      style={{
        background: 'rgba(26, 31, 55, 0.5)',
        backdropFilter: 'blur(21px)',
      }}
    >
      <div className="flex items-center justify-center w-[64px] h-[64px] md:w-[80px] md:h-[80px] mx-auto mb-[20px] rounded-[20px] bg-white/5">
        <Presentation className="h-[32px] w-[32px] md:h-[40px] md:w-[40px] text-white/40" />
      </div>
      <h3
        className="text-[16px] md:text-[18px] font-semibold text-white mb-[8px]"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        No Conference Sessions Yet
      </h3>
      <p
        className="text-white/60 text-[13px] md:text-[14px] mb-[24px] max-w-md mx-auto"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        Create your first conference session to get started with event management
      </p>
      <Button
        onClick={onAdd}
        className="bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white hover:opacity-90 h-[44px] rounded-[12px] min-h-[44px]"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        <Plus className="h-[16px] w-[16px] mr-[8px]" />
        Add First Session
      </Button>
    </div>
  )
}

// Session Card Component
function SessionCard({ session, onUpdate }: { session: ConferenceSession; onUpdate: () => void }) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      happening_now: { label: 'Happening Now', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      upcoming: { label: 'Upcoming', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      completed: { label: 'Completed', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
      pre_conference: { label: 'Pre-Conference', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
    return (
      <Badge
        className={`${config.className} border text-[10px] md:text-[11px] px-[10px] md:px-[12px] py-[4px] rounded-[8px]`}
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        {config.label}
      </Badge>
    )
  }

  const getSessionTypeBadge = (type: string) => {
    const typeConfig = {
      keynote: { label: 'Keynote', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      panel: { label: 'Panel', className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
      presentation: { label: 'Presentation', className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.presentation
    return (
      <Badge
        className={`${config.className} border text-[10px] md:text-[11px] px-[10px] md:px-[12px] py-[4px] rounded-[8px]`}
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        {config.label}
      </Badge>
    )
  }

  return (
    <div
      className="p-[16px] md:p-[20px] hover:scale-[1.01] transition-all cursor-pointer rounded-[16px] border-2 border-white/10"
      style={{
        background: 'rgba(26, 31, 55, 0.5)',
        backdropFilter: 'blur(21px)',
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-[16px]">
        <div className="flex-1 w-full">
          <div className="flex flex-wrap items-center gap-[8px] md:gap-[12px] mb-[12px]">
            <h3
              className="text-[14px] md:text-[15px] font-semibold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              {session.title}
            </h3>
            {getSessionTypeBadge(session.session_type)}
            {getStatusBadge(session.status)}
          </div>
          {session.description && (
            <p
              className="text-white/60 text-[12px] md:text-[13px] mb-[12px] line-clamp-2"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              {session.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-[12px] md:gap-[16px] text-[11px] md:text-[12px] text-white/60">
            <span className="flex items-center gap-[6px]">
              <Calendar className="h-[14px] w-[14px]" />
              {new Date(session.start_time).toLocaleDateString()}
            </span>
            <span>
              {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
              {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {session.location && (
              <span className="flex items-center gap-[6px]">
                📍 {session.location}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-[8px] w-full md:w-auto justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 h-[36px] md:h-[32px] w-[36px] md:w-[32px] p-0 rounded-[8px] min-h-[44px] md:min-h-[32px]"
          >
            <Trash2 className="h-[14px] w-[14px]" />
          </Button>
        </div>
      </div>
    </div>
  )
}


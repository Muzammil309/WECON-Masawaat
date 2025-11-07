'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Users, Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { VisionBreadcrumb } from '@/components/vision-ui/breadcrumb'
import type { Roundtable } from '../event-management-content'

export default function RoundtablesView() {
  const [loading, setLoading] = useState(false)
  const [roundtables, setRoundtables] = useState<Roundtable[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchRoundtables()
  }, [])

  const fetchRoundtables = async () => {
    try {
      setLoading(true)
      console.log('🔄 [ROUNDTABLES] Fetching roundtables...')

      const { data, error } = await supabase
        .from('em_roundtables')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) {
        console.error('❌ Error fetching roundtables:', error)
        toast.error('Failed to load roundtables')
        return
      }

      setRoundtables(data || [])
      console.log('✅ [ROUNDTABLES] Fetched successfully:', data?.length || 0)
    } catch (error: any) {
      console.error('❌ [ROUNDTABLES] Error:', error)
      toast.error('Failed to load roundtables')
    } finally {
      setLoading(false)
    }
  }

  const filteredRoundtables = roundtables.filter(
    (rt) =>
      searchQuery === '' ||
      rt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rt.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0F1535] p-[16px] md:p-[24px] lg:p-[32px]">
      <div className="max-w-[1440px] mx-auto">
        <VisionBreadcrumb
          items={[
            { label: 'Admin', href: '/dashboard/vision' },
            { label: 'Event Management' },
            { label: 'Roundtables' },
          ]}
        />

        <div className="mb-[24px] md:mb-[32px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-[12px] bg-gradient-to-br from-[#7928CA] to-[#4318FF]">
              <Users className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] text-white" />
            </div>
            <h1
              className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Roundtable Discussions
            </h1>
          </div>
          <p
            className="text-white/60 text-[13px] md:text-[14px] ml-[52px] md:ml-[60px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Manage roundtable discussion sessions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] mb-[24px]">
          <div className="flex items-center gap-[12px] flex-1 w-full sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-[12px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-white/40" />
              <Input
                placeholder="Search roundtables..."
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
              Add Roundtable
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-white/60 text-center py-[60px] md:py-[80px]">
            <div className="animate-pulse">Loading roundtables...</div>
          </div>
        ) : filteredRoundtables.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-[16px]">
            {filteredRoundtables.map((rt) => (
              <RoundtableCard key={rt.id} roundtable={rt} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="p-[32px] md:p-[48px] text-center rounded-[20px] border-2 border-white/10"
      style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)' }}
    >
      <div className="flex items-center justify-center w-[64px] h-[64px] md:w-[80px] md:h-[80px] mx-auto mb-[20px] rounded-[20px] bg-white/5">
        <Users className="h-[32px] w-[32px] md:h-[40px] md:w-[40px] text-white/40" />
      </div>
      <h3 className="text-[16px] md:text-[18px] font-semibold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        No Roundtables Yet
      </h3>
      <p className="text-white/60 text-[13px] md:text-[14px] mb-[24px] max-w-md mx-auto" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        Create your first roundtable discussion
      </p>
      <Button className="bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white hover:opacity-90 h-[44px] rounded-[12px] min-h-[44px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <Plus className="h-[16px] w-[16px] mr-[8px]" />
        Add First Roundtable
      </Button>
    </div>
  )
}

function RoundtableCard({ roundtable }: { roundtable: Roundtable }) {
  return (
    <div className="p-[16px] md:p-[20px] hover:scale-[1.01] transition-all cursor-pointer rounded-[16px] border-2 border-white/10" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)' }}>
      <h4 className="text-[14px] md:text-[15px] font-semibold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        {roundtable.title}
      </h4>
      {roundtable.topic && (
        <p className="text-white/60 text-[12px] md:text-[13px] mb-[12px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          {roundtable.topic}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-[8px] md:gap-[12px]">
        <Badge className={`border text-[10px] md:text-[11px] ${roundtable.formation_status === 'forming' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
          {roundtable.formation_status}
        </Badge>
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-[10px] md:text-[11px]">
          {roundtable.current_participants}/{roundtable.max_participants} Participants
        </Badge>
      </div>
    </div>
  )
}


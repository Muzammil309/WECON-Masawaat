'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { GraduationCap, Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { VisionBreadcrumb } from '@/components/vision-ui/breadcrumb'
import type { LearningLab } from '../event-management-content'

export default function LearningLabsView() {
  const [loading, setLoading] = useState(false)
  const [labs, setLabs] = useState<LearningLab[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchLabs()
  }, [])

  const fetchLabs = async () => {
    try {
      setLoading(true)
      console.log('🔄 [LEARNING LABS] Fetching labs...')

      const { data, error } = await supabase
        .from('em_learning_labs')
        .select('*')
        .order('start_time', { ascending: true })

      if (error) {
        console.error('❌ Error fetching learning labs:', error)
        toast.error('Failed to load learning labs')
        return
      }

      setLabs(data || [])
      console.log('✅ [LEARNING LABS] Fetched successfully:', data?.length || 0)
    } catch (error: any) {
      console.error('❌ [LEARNING LABS] Error:', error)
      toast.error('Failed to load learning labs')
    } finally {
      setLoading(false)
    }
  }

  const filteredLabs = labs.filter(
    (lab) =>
      searchQuery === '' ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-[20px]">
      <div className="max-w-[1440px]">
        <VisionBreadcrumb
          items={[
            { label: 'Admin', href: '/dashboard/vision' },
            { label: 'Event Management' },
            { label: 'Learning Labs' },
          ]}
        />

        <div className="mb-[24px] md:mb-[32px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <div className="flex items-center justify-center w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-[12px] bg-gradient-to-br from-[#7928CA] to-[#4318FF]">
              <GraduationCap className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] text-white" />
            </div>
            <h1
              className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Learning Labs
            </h1>
          </div>
          <p
            className="text-white/60 text-[13px] md:text-[14px] ml-[52px] md:ml-[60px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Manage learning labs and workshop sessions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px] mb-[24px]">
          <div className="flex items-center gap-[12px] flex-1 w-full sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-[12px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-white/40" />
              <Input
                placeholder="Search labs..."
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
              Add Lab
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-white/60 text-center py-[60px] md:py-[80px]">
            <div className="animate-pulse">Loading labs...</div>
          </div>
        ) : filteredLabs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-[16px]">
            {filteredLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
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
      style={{
        background: 'rgba(26, 31, 55, 0.5)',
        backdropFilter: 'blur(21px)',
      }}
    >
      <div className="flex items-center justify-center w-[64px] h-[64px] md:w-[80px] md:h-[80px] mx-auto mb-[20px] rounded-[20px] bg-white/5">
        <GraduationCap className="h-[32px] w-[32px] md:h-[40px] md:w-[40px] text-white/40" />
      </div>
      <h3
        className="text-[16px] md:text-[18px] font-semibold text-white mb-[8px]"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        No Learning Labs Yet
      </h3>
      <p
        className="text-white/60 text-[13px] md:text-[14px] mb-[24px] max-w-md mx-auto"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        Create your first learning lab to get started
      </p>
      <Button
        className="bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white hover:opacity-90 h-[44px] rounded-[12px] min-h-[44px]"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        <Plus className="h-[16px] w-[16px] mr-[8px]" />
        Add First Lab
      </Button>
    </div>
  )
}

function LabCard({ lab }: { lab: LearningLab }) {
  return (
    <div
      className="p-[16px] md:p-[20px] hover:scale-[1.01] transition-all cursor-pointer rounded-[16px] border-2 border-white/10"
      style={{
        background: 'rgba(26, 31, 55, 0.5)',
        backdropFilter: 'blur(21px)',
      }}
    >
      <h4
        className="text-[14px] md:text-[15px] font-semibold text-white mb-[8px]"
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        {lab.title}
      </h4>
      {lab.description && (
        <p
          className="text-white/60 text-[12px] md:text-[13px] mb-[12px] line-clamp-2"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
        >
          {lab.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-[8px] md:gap-[12px]">
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-[10px] md:text-[11px]">
          {lab.difficulty_level || 'All Levels'}
        </Badge>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[10px] md:text-[11px]">
          {lab.registered_count}/{lab.max_capacity} Registered
        </Badge>
        <Badge
          className={`border text-[10px] md:text-[11px] ${
            lab.registration_status === 'open'
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : lab.registration_status === 'full'
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
          }`}
        >
          {lab.registration_status}
        </Badge>
      </div>
    </div>
  )
}


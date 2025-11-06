'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Calendar,
  GraduationCap,
  Users,
  Award,
  Rocket,
  Building2,
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Download,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

// =====================================================
// TYPESCRIPT INTERFACES
// =====================================================

export interface ConferenceSession {
  id: string
  event_id: string
  title: string
  description: string | null
  session_type: 'keynote' | 'panel' | 'presentation'
  start_time: string
  end_time: string
  location: string | null
  status: 'upcoming' | 'happening_now' | 'completed' | 'cancelled' | 'pre_conference'
  speaker_ids: string[]
  max_attendees: number | null
  current_attendees: number
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface LearningLab {
  id: string
  event_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  location: string | null
  status: 'upcoming' | 'happening_now' | 'completed' | 'cancelled' | 'pre_conference'
  instructor_ids: string[]
  max_capacity: number
  registered_count: number
  registration_status: 'open' | 'closed' | 'full' | 'waitlist'
  prerequisites: string | null
  materials_needed: string | null
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Roundtable {
  id: string
  event_id: string
  title: string
  description: string | null
  topic: string | null
  start_time: string
  end_time: string
  location: string | null
  status: 'upcoming' | 'happening_now' | 'completed' | 'cancelled' | 'pre_conference'
  moderator_ids: string[]
  max_participants: number
  current_participants: number
  formation_status: 'planning' | 'forming' | 'ready' | 'in_progress' | 'completed'
  discussion_format: string | null
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface SkillClinic {
  id: string
  event_id: string
  title: string
  description: string | null
  skill_category: string | null
  start_time: string
  end_time: string
  location: string | null
  status: 'upcoming' | 'happening_now' | 'completed' | 'cancelled' | 'pre_conference'
  trainer_ids: string[]
  max_participants: number
  registered_count: number
  orientation_status: 'pending' | 'scheduled' | 'completed'
  certification_offered: boolean
  hands_on_practice: boolean
  equipment_needed: string | null
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface StartupStory {
  id: string
  event_id: string
  startup_name: string
  founder_name: string | null
  description: string | null
  pitch_duration: number
  start_time: string
  end_time: string
  location: string | null
  status: 'upcoming' | 'happening_now' | 'completed' | 'cancelled' | 'pre_conference'
  industry: string | null
  funding_stage: string | null
  registration_status: 'pending' | 'confirmed' | 'declined'
  confirmation_status: 'pending' | 'confirmed' | 'cancelled'
  website_url: string | null
  pitch_deck_url: string | null
  demo_video_url: string | null
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface Exhibitor {
  id: string
  event_id: string
  company_name: string
  tier: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'
  description: string | null
  booth_number: string | null
  booth_size: 'small' | 'medium' | 'large' | 'premium' | null
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  contact_phone: string | null
  website_url: string | null
  logo_url: string | null
  banner_url: string | null
  products_services: string | null
  special_offers: string | null
  social_media: Record<string, string>
  booth_staff_count: number
  setup_requirements: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

export interface FoodVendor {
  id: string
  event_id: string
  vendor_name: string
  cuisine_type: string | null
  description: string | null
  menu_items: Array<{
    name: string
    price: number
    description?: string
    dietary_info?: string
  }>
  location: string | null
  booth_number: string | null
  operating_hours_start: string | null
  operating_hours_end: string | null
  contact_name: string | null
  contact_phone: string | null
  logo_url: string | null
  accepts_cash: boolean
  accepts_card: boolean
  accepts_mobile_payment: boolean
  dietary_options: string[]
  average_price_range: 'budget' | 'moderate' | 'premium' | null
  status: 'pending' | 'confirmed' | 'cancelled'
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}

// =====================================================
// MAIN COMPONENT
// =====================================================

export function EventManagementContent() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('conference')
  const supabase = createClient()

  // State for all session types
  const [conferenceSessions, setConferenceSessions] = useState<ConferenceSession[]>([])
  const [learningLabs, setLearningLabs] = useState<LearningLab[]>([])
  const [roundtables, setRoundtables] = useState<Roundtable[]>([])
  const [skillClinics, setSkillClinics] = useState<SkillClinic[]>([])
  const [startupStories, setStartupStories] = useState<StartupStory[]>([])
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [foodVendors, setFoodVendors] = useState<FoodVendor[]>([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      console.log('🔄 [EVENT MANAGEMENT] Fetching all session data...')

      // Fetch all data in parallel
      const [
        sessionsData,
        labsData,
        roundtablesData,
        clinicsData,
        startupsData,
        exhibitorsData,
        vendorsData
      ] = await Promise.all([
        supabase.from('em_conference_sessions').select('*').order('start_time', { ascending: true }),
        supabase.from('em_learning_labs').select('*').order('start_time', { ascending: true }),
        supabase.from('em_roundtables').select('*').order('start_time', { ascending: true }),
        supabase.from('em_skill_clinics').select('*').order('start_time', { ascending: true }),
        supabase.from('em_startup_stories').select('*').order('start_time', { ascending: true }),
        supabase.from('em_exhibitors').select('*').order('tier', { ascending: true }),
        supabase.from('em_food_vendors').select('*').order('vendor_name', { ascending: true })
      ])

      if (sessionsData.error) console.error('❌ Error fetching conference sessions:', sessionsData.error)
      if (labsData.error) console.error('❌ Error fetching learning labs:', labsData.error)
      if (roundtablesData.error) console.error('❌ Error fetching roundtables:', roundtablesData.error)
      if (clinicsData.error) console.error('❌ Error fetching skill clinics:', clinicsData.error)
      if (startupsData.error) console.error('❌ Error fetching startup stories:', startupsData.error)
      if (exhibitorsData.error) console.error('❌ Error fetching exhibitors:', exhibitorsData.error)
      if (vendorsData.error) console.error('❌ Error fetching food vendors:', vendorsData.error)

      setConferenceSessions(sessionsData.data || [])
      setLearningLabs(labsData.data || [])
      setRoundtables(roundtablesData.data || [])
      setSkillClinics(clinicsData.data || [])
      setStartupStories(startupsData.data || [])
      setExhibitors(exhibitorsData.data || [])
      setFoodVendors(vendorsData.data || [])

      console.log('✅ [EVENT MANAGEMENT] All data fetched successfully')
    } catch (error: any) {
      console.error('❌ [EVENT MANAGEMENT] Error fetching data:', error)
      toast.error('Failed to load event management data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-[24px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px]">
        <div>
          <h2
            className="text-[24px] font-bold text-white"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Event Management
          </h2>
          <p
            className="text-white/60 text-[13px] mt-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Manage all event sessions, exhibitors, and vendors
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-[24px]">
        <TabsList
          className="bg-white/5 border border-white/10 p-[4px] rounded-[12px]"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
        >
          <TabsTrigger
            value="conference"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <Calendar className="h-[14px] w-[14px] mr-[8px]" />
            Conference Sessions
          </TabsTrigger>
          <TabsTrigger
            value="labs"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <GraduationCap className="h-[14px] w-[14px] mr-[8px]" />
            Learning Labs
          </TabsTrigger>
          <TabsTrigger
            value="roundtables"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <Users className="h-[14px] w-[14px] mr-[8px]" />
            Roundtables
          </TabsTrigger>
          <TabsTrigger
            value="clinics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <Award className="h-[14px] w-[14px] mr-[8px]" />
            Skill Clinics
          </TabsTrigger>
          <TabsTrigger
            value="startups"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <Rocket className="h-[14px] w-[14px] mr-[8px]" />
            Startup Stories
          </TabsTrigger>
          <TabsTrigger
            value="exhibitors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <Building2 className="h-[14px] w-[14px] mr-[8px]" />
            Exhibitors
          </TabsTrigger>
          <TabsTrigger
            value="food"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-[13px] rounded-[8px]"
          >
            <UtensilsCrossed className="h-[14px] w-[14px] mr-[8px]" />
            Food Court
          </TabsTrigger>
        </TabsList>


        {/* Conference Sessions Tab */}
        <TabsContent value="conference" className="space-y-[24px]">
          <ConferenceSessionsTab
            sessions={conferenceSessions}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        {/* Learning Labs Tab */}
        <TabsContent value="labs" className="space-y-[24px]">
          <LearningLabsTab
            labs={learningLabs}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        {/* Roundtables Tab */}
        <TabsContent value="roundtables" className="space-y-[24px]">
          <RoundtablesTab
            roundtables={roundtables}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        {/* Skill Clinics Tab */}
        <TabsContent value="clinics" className="space-y-[24px]">
          <SkillClinicsTab
            clinics={skillClinics}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        {/* Startup Stories Tab */}
        <TabsContent value="startups" className="space-y-[24px]">
          <StartupStoriesTab
            startups={startupStories}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        {/* Exhibitors Tab */}
        <TabsContent value="exhibitors" className="space-y-[24px]">
          <ExhibitorsTab
            exhibitors={exhibitors}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>

        {/* Food Court Tab */}
        <TabsContent value="food" className="space-y-[24px]">
          <FoodCourtTab
            vendors={foodVendors}
            loading={loading}
            onUpdate={fetchAllData}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// =====================================================
// SUB-TAB COMPONENTS (Placeholders - will be implemented)
// =====================================================

function ConferenceSessionsTab({ sessions, loading, onUpdate }: {
  sessions: ConferenceSession[]
  loading: boolean
  onUpdate: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-[20px]">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[16px]">
        <div className="flex items-center gap-[12px] flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-[12px] top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] text-white/40" />
            <Input
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-[40px] bg-white/5 border-white/10 text-white placeholder:text-white/40 h-[40px] rounded-[12px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-[40px] rounded-[12px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Filter className="h-[16px] w-[16px] mr-[8px]" />
            Filter
          </Button>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Plus className="h-[16px] w-[16px] mr-[8px]" />
            Add Session
          </Button>
        </div>
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div
          className="vision-glass-card p-[32px] text-center"
          style={{
            background: 'rgba(26, 31, 55, 0.5)',
            backdropFilter: 'blur(21px)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}
        >
          <Calendar className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3
            className="text-[18px] font-semibold text-white mb-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            No Conference Sessions Yet
          </h3>
          <p
            className="text-white/60 text-[13px] mb-[20px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            Create your first conference session to get started
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Plus className="h-[16px] w-[16px] mr-[8px]" />
            Add First Session
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          {sessions
            .filter(session =>
              searchQuery === '' ||
              session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              session.description?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((session) => (
              <SessionCard key={session.id} session={session} onUpdate={onUpdate} />
            ))}
        </div>
      )}
    </div>
  )
}

function SessionCard({ session, onUpdate }: { session: ConferenceSession; onUpdate: () => void }) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      happening_now: { label: 'Happening Now', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
      upcoming: { label: 'Upcoming', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      completed: { label: 'Completed', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
      cancelled: { label: 'Cancelled', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
      pre_conference: { label: 'Pre-Conference', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming
    return (
      <Badge
        className={`${config.className} border text-[11px] px-[12px] py-[4px] rounded-[8px]`}
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
      presentation: { label: 'Presentation', className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' }
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.presentation
    return (
      <Badge
        className={`${config.className} border text-[11px] px-[12px] py-[4px] rounded-[8px]`}
        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
      >
        {config.label}
      </Badge>
    )
  }

  return (
    <div
      className="vision-glass-card p-[20px] hover:scale-[1.01] transition-all cursor-pointer"
      style={{
        background: 'rgba(26, 31, 55, 0.5)',
        backdropFilter: 'blur(21px)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px'
      }}
    >
      <div className="flex justify-between items-start gap-[16px]">
        <div className="flex-1">
          <div className="flex items-center gap-[12px] mb-[12px]">
            <h3
              className="text-[15px] font-semibold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              {session.title}
            </h3>
            {getSessionTypeBadge(session.session_type)}
            {getStatusBadge(session.status)}
          </div>
          {session.description && (
            <p
              className="text-white/60 text-[13px] mb-[12px] line-clamp-2"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              {session.description}
            </p>
          )}
          <div className="flex items-center gap-[16px] text-[12px] text-white/60">
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
        <div className="flex items-center gap-[8px]">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 h-[32px] w-[32px] p-0 rounded-[8px]"
          >
            <Trash2 className="h-[14px] w-[14px]" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Learning Labs Tab Component
function LearningLabsTab({ labs, loading, onUpdate }: {
  labs: LearningLab[]
  loading: boolean
  onUpdate: () => void
}) {
  return (
    <div className="space-y-[20px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Learning Labs
        </h3>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]">
          <Plus className="h-[16px] w-[16px] mr-[8px]" />
          Add Lab
        </Button>
      </div>
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading labs...</div>
      ) : labs.length === 0 ? (
        <div className="vision-glass-card p-[32px] text-center" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
          <GraduationCap className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-white mb-[8px]">No Learning Labs Yet</h3>
          <p className="text-white/60 text-[13px]">Create your first learning lab to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          {labs.map((lab) => (
            <div key={lab.id} className="vision-glass-card p-[20px]" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
              <h4 className="text-[15px] font-semibold text-white mb-[8px]">{lab.title}</h4>
              <p className="text-white/60 text-[13px]">{lab.description}</p>
              <div className="flex items-center gap-[12px] mt-[12px]">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-[11px]">
                  {lab.difficulty_level || 'All Levels'}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-[11px]">
                  {lab.registered_count}/{lab.max_capacity} Registered
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Roundtables Tab Component
function RoundtablesTab({ roundtables, loading, onUpdate }: {
  roundtables: Roundtable[]
  loading: boolean
  onUpdate: () => void
}) {
  return (
    <div className="space-y-[20px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Roundtable Discussions
        </h3>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]">
          <Plus className="h-[16px] w-[16px] mr-[8px]" />
          Add Roundtable
        </Button>
      </div>
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading roundtables...</div>
      ) : roundtables.length === 0 ? (
        <div className="vision-glass-card p-[32px] text-center" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
          <Users className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-white mb-[8px]">No Roundtables Yet</h3>
          <p className="text-white/60 text-[13px]">Create your first roundtable discussion to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          {roundtables.map((roundtable) => (
            <div key={roundtable.id} className="vision-glass-card p-[20px]" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
              <h4 className="text-[15px] font-semibold text-white mb-[8px]">{roundtable.title}</h4>
              <p className="text-white/60 text-[13px]">{roundtable.topic}</p>
              <div className="flex items-center gap-[12px] mt-[12px]">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 border text-[11px]">
                  {roundtable.formation_status}
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 border text-[11px]">
                  {roundtable.current_participants}/{roundtable.max_participants} Participants
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Skill Clinics Tab Component
function SkillClinicsTab({ clinics, loading, onUpdate }: {
  clinics: SkillClinic[]
  loading: boolean
  onUpdate: () => void
}) {
  return (
    <div className="space-y-[20px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Skill Clinics
        </h3>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]">
          <Plus className="h-[16px] w-[16px] mr-[8px]" />
          Add Clinic
        </Button>
      </div>
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading clinics...</div>
      ) : clinics.length === 0 ? (
        <div className="vision-glass-card p-[32px] text-center" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
          <Award className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-white mb-[8px]">No Skill Clinics Yet</h3>
          <p className="text-white/60 text-[13px]">Create your first skill clinic to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[16px]">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="vision-glass-card p-[20px]" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
              <h4 className="text-[15px] font-semibold text-white mb-[8px]">{clinic.title}</h4>
              <p className="text-white/60 text-[13px]">{clinic.description}</p>
              <div className="flex items-center gap-[12px] mt-[12px]">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 border text-[11px]">
                  {clinic.skill_category || 'General'}
                </Badge>
                {clinic.certification_offered && (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border text-[11px]">
                    Certificate Offered
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Startup Stories Tab Component
function StartupStoriesTab({ startups, loading, onUpdate }: {
  startups: StartupStory[]
  loading: boolean
  onUpdate: () => void
}) {
  return (
    <div className="space-y-[20px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Startup Stories
        </h3>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]">
          <Plus className="h-[16px] w-[16px] mr-[8px]" />
          Add Startup
        </Button>
      </div>
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading startups...</div>
      ) : startups.length === 0 ? (
        <div className="vision-glass-card p-[32px] text-center" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
          <Rocket className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-white mb-[8px]">No Startup Stories Yet</h3>
          <p className="text-white/60 text-[13px]">Add your first startup pitch to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {startups.map((startup) => (
            <div key={startup.id} className="vision-glass-card p-[20px]" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
              <h4 className="text-[15px] font-semibold text-white mb-[8px]">{startup.startup_name}</h4>
              <p className="text-white/60 text-[12px] mb-[8px]">Founder: {startup.founder_name}</p>
              <p className="text-white/60 text-[13px] line-clamp-2">{startup.description}</p>
              <div className="flex items-center gap-[12px] mt-[12px]">
                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 border text-[11px]">
                  {startup.funding_stage || 'Early Stage'}
                </Badge>
                <Badge className={`border text-[11px] ${startup.confirmation_status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                  {startup.confirmation_status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Exhibitors Tab Component
function ExhibitorsTab({ exhibitors, loading, onUpdate }: {
  exhibitors: Exhibitor[]
  loading: boolean
  onUpdate: () => void
}) {
  const getTierBadge = (tier: string) => {
    const tierConfig = {
      diamond: { label: 'Diamond', className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '💎' },
      platinum: { label: 'Platinum', className: 'bg-gray-300/20 text-gray-300 border-gray-300/30', icon: '⭐' },
      gold: { label: 'Gold', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '🥇' },
      silver: { label: 'Silver', className: 'bg-gray-400/20 text-gray-400 border-gray-400/30', icon: '🥈' },
      bronze: { label: 'Bronze', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: '🥉' }
    }
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.silver
    return (
      <Badge className={`${config.className} border text-[11px] px-[12px] py-[4px] rounded-[8px]`}>
        {config.icon} {config.label}
      </Badge>
    )
  }

  // Group exhibitors by tier
  const groupedExhibitors = exhibitors.reduce((acc, exhibitor) => {
    const tier = exhibitor.tier
    if (!acc[tier]) acc[tier] = []
    acc[tier].push(exhibitor)
    return acc
  }, {} as Record<string, Exhibitor[]>)

  const tierOrder = ['diamond', 'platinum', 'gold', 'silver', 'bronze']

  return (
    <div className="space-y-[20px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Exhibiting Companies
        </h3>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]">
          <Plus className="h-[16px] w-[16px] mr-[8px]" />
          Add Exhibitor
        </Button>
      </div>
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading exhibitors...</div>
      ) : exhibitors.length === 0 ? (
        <div className="vision-glass-card p-[32px] text-center" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
          <Building2 className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-white mb-[8px]">No Exhibitors Yet</h3>
          <p className="text-white/60 text-[13px]">Add your first exhibiting company to get started</p>
        </div>
      ) : (
        <div className="space-y-[24px]">
          {tierOrder.map((tier) => {
            const tierExhibitors = groupedExhibitors[tier] || []
            if (tierExhibitors.length === 0) return null

            return (
              <div key={tier}>
                <h4 className="text-[16px] font-semibold text-white mb-[16px] flex items-center gap-[12px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                  {getTierBadge(tier)}
                  <span className="text-white/60 text-[13px]">({tierExhibitors.length} {tierExhibitors.length === 1 ? 'company' : 'companies'})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                  {tierExhibitors.map((exhibitor) => (
                    <div key={exhibitor.id} className="vision-glass-card p-[20px] hover:scale-[1.02] transition-all" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
                      <div className="flex items-start justify-between mb-[12px]">
                        <div className="flex-1">
                          <h5 className="text-[15px] font-semibold text-white mb-[4px]">{exhibitor.company_name}</h5>
                          {exhibitor.booth_number && (
                            <p className="text-white/60 text-[12px]">Booth: {exhibitor.booth_number}</p>
                          )}
                        </div>
                        {exhibitor.logo_url && (
                          <div className="w-[40px] h-[40px] bg-white/10 rounded-[8px] flex items-center justify-center">
                            <Building2 className="h-[20px] w-[20px] text-white/60" />
                          </div>
                        )}
                      </div>
                      {exhibitor.description && (
                        <p className="text-white/60 text-[13px] line-clamp-2 mb-[12px]">{exhibitor.description}</p>
                      )}
                      <div className="flex items-center gap-[8px] flex-wrap">
                        {exhibitor.industry && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-[11px]">
                            {exhibitor.industry}
                          </Badge>
                        )}
                        <Badge className={`border text-[11px] ${exhibitor.status === 'confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                          {exhibitor.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Food Court Tab Component
function FoodCourtTab({ vendors, loading, onUpdate }: {
  vendors: FoodVendor[]
  loading: boolean
  onUpdate: () => void
}) {
  return (
    <div className="space-y-[20px]">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-semibold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
          Food Court Vendors
        </h3>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 h-[40px] rounded-[12px]">
          <Plus className="h-[16px] w-[16px] mr-[8px]" />
          Add Vendor
        </Button>
      </div>
      {loading ? (
        <div className="text-white/60 text-center py-[40px]">Loading vendors...</div>
      ) : vendors.length === 0 ? (
        <div className="vision-glass-card p-[32px] text-center" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}>
          <UtensilsCrossed className="h-[48px] w-[48px] text-white/40 mx-auto mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-white mb-[8px]">No Food Vendors Yet</h3>
          <p className="text-white/60 text-[13px]">Add your first food vendor to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="vision-glass-card p-[20px] hover:scale-[1.02] transition-all" style={{ background: 'rgba(26, 31, 55, 0.5)', backdropFilter: 'blur(21px)', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }}>
              <div className="flex items-start justify-between mb-[12px]">
                <div className="flex-1">
                  <h5 className="text-[15px] font-semibold text-white mb-[4px]">{vendor.vendor_name}</h5>
                  {vendor.cuisine_type && (
                    <p className="text-white/60 text-[12px]">{vendor.cuisine_type}</p>
                  )}
                </div>
                <div className="w-[40px] h-[40px] bg-white/10 rounded-[8px] flex items-center justify-center">
                  <UtensilsCrossed className="h-[20px] w-[20px] text-white/60" />
                </div>
              </div>
              {vendor.description && (
                <p className="text-white/60 text-[13px] line-clamp-2 mb-[12px]">{vendor.description}</p>
              )}
              <div className="flex items-center gap-[8px] flex-wrap mb-[12px]">
                {vendor.average_price_range && (
                  <Badge className={`border text-[11px] ${
                    vendor.average_price_range === 'budget' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    vendor.average_price_range === 'moderate' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                    'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  }`}>
                    {vendor.average_price_range}
                  </Badge>
                )}
                {vendor.booth_number && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-[11px]">
                    Booth: {vendor.booth_number}
                  </Badge>
                )}
              </div>
              {vendor.operating_hours_start && vendor.operating_hours_end && (
                <p className="text-white/60 text-[12px] mb-[8px]">
                  ⏰ {vendor.operating_hours_start} - {vendor.operating_hours_end}
                </p>
              )}
              <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                {vendor.accepts_cash && <span>💵 Cash</span>}
                {vendor.accepts_card && <span>💳 Card</span>}
                {vendor.accepts_mobile_payment && <span>📱 Mobile</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



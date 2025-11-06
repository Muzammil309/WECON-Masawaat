'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Users,
  FileText,
  UserCheck,
  Mail,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  Filter,
  Upload,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

interface Speaker {
  id: string
  full_name: string
  email: string
  bio: string
  company: string
  title: string
  photo_url?: string
  status: 'pending' | 'approved' | 'rejected'
  session_count: number
  created_at: string
}

interface AbstractSubmission {
  id: string
  speaker_id: string
  speaker_name: string
  title: string
  description: string
  category: string
  status: 'submitted' | 'under_review' | 'approved' | 'rejected'
  submitted_at: string
  reviewer_id?: string
}

interface Reviewer {
  id: string
  full_name: string
  email: string
  expertise: string[]
  assigned_count: number
}

export function SpeakersContent() {
  const [loading, setLoading] = useState(false)
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [abstracts, setAbstracts] = useState<AbstractSubmission[]>([])
  const [reviewers, setReviewers] = useState<Reviewer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchSpeakers()
    fetchAbstracts()
    fetchReviewers()
  }, [])

  const fetchSpeakers = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual Supabase query
      const mockSpeakers: Speaker[] = [
        {
          id: '1',
          full_name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@example.com',
          bio: 'AI researcher and tech innovator',
          company: 'Tech Innovations Inc',
          title: 'Chief AI Officer',
          status: 'approved',
          session_count: 3,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          full_name: 'Michael Chen',
          email: 'michael.chen@example.com',
          bio: 'Cloud architecture expert',
          company: 'Cloud Solutions Ltd',
          title: 'Senior Architect',
          status: 'pending',
          session_count: 1,
          created_at: new Date().toISOString()
        }
      ]
      setSpeakers(mockSpeakers)
    } catch (error: any) {
      console.error('Error fetching speakers:', error)
      toast.error('Failed to load speakers')
    } finally {
      setLoading(false)
    }
  }

  const fetchAbstracts = async () => {
    const mockAbstracts: AbstractSubmission[] = [
      {
        id: '1',
        speaker_id: '1',
        speaker_name: 'Dr. Sarah Johnson',
        title: 'The Future of AI in Healthcare',
        description: 'Exploring how AI is transforming medical diagnostics',
        category: 'Technology',
        status: 'approved',
        submitted_at: new Date().toISOString()
      },
      {
        id: '2',
        speaker_id: '2',
        speaker_name: 'Michael Chen',
        title: 'Scaling Cloud Infrastructure',
        description: 'Best practices for enterprise cloud deployment',
        category: 'Cloud Computing',
        status: 'under_review',
        submitted_at: new Date().toISOString()
      }
    ]
    setAbstracts(mockAbstracts)
  }

  const fetchReviewers = async () => {
    const mockReviewers: Reviewer[] = [
      {
        id: '1',
        full_name: 'Prof. David Williams',
        email: 'david.williams@university.edu',
        expertise: ['AI', 'Machine Learning', 'Healthcare'],
        assigned_count: 5
      },
      {
        id: '2',
        full_name: 'Dr. Emily Brown',
        email: 'emily.brown@research.org',
        expertise: ['Cloud Computing', 'DevOps', 'Security'],
        assigned_count: 3
      }
    ]
    setReviewers(mockReviewers)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/15 text-green-500'
      case 'pending': case 'submitted': case 'under_review': return 'bg-yellow-500/15 text-yellow-500'
      case 'rejected': return 'bg-red-500/15 text-red-500'
      default: return 'bg-gray-500/15 text-gray-500'
    }
  }

  return (
    <div className="space-y-[24px]">
      <Tabs defaultValue="speakers" className="space-y-[24px]">
        <TabsList className="bg-white/5 border border-white/10 p-[6px] rounded-[16px] inline-flex gap-[6px]">
          <TabsTrigger
            value="speakers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Users className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Speakers
          </TabsTrigger>
          <TabsTrigger
            value="abstracts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <FileText className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Abstract Submissions
          </TabsTrigger>
          <TabsTrigger
            value="reviewers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <UserCheck className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Reviewers
          </TabsTrigger>
        </TabsList>

        {/* Speakers Tab */}
        <TabsContent value="speakers" className="space-y-[20px]">
          <div className="flex items-center justify-between gap-[16px]">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-white/40" />
                <Input
                  placeholder="Search speakers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-[44px] bg-white/5 border-white/10 text-white placeholder:text-white/40 rounded-[12px] h-[44px]"
                  style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                />
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-[24px] py-[12px] rounded-[12px] text-[14px] font-semibold hover:scale-[1.02] transition-all flex items-center gap-[8px] h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Add Speaker
            </Button>
          </div>

          <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-3">
            {speakers.map((speaker) => (
              <div
                key={speaker.id}
                className="vision-glass-card p-[24px] hover:bg-white/8 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <div
                      className="flex items-center justify-center w-[56px] h-[56px] rounded-full text-[20px] font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)' }}
                    >
                      {speaker.full_name.charAt(0)}
                    </div>
                    <div>
                      <h4
                        className="text-[15px] font-bold text-white mb-[4px]"
                        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                      >
                        {speaker.full_name}
                      </h4>
                      <p
                        className="text-[13px] text-white/60"
                        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                      >
                        {speaker.title}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(speaker.status)} text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]`}>
                    {speaker.status}
                  </Badge>
                </div>

                <p
                  className="text-[13px] text-white/70 mb-[16px] line-clamp-2"
                  style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                >
                  {speaker.bio}
                </p>

                <div className="flex items-center gap-[12px] mb-[16px] text-[12px] text-white/60">
                  <span className="flex items-center gap-[6px]">
                    <Mail className="h-[14px] w-[14px]" />
                    {speaker.email}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-[16px] border-t border-white/10">
                  <span className="text-[13px] text-white/60" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    {speaker.session_count} sessions
                  </span>
                  <div className="flex items-center gap-[8px]">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-[32px] w-[32px] p-0 hover:bg-white/10 text-white/60 hover:text-white"
                    >
                      <Edit className="h-[16px] w-[16px]" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-[32px] w-[32px] p-0 hover:bg-red-500/10 text-white/60 hover:text-red-500"
                    >
                      <Trash2 className="h-[16px] w-[16px]" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Abstract Submissions Tab */}
        <TabsContent value="abstracts" className="space-y-[20px]">
          <div className="grid gap-[20px]">
            {abstracts.map((abstract) => (
              <div
                key={abstract.id}
                className="vision-glass-card p-[24px] hover:bg-white/8 transition-all"
              >
                <div className="flex items-start justify-between mb-[16px]">
                  <div className="flex-1">
                    <h4
                      className="text-[16px] font-bold text-white mb-[8px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {abstract.title}
                    </h4>
                    <p
                      className="text-[13px] text-white/60 mb-[12px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      by {abstract.speaker_name}
                    </p>
                    <p
                      className="text-[13px] text-white/70 mb-[12px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {abstract.description}
                    </p>
                    <div className="flex items-center gap-[12px]">
                      <Badge className="bg-purple-500/15 text-purple-400 text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]">
                        {abstract.category}
                      </Badge>
                      <Badge className={`${getStatusColor(abstract.status)} text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]`}>
                        {abstract.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <Button
                      size="sm"
                      className="bg-green-500/15 text-green-500 hover:bg-green-500/25 h-[36px] px-[16px] rounded-[10px] text-[13px] font-semibold"
                    >
                      <CheckCircle className="h-[16px] w-[16px] mr-[6px]" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-500/15 text-red-500 hover:bg-red-500/25 h-[36px] px-[16px] rounded-[10px] text-[13px] font-semibold"
                    >
                      <XCircle className="h-[16px] w-[16px] mr-[6px]" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Reviewers Tab */}
        <TabsContent value="reviewers" className="space-y-[20px]">
          <div className="flex items-center justify-between gap-[16px] mb-[20px]">
            <h3
              className="text-[18px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Abstract Reviewers
            </h3>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-[24px] py-[12px] rounded-[12px] text-[14px] font-semibold hover:scale-[1.02] transition-all flex items-center gap-[8px] h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Add Reviewer
            </Button>
          </div>

          <div className="grid gap-[20px] md:grid-cols-2">
            {reviewers.map((reviewer) => (
              <div
                key={reviewer.id}
                className="vision-glass-card p-[24px] hover:bg-white/8 transition-all"
              >
                <div className="flex items-start justify-between mb-[16px]">
                  <div>
                    <h4
                      className="text-[15px] font-bold text-white mb-[4px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {reviewer.full_name}
                    </h4>
                    <p
                      className="text-[13px] text-white/60 mb-[12px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {reviewer.email}
                    </p>
                    <div className="flex flex-wrap gap-[8px] mb-[12px]">
                      {reviewer.expertise.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-500/15 text-blue-400 text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-[16px] border-t border-white/10">
                  <span className="text-[13px] text-white/60" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                    {reviewer.assigned_count} abstracts assigned
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-[32px] px-[12px] hover:bg-white/10 text-white/60 hover:text-white text-[13px] font-semibold"
                  >
                    Assign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


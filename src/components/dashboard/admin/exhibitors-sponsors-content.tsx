'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Store,
  Award,
  Users,
  QrCode,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

interface Exhibitor {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  booth_number: string
  booth_size: string
  category: string
  logo_url?: string
  leads_captured: number
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
}

interface Sponsor {
  id: string
  company_name: string
  tier: 'platinum' | 'gold' | 'silver' | 'bronze'
  contact_name: string
  email: string
  phone: string
  logo_url?: string
  amount: number
  benefits: string[]
  status: 'active' | 'pending' | 'expired'
  created_at: string
}

interface Lead {
  id: string
  exhibitor_id: string
  exhibitor_name: string
  attendee_name: string
  attendee_email: string
  attendee_phone: string
  notes: string
  captured_at: string
  follow_up_status: 'new' | 'contacted' | 'qualified' | 'converted'
}

export function ExhibitorsSponsorsContent() {
  const [loading, setLoading] = useState(false)
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchExhibitors()
    fetchSponsors()
    fetchLeads()
  }, [])

  const fetchExhibitors = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual Supabase query
      const mockExhibitors: Exhibitor[] = [
        {
          id: '1',
          company_name: 'Tech Solutions Inc',
          contact_name: 'John Smith',
          email: 'john@techsolutions.com',
          phone: '+1 234 567 8900',
          booth_number: 'A-101',
          booth_size: '3x3m',
          category: 'Technology',
          leads_captured: 45,
          status: 'confirmed',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          company_name: 'Innovation Labs',
          contact_name: 'Sarah Johnson',
          email: 'sarah@innovationlabs.com',
          phone: '+1 234 567 8901',
          booth_number: 'B-205',
          booth_size: '6x6m',
          category: 'Innovation',
          leads_captured: 67,
          status: 'confirmed',
          created_at: new Date().toISOString()
        }
      ]
      setExhibitors(mockExhibitors)
    } catch (error: any) {
      console.error('Error fetching exhibitors:', error)
      toast.error('Failed to load exhibitors')
    } finally {
      setLoading(false)
    }
  }

  const fetchSponsors = async () => {
    const mockSponsors: Sponsor[] = [
      {
        id: '1',
        company_name: 'Global Corp',
        tier: 'platinum',
        contact_name: 'Michael Brown',
        email: 'michael@globalcorp.com',
        phone: '+1 234 567 8902',
        amount: 50000,
        benefits: ['Logo on website', 'Keynote slot', 'Premium booth'],
        status: 'active',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        company_name: 'Future Tech',
        tier: 'gold',
        contact_name: 'Emily Davis',
        email: 'emily@futuretech.com',
        phone: '+1 234 567 8903',
        amount: 25000,
        benefits: ['Logo on website', 'Booth space'],
        status: 'active',
        created_at: new Date().toISOString()
      }
    ]
    setSponsors(mockSponsors)
  }

  const fetchLeads = async () => {
    const mockLeads: Lead[] = [
      {
        id: '1',
        exhibitor_id: '1',
        exhibitor_name: 'Tech Solutions Inc',
        attendee_name: 'Robert Wilson',
        attendee_email: 'robert@example.com',
        attendee_phone: '+1 234 567 8904',
        notes: 'Interested in enterprise solutions',
        captured_at: new Date().toISOString(),
        follow_up_status: 'new'
      },
      {
        id: '2',
        exhibitor_id: '2',
        exhibitor_name: 'Innovation Labs',
        attendee_name: 'Jennifer Martinez',
        attendee_email: 'jennifer@example.com',
        attendee_phone: '+1 234 567 8905',
        notes: 'Looking for cloud solutions',
        captured_at: new Date().toISOString(),
        follow_up_status: 'contacted'
      }
    ]
    setLeads(mockLeads)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500/15 text-purple-400'
      case 'gold': return 'bg-yellow-500/15 text-yellow-400'
      case 'silver': return 'bg-gray-400/15 text-gray-300'
      case 'bronze': return 'bg-orange-500/15 text-orange-400'
      default: return 'bg-gray-500/15 text-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': case 'active': return 'bg-green-500/15 text-green-500'
      case 'pending': return 'bg-yellow-500/15 text-yellow-500'
      case 'cancelled': case 'expired': return 'bg-red-500/15 text-red-500'
      default: return 'bg-gray-500/15 text-gray-500'
    }
  }

  return (
    <div className="space-y-[24px]">
      <Tabs defaultValue="exhibitors" className="space-y-[24px]">
        <TabsList className="bg-white/5 border border-white/10 p-[6px] rounded-[16px] inline-flex gap-[6px]">
          <TabsTrigger
            value="exhibitors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Store className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Exhibitors
          </TabsTrigger>
          <TabsTrigger
            value="sponsors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Award className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Sponsors
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            <Users className="h-[16px] w-[16px]" strokeWidth={2.5} />
            Lead Capture
          </TabsTrigger>
        </TabsList>

        {/* Exhibitors Tab */}
        <TabsContent value="exhibitors" className="space-y-[20px]">
          <div className="flex items-center justify-between gap-[16px]">
            <h3
              className="text-[18px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Exhibitor Management
            </h3>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-[24px] py-[12px] rounded-[12px] text-[14px] font-semibold hover:scale-[1.02] transition-all flex items-center gap-[8px] h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Add Exhibitor
            </Button>
          </div>

          <div className="grid gap-[20px] md:grid-cols-2">
            {exhibitors.map((exhibitor) => (
              <div
                key={exhibitor.id}
                className="vision-glass-card p-[24px] hover:bg-white/8 transition-all"
              >
                <div className="flex items-start justify-between mb-[16px]">
                  <div className="flex-1">
                    <div className="flex items-center gap-[12px] mb-[8px]">
                      <div
                        className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] text-[18px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)' }}
                      >
                        {exhibitor.company_name.charAt(0)}
                      </div>
                      <div>
                        <h4
                          className="text-[15px] font-bold text-white mb-[2px]"
                          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                        >
                          {exhibitor.company_name}
                        </h4>
                        <p
                          className="text-[13px] text-white/60"
                          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                        >
                          Booth {exhibitor.booth_number}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-[8px] mb-[12px]">
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <Mail className="h-[14px] w-[14px]" />
                        {exhibitor.email}
                      </div>
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <Phone className="h-[14px] w-[14px]" />
                        {exhibitor.phone}
                      </div>
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <MapPin className="h-[14px] w-[14px]" />
                        {exhibitor.booth_size} booth
                      </div>
                    </div>
                    <div className="flex items-center gap-[8px] mb-[12px]">
                      <Badge className="bg-blue-500/15 text-blue-400 text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]">
                        {exhibitor.category}
                      </Badge>
                      <Badge className={`${getStatusColor(exhibitor.status)} text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]`}>
                        {exhibitor.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-[16px] border-t border-white/10">
                  <div className="flex items-center gap-[6px] text-[13px] text-white/60">
                    <TrendingUp className="h-[14px] w-[14px] text-green-500" />
                    <span style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                      {exhibitor.leads_captured} leads captured
                    </span>
                  </div>
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

        {/* Sponsors Tab */}
        <TabsContent value="sponsors" className="space-y-[20px]">
          <div className="flex items-center justify-between gap-[16px]">
            <h3
              className="text-[18px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Sponsorship Management
            </h3>
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-[24px] py-[12px] rounded-[12px] text-[14px] font-semibold hover:scale-[1.02] transition-all flex items-center gap-[8px] h-[44px]"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              <Plus className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Add Sponsor
            </Button>
          </div>

          <div className="grid gap-[20px] md:grid-cols-2">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="vision-glass-card p-[24px] hover:bg-white/8 transition-all"
              >
                <div className="flex items-start justify-between mb-[16px]">
                  <div className="flex-1">
                    <div className="flex items-center gap-[12px] mb-[8px]">
                      <div
                        className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] text-[18px] font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)' }}
                      >
                        {sponsor.company_name.charAt(0)}
                      </div>
                      <div>
                        <h4
                          className="text-[15px] font-bold text-white mb-[2px]"
                          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                        >
                          {sponsor.company_name}
                        </h4>
                        <Badge className={`${getTierColor(sponsor.tier)} text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px] uppercase`}>
                          {sponsor.tier}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-[8px] mb-[12px]">
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <Mail className="h-[14px] w-[14px]" />
                        {sponsor.email}
                      </div>
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <DollarSign className="h-[14px] w-[14px]" />
                        ${sponsor.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-[6px] mb-[12px]">
                      {sponsor.benefits.slice(0, 2).map((benefit, index) => (
                        <Badge
                          key={index}
                          className="bg-green-500/15 text-green-400 text-[11px] font-semibold px-[8px] py-[2px] rounded-[6px]"
                        >
                          {benefit}
                        </Badge>
                      ))}
                      {sponsor.benefits.length > 2 && (
                        <Badge className="bg-white/10 text-white/60 text-[11px] font-semibold px-[8px] py-[2px] rounded-[6px]">
                          +{sponsor.benefits.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-[16px] border-t border-white/10">
                  <Badge className={`${getStatusColor(sponsor.status)} text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]`}>
                    {sponsor.status}
                  </Badge>
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

        {/* Lead Capture Tab */}
        <TabsContent value="leads" className="space-y-[20px]">
          <div className="flex items-center justify-between gap-[16px]">
            <h3
              className="text-[18px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Lead Capture & Management
            </h3>
            <div className="flex items-center gap-[12px]">
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/10 px-[20px] py-[12px] rounded-[12px] text-[14px] font-semibold flex items-center gap-[8px] h-[44px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <Download className="h-[18px] w-[18px]" strokeWidth={2.5} />
                Export Leads
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-[24px] py-[12px] rounded-[12px] text-[14px] font-semibold hover:scale-[1.02] transition-all flex items-center gap-[8px] h-[44px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <QrCode className="h-[18px] w-[18px]" strokeWidth={2.5} />
                Scan QR Code
              </Button>
            </div>
          </div>

          <div className="grid gap-[16px]">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="vision-glass-card p-[20px] hover:bg-white/8 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-[12px] mb-[12px]">
                      <div>
                        <h4
                          className="text-[15px] font-bold text-white mb-[4px]"
                          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                        >
                          {lead.attendee_name}
                        </h4>
                        <p
                          className="text-[13px] text-white/60"
                          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                        >
                          Captured by {lead.exhibitor_name}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-[12px] mb-[12px]">
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <Mail className="h-[14px] w-[14px]" />
                        {lead.attendee_email}
                      </div>
                      <div className="flex items-center gap-[8px] text-[12px] text-white/60">
                        <Phone className="h-[14px] w-[14px]" />
                        {lead.attendee_phone}
                      </div>
                    </div>
                    {lead.notes && (
                      <p
                        className="text-[13px] text-white/70 mb-[12px]"
                        style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                      >
                        {lead.notes}
                      </p>
                    )}
                  </div>
                  <Badge className="bg-blue-500/15 text-blue-400 text-[11px] font-semibold px-[10px] py-[4px] rounded-[8px]">
                    {lead.follow_up_status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


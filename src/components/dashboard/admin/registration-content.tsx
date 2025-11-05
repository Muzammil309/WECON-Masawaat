'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { 
  Plus, 
  FileText, 
  Globe, 
  Image as ImageIcon, 
  Video, 
  Settings as SettingsIcon,
  Eye,
  Edit,
  Copy,
  ExternalLink,
  Users,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function RegistrationContent() {
  const [loading, setLoading] = useState(false)
  const [registrationPages, setRegistrationPages] = useState<any[]>([])
  const [customForms, setCustomForms] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchRegistrationData()
  }, [])

  const fetchRegistrationData = async () => {
    try {
      setLoading(true)
      // Fetch registration pages and forms
      const { data: pages, error: pagesError } = await supabase
        .from('em_registration_pages')
        .select('*')
        .order('created_at', { ascending: false })

      const { data: forms, error: formsError } = await supabase
        .from('em_custom_forms')
        .select('*')
        .order('created_at', { ascending: false })

      if (pagesError) console.error('Error fetching pages:', pagesError)
      if (formsError) console.error('Error fetching forms:', formsError)

      setRegistrationPages(pages || [])
      setCustomForms(forms || [])
    } catch (error: any) {
      console.error('Error fetching registration data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Registration Management</h2>
          <p className="text-white/60 text-sm mt-1">Create branded registration pages and custom forms</p>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="pages" className="data-[state=active]:bg-white/10">
            <ImageIcon className="h-4 w-4 mr-2" />
            Registration Pages
          </TabsTrigger>
          <TabsTrigger value="forms" className="data-[state=active]:bg-white/10">
            <FileText className="h-4 w-4 mr-2" />
            Custom Forms
          </TabsTrigger>
          <TabsTrigger value="languages" className="data-[state=active]:bg-white/10">
            <Globe className="h-4 w-4 mr-2" />
            Multi-lingual
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/10">
            <TrendingUp className="h-4 w-4 mr-2" />
            Territory Tracking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <RegistrationPagesTab pages={registrationPages} onUpdate={fetchRegistrationData} />
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          <CustomFormsTab forms={customForms} onUpdate={fetchRegistrationData} />
        </TabsContent>

        <TabsContent value="languages" className="space-y-6">
          <MultiLingualTab />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <TerritoryTrackingTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RegistrationPagesTab({ pages, onUpdate }: { pages: any[]; onUpdate: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/60 text-sm">Build branded registration pages with captivating images, videos & graphics</p>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={() => toast.info('Page builder coming soon')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <ImageIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No registration pages yet</h3>
          <p className="text-white/60 mb-4">Create your first branded registration page</p>
          <Button onClick={() => toast.info('Page builder coming soon')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <RegistrationPageCard key={page.id} page={page} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}

function CustomFormsTab({ forms, onUpdate }: { forms: any[]; onUpdate: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/60 text-sm">Set up custom forms for different audiences, events & regions</p>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={() => toast.info('Form builder coming soon')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Form
        </Button>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <FileText className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No custom forms yet</h3>
          <p className="text-white/60 mb-4">Create custom forms for your events</p>
        </div>
      ) : null}
    </div>
  )
}

function MultiLingualTab() {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', enabled: true },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', enabled: false },
    { code: 'fr', name: 'French', flag: '🇫🇷', enabled: false },
    { code: 'de', name: 'German', flag: '🇩🇪', enabled: false },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', enabled: false },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', enabled: false },
  ]

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Create multi-lingual content to reach global attendees</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {languages.map((lang) => (
          <div key={lang.code} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <div>
                  <h4 className="font-semibold text-white">{lang.name}</h4>
                  <p className="text-white/60 text-sm">{lang.code.toUpperCase()}</p>
                </div>
              </div>
              <Badge className={lang.enabled ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}>
                {lang.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TerritoryTrackingTab() {
  const territories = [
    { name: 'North America', registrations: 1234, growth: '+12%', color: 'blue' },
    { name: 'Europe', registrations: 856, growth: '+8%', color: 'purple' },
    { name: 'Asia Pacific', registrations: 642, growth: '+15%', color: 'green' },
    { name: 'Latin America', registrations: 423, growth: '+5%', color: 'yellow' },
    { name: 'Middle East', registrations: 312, growth: '+10%', color: 'orange' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Track registrations by territory to evaluate field team performance</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {territories.map((territory) => (
          <div key={territory.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-purple-400" />
              <h4 className="font-semibold text-white">{territory.name}</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Registrations</span>
                <span className="text-2xl font-bold text-white">{territory.registrations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Growth</span>
                <Badge className="bg-green-500/20 text-green-400">{territory.growth}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RegistrationPageCard({ page, onUpdate }: { page: any; onUpdate: () => void }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg mb-4 flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-white/40" />
      </div>
      <h4 className="font-semibold text-white mb-2">{page.title}</h4>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" className="flex-1 text-white/80 hover:text-white">
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button size="sm" variant="ghost" className="flex-1 text-white/80 hover:text-white">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  QrCode,
  Printer,
  Smartphone,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Settings as SettingsIcon,
  Shield,
  Scan,
  Download,
  Upload,
  Plus,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CheckinBadgesContent() {
  const [loading, setLoading] = useState(false)
  const [checkInStats, setCheckInStats] = useState({
    totalCheckIns: 0,
    todayCheckIns: 0,
    activeKiosks: 0,
    badgesPrinted: 0
  })
  const supabase = createClient()

  useEffect(() => {
    fetchCheckInStats()
  }, [])

  const fetchCheckInStats = async () => {
    try {
      setLoading(true)
      // Fetch check-in statistics
      const { data, error } = await supabase
        .from('em_check_ins')
        .select('*')

      if (error) throw error

      const today = new Date().toISOString().split('T')[0]
      const todayCheckIns = data?.filter(c => c.checked_in_at?.startsWith(today)).length || 0

      setCheckInStats({
        totalCheckIns: data?.length || 0,
        todayCheckIns,
        activeKiosks: 3, // Mock data
        badgesPrinted: data?.filter(c => c.badge_printed).length || 0
      })
    } catch (error: any) {
      console.error('Error fetching check-in stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Check-in & Badge Management</h2>
          <p className="text-white/60 text-sm mt-1">Manage event check-ins and badge printing</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600"
          onClick={() => toast.info('Opening check-in kiosk...')}
        >
          <Scan className="h-4 w-4 mr-2" />
          Open Kiosk
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Check-ins"
          value={checkInStats.totalCheckIns}
          icon={<CheckCircle className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Today's Check-ins"
          value={checkInStats.todayCheckIns}
          icon={<Clock className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Active Kiosks"
          value={checkInStats.activeKiosks}
          icon={<Smartphone className="h-5 w-5" />}
          color="purple"
        />
        <StatCard
          title="Badges Printed"
          value={checkInStats.badgesPrinted}
          icon={<Printer className="h-5 w-5" />}
          color="orange"
        />
      </div>

      <Tabs defaultValue="qr-scanning" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="qr-scanning" className="data-[state=active]:bg-white/10">
            <QrCode className="h-4 w-4 mr-2" />
            QR Scanning
          </TabsTrigger>
          <TabsTrigger value="badge-design" className="data-[state=active]:bg-white/10">
            <Printer className="h-4 w-4 mr-2" />
            Badge Design
          </TabsTrigger>
          <TabsTrigger value="kiosks" className="data-[state=active]:bg-white/10">
            <Smartphone className="h-4 w-4 mr-2" />
            Kiosks
          </TabsTrigger>
          <TabsTrigger value="access-control" className="data-[state=active]:bg-white/10">
            <Shield className="h-4 w-4 mr-2" />
            Access Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr-scanning" className="space-y-6">
          <QRScanningTab />
        </TabsContent>

        <TabsContent value="badge-design" className="space-y-6">
          <BadgeDesignTab />
        </TabsContent>

        <TabsContent value="kiosks" className="space-y-6">
          <KiosksTab />
        </TabsContent>

        <TabsContent value="access-control" className="space-y-6">
          <AccessControlTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    green: 'from-green-600/20 to-green-600/5 border-green-500/30',
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-500/30',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-500/30',
    orange: 'from-orange-600/20 to-orange-600/5 border-orange-500/30',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/10 rounded-lg">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-white/60 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  )
}

function QRScanningTab() {
  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Enable quick event entries and session check-ins via QR-code scanning</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <QrCode className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Event Entry Scanning</h3>
              <p className="text-white/60 text-sm">Main event check-in</p>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
            <Scan className="h-4 w-4 mr-2" />
            Start Scanning
          </Button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Session Check-in</h3>
              <p className="text-white/60 text-sm">Track session attendance</p>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            <Scan className="h-4 w-4 mr-2" />
            Start Scanning
          </Button>
        </div>
      </div>
    </div>
  )
}

function BadgeDesignTab() {
  const badgeTypes = [
    { name: 'Standard Badge', type: 'PVC', size: '3.5" x 2.25"', printer: 'Zebra ZC300' },
    { name: 'VIP Badge', type: 'PVC', size: '3.5" x 2.25"', printer: 'Zebra ZC300' },
    { name: 'Speaker Badge', type: 'Paper', size: '4" x 3"', printer: 'Epson TM-C3500' },
    { name: 'Staff Badge', type: 'PVC', size: '3.5" x 2.25"', printer: 'Zebra ZC300' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/60 text-sm">Customize badge designs with attendee data, company logos, and QR codes</p>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Design
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {badgeTypes.map((badge) => (
          <div key={badge.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-white mb-1">{badge.name}</h4>
                <p className="text-white/60 text-sm">{badge.type} • {badge.size}</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">Active</Badge>
            </div>
            <div className="space-y-2 text-sm text-white/60 mb-4">
              <div className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>{badge.printer}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="flex-1 text-white/80 hover:text-white">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button size="sm" variant="ghost" className="text-white/80 hover:text-white">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function KiosksTab() {
  const kiosks = [
    { id: 1, name: 'Main Entrance', status: 'active', device: 'iPad Pro', checkIns: 234 },
    { id: 2, name: 'Registration Desk', status: 'active', device: 'Samsung Tab', checkIns: 189 },
    { id: 3, name: 'Session Hall A', status: 'inactive', device: 'iPad Air', checkIns: 0 },
  ]

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Turn any device (smartphone or tablet) into a check-in kiosk</p>

      <div className="grid gap-4">
        {kiosks.map((kiosk) => (
          <div key={kiosk.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Smartphone className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">{kiosk.name}</h4>
                  <p className="text-white/60 text-sm">{kiosk.device}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{kiosk.checkIns}</p>
                  <p className="text-white/60 text-sm">Check-ins</p>
                </div>
                <Badge className={kiosk.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                  {kiosk.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccessControlTab() {
  const accessLevels = [
    { name: 'VIP Access', color: 'purple', permissions: ['All Sessions', 'VIP Lounge', 'Networking Area'] },
    { name: 'Speaker Access', color: 'blue', permissions: ['Speaker Room', 'Main Hall', 'Networking Area'] },
    { name: 'Standard Access', color: 'green', permissions: ['Main Hall', 'Networking Area'] },
    { name: 'Staff Access', color: 'orange', permissions: ['All Areas', 'Admin Panel'] },
  ]

  return (
    <div className="space-y-4">
      <p className="text-white/60 text-sm">Manage access control by issuing different badge types and permissions</p>

      <div className="grid gap-4 md:grid-cols-2">
        {accessLevels.map((level) => (
          <div key={level.name} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 bg-${level.color}-500/20 rounded-lg`}>
                <Shield className={`h-5 w-5 text-${level.color}-400`} />
              </div>
              <h4 className="font-semibold text-white">{level.name}</h4>
            </div>
            <div className="space-y-2">
              {level.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>{permission}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


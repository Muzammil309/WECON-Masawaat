/**
 * Check-in Stations Monitoring Page
 * Admin dashboard for monitoring all check-in stations
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, RefreshCw, Wifi, WifiOff, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Station {
  id: string
  station_name: string
  location: string | null
  is_online: boolean
  device_type: string
  total_check_ins: number
  last_heartbeat: string
  pending_sync_count: number
}

export default function CheckInStationsPage() {
  const router = useRouter()
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch stations (mock data for now - implement API endpoint)
  const fetchStations = async () => {
    try {
      setLoading(true)
      // TODO: Implement actual API endpoint
      // const response = await fetch('/api/admin/check-in/stations')
      // const data = await response.json()
      // setStations(data)
      
      // Mock data for demonstration
      setStations([])
      toast.info('Station monitoring coming soon')
    } catch (error) {
      console.error('Error fetching stations:', error)
      toast.error('Failed to fetch stations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStations()
    const interval = setInterval(fetchStations, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-5 w-5" />
      case 'tablet':
        return <Tablet className="h-5 w-5" />
      case 'kiosk':
        return <Monitor className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`
    return `${Math.floor(diffSeconds / 3600)}h ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Check-in Stations</h1>
              <p className="text-sm text-slate-400">Monitor all active check-in stations</p>
            </div>
          </div>
          <Button
            onClick={fetchStations}
            variant="outline"
            size="sm"
            disabled={loading}
            className="bg-white/5 border-white/10 hover:bg-white/10"
          >
            <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Total Stations</p>
                <p className="text-3xl font-bold text-white">{stations.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Online</p>
                <p className="text-3xl font-bold text-green-400">
                  {stations.filter(s => s.is_online).length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Offline</p>
                <p className="text-3xl font-bold text-red-400">
                  {stations.filter(s => !s.is_online).length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Total Check-ins</p>
                <p className="text-3xl font-bold text-white">
                  {stations.reduce((sum, s) => sum + s.total_check_ins, 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stations List */}
        <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Active Stations</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mx-auto" />
              </div>
            ) : stations.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stations.map((station) => (
                  <Card key={station.id} className="border-white/10 bg-white/5">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* Station Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(station.device_type)}
                            <div>
                              <h3 className="font-semibold text-white">{station.station_name}</h3>
                              {station.location && (
                                <p className="text-xs text-slate-400">{station.location}</p>
                              )}
                            </div>
                          </div>
                          {station.is_online ? (
                            <Wifi className="h-5 w-5 text-green-500" />
                          ) : (
                            <WifiOff className="h-5 w-5 text-red-500" />
                          )}
                        </div>

                        {/* Station Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-slate-400">Check-ins</p>
                            <p className="text-white font-semibold">{station.total_check_ins}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Pending Sync</p>
                            <p className="text-white font-semibold">{station.pending_sync_count}</p>
                          </div>
                        </div>

                        {/* Last Seen */}
                        <div className="text-xs text-slate-400">
                          Last seen: {formatLastSeen(station.last_heartbeat)}
                        </div>

                        {/* Status Badge */}
                        <Badge
                          variant="outline"
                          className={cn(
                            station.is_online
                              ? 'bg-green-500/20 text-green-400 border-green-500/50'
                              : 'bg-red-500/20 text-red-400 border-red-500/50'
                          )}
                        >
                          {station.is_online ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Monitor className="h-12 w-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No active stations found</p>
                <p className="text-sm text-slate-500 mt-2">
                  Stations will appear here once they start checking in attendees
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


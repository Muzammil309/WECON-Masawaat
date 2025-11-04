'use client'

import { useState, useEffect } from 'react'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { Users, UserCheck, Clock, TrendingUp, Download, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface CheckInStats {
  total_tickets: number
  checked_in: number
  pending: number
  check_in_rate: number
}

interface CheckInLog {
  id: string
  ticket_id: string
  checked_in_at: string
  check_in_method: string
  station_name: string
  attendee_name: string
  attendee_email: string
  ticket_tier_name: string
}

export default function CheckInDashboardPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState<CheckInStats | null>(null)
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInLog[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch events
  useEffect(() => {
    fetchEvents()
  }, [])

  // Fetch stats when event is selected
  useEffect(() => {
    if (selectedEventId) {
      fetchStats()
      fetchRecentCheckIns()
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(() => {
        fetchStats()
        fetchRecentCheckIns()
      }, 10000)
      
      return () => clearInterval(interval)
    }
  }, [selectedEventId])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events?status=published')
      const data = await response.json()
      
      if (data.success && data.data.length > 0) {
        setEvents(data.data)
        setSelectedEventId(data.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!selectedEventId) return
    
    try {
      const response = await fetch(`/api/events/${selectedEventId}/check-in/stats`)
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchRecentCheckIns = async () => {
    if (!selectedEventId) return
    
    try {
      const response = await fetch(`/api/events/${selectedEventId}/check-in/logs?limit=10`)
      const data = await response.json()
      
      if (data.success) {
        setRecentCheckIns(data.data)
      }
    } catch (error) {
      console.error('Error fetching check-in logs:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchStats(), fetchRecentCheckIns()])
    setRefreshing(false)
    toast.success('Data refreshed')
  }

  const handleExport = async () => {
    if (!selectedEventId) return
    
    try {
      const response = await fetch(`/api/events/${selectedEventId}/check-in/export`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `check-in-data-${selectedEventId}-${new Date().toISOString()}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Check-in data exported')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1535] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7928CA]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1535] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7928CA]/5 via-transparent to-[#4318FF]/5 pointer-events-none" />
      
      <div className="relative z-10 flex">
        <VisionSidebar />
        
        {/* Main Content */}
        <div className="ml-[280px] min-h-screen flex flex-col flex-1">
          <div className="p-[32px]">
            <VisionTopbar title="Check-in Dashboard" breadcrumb="Admin" />

            <main className="mt-[24px] space-y-[24px]">
              {/* Event Selection & Actions */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-[16px] py-[12px] rounded-[12px] bg-white/5 border border-white/10 text-white text-[14px] focus:outline-none focus:border-[#7928CA] transition-colors"
                  >
                    {events.map((event) => (
                      <option key={event.id} value={event.id} className="bg-[#1A1F37] text-white">
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="px-[20px] py-[12px] rounded-[12px] bg-white/5 border border-white/10 text-white text-[14px] font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>

                  <button
                    onClick={handleExport}
                    className="px-[20px] py-[12px] rounded-[12px] bg-white/5 border border-white/10 text-white text-[14px] font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>

                  <Link
                    href="/check-in/scanner"
                    className="px-[20px] py-[12px] rounded-[12px] bg-gradient-to-r from-[#7928CA] to-[#4318FF] text-white text-[14px] font-semibold hover:opacity-90 transition-all duration-300"
                  >
                    Open Scanner
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
                  {/* Total Tickets */}
                  <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
                    <div className="flex items-center justify-between mb-[16px]">
                      <div className="p-[12px] rounded-[12px] bg-gradient-to-br from-[#7928CA]/20 to-[#4318FF]/20">
                        <Users className="h-6 w-6 text-[#7928CA]" />
                      </div>
                    </div>
                    <h3 className="text-[28px] font-bold text-white mb-[4px]">
                      {stats.total_tickets.toLocaleString()}
                    </h3>
                    <p className="text-[12px] text-[#A0AEC0]">Total Tickets</p>
                  </div>

                  {/* Checked In */}
                  <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
                    <div className="flex items-center justify-between mb-[16px]">
                      <div className="p-[12px] rounded-[12px] bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                        <UserCheck className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                    <h3 className="text-[28px] font-bold text-white mb-[4px]">
                      {stats.checked_in.toLocaleString()}
                    </h3>
                    <p className="text-[12px] text-[#A0AEC0]">Checked In</p>
                  </div>

                  {/* Pending */}
                  <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
                    <div className="flex items-center justify-between mb-[16px]">
                      <div className="p-[12px] rounded-[12px] bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                        <Clock className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                    <h3 className="text-[28px] font-bold text-white mb-[4px]">
                      {stats.pending.toLocaleString()}
                    </h3>
                    <p className="text-[12px] text-[#A0AEC0]">Pending</p>
                  </div>

                  {/* Check-in Rate */}
                  <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
                    <div className="flex items-center justify-between mb-[16px]">
                      <div className="p-[12px] rounded-[12px] bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                        <TrendingUp className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-[28px] font-bold text-white mb-[4px]">
                      {stats.check_in_rate.toFixed(1)}%
                    </h3>
                    <p className="text-[12px] text-[#A0AEC0]">Check-in Rate</p>
                  </div>
                </div>
              )}

              {/* Recent Check-ins Table */}
              <div className="vision-glass-card p-[32px]" style={{ borderRadius: '20px' }}>
                <h2 className="text-[20px] font-bold text-white mb-[20px]">Recent Check-ins</h2>

                {recentCheckIns.length === 0 ? (
                  <div className="text-center py-[40px]">
                    <UserCheck className="h-12 w-12 text-[#A0AEC0] mx-auto mb-[16px] opacity-50" />
                    <p className="text-[14px] text-[#A0AEC0]">No check-ins yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-[12px] px-[16px] text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                            Time
                          </th>
                          <th className="text-left py-[12px] px-[16px] text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                            Attendee
                          </th>
                          <th className="text-left py-[12px] px-[16px] text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                            Ticket Type
                          </th>
                          <th className="text-left py-[12px] px-[16px] text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                            Station
                          </th>
                          <th className="text-left py-[12px] px-[16px] text-[12px] font-semibold text-[#A0AEC0] uppercase tracking-wider">
                            Method
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCheckIns.map((log) => (
                          <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-[16px] px-[16px] text-[14px] text-white">
                              {new Date(log.checked_in_at).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className="py-[16px] px-[16px]">
                              <div>
                                <p className="text-[14px] font-semibold text-white">{log.attendee_name}</p>
                                <p className="text-[12px] text-[#A0AEC0]">{log.attendee_email}</p>
                              </div>
                            </td>
                            <td className="py-[16px] px-[16px] text-[14px] text-white">
                              {log.ticket_tier_name}
                            </td>
                            <td className="py-[16px] px-[16px] text-[14px] text-[#A0AEC0]">
                              {log.station_name || 'N/A'}
                            </td>
                            <td className="py-[16px] px-[16px]">
                              <span className="px-[12px] py-[4px] rounded-[8px] bg-[#7928CA]/20 text-[#7928CA] text-[12px] font-semibold">
                                {log.check_in_method}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </main>
          </div>

          <VisionFooter />
        </div>
      </div>
    </div>
  )
}


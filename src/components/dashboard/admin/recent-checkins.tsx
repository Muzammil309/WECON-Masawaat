'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { UserCheck, Clock, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface CheckIn {
  id: string
  attendeeName: string
  attendeeEmail: string
  ticketType: string
  station: string
  timestamp: string
  initials: string
}

export function RecentCheckIns() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentCheckIns()
    
    // Real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel('recent-checkins')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'check_in_logs' },
        (payload: any) => {
          console.log('New check-in:', payload)
          fetchRecentCheckIns()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const fetchRecentCheckIns = async () => {
    try {
      const supabase = createClient()
      
      const { data: checkInData } = await supabase
        .from('check_in_logs')
        .select(`
          id,
          created_at,
          check_in_stations (
            station_name
          ),
          em_tickets (
            em_ticket_tiers (
              name
            ),
            em_profiles (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (checkInData) {
        const formattedCheckIns: CheckIn[] = checkInData.map((checkIn: any) => {
          const name = checkIn.em_tickets?.em_profiles?.full_name || 'Unknown Attendee'
          const email = checkIn.em_tickets?.em_profiles?.email || ''
          
          return {
            id: checkIn.id,
            attendeeName: name,
            attendeeEmail: email,
            ticketType: checkIn.em_tickets?.em_ticket_tiers?.name || 'General',
            station: checkIn.check_in_stations?.station_name || 'Main Entrance',
            timestamp: checkIn.created_at,
            initials: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          }
        })

        setCheckIns(formattedCheckIns)
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching recent check-ins:', error)
      setLoading(false)
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const then = new Date(timestamp)
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)
    
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getTicketBadgeColor = (ticketType: string) => {
    const type = ticketType.toLowerCase()
    if (type.includes('vip')) return 'bg-purple-100 text-purple-700 border-purple-200'
    if (type.includes('speaker')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (type.includes('sponsor')) return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-slate-100 text-slate-700 border-slate-200'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
          <CardDescription>Latest attendee arrivals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              Recent Check-ins
            </CardTitle>
            <CardDescription>Latest attendee arrivals</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {checkIns.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No check-ins yet</p>
              <p className="text-sm">Check-ins will appear here in real-time</p>
            </div>
          ) : (
            checkIns.map((checkIn) => (
              <div
                key={checkIn.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
              >
                <Avatar className="h-10 w-10 border-2 border-green-500">
                  <AvatarFallback className="bg-gradient-to-br from-green-400 to-emerald-500 text-white font-semibold">
                    {checkIn.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-900 truncate">
                      {checkIn.attendeeName}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getTicketBadgeColor(checkIn.ticketType)}`}
                    >
                      {checkIn.ticketType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {checkIn.station}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(checkIn.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}


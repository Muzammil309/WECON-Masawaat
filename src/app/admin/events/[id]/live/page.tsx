'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { RealTimeAttendanceDashboard } from '@/components/dashboard/admin/RealTimeAttendanceDashboard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LiveEventDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()
  const eventId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : ''

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && eventId) {
      fetchEvent()
    }
  }, [user, eventId])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('em_events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) throw error

      if (!data) {
        setError('Event not found')
        return
      }

      setEvent(data)
    } catch (err) {
      console.error('Error fetching event:', err)
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto" />
          <p className="text-white text-lg">Loading live dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Error</h1>
          <p className="text-slate-400">{error || 'Event not found'}</p>
          <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <RealTimeAttendanceDashboard
        eventId={event.id}
        eventTitle={event.title}
      />
    </div>
  )
}


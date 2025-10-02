'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SessionMetrics } from '@/lib/types/event-management'

interface UseSessionMetricsOptions {
  sessionId: string
  refreshInterval?: number // in milliseconds, default 5000 (5 seconds)
  enableRealtime?: boolean // default true
}

interface SessionMetricsData {
  session_id: string
  session: {
    id: string
    title: string
    starts_at: string
    ends_at: string
    location?: string
    event: any
  }
  metrics: {
    current_attendees: number
    peak_attendees: number
    total_check_ins: number
    total_check_outs: number
    average_duration_minutes: number
    engagement_rate: number
    drop_off_rate: number
    last_updated: string
  }
  engagement: {
    total_messages: number
    total_questions: number
    total_poll_votes: number
    total_actions: number
  }
  attendance_timeline: Array<{
    user_id: string
    checked_in_at: string
    checked_out_at?: string
    duration_minutes?: number
  }>
}

export function useSessionMetrics({
  sessionId,
  refreshInterval = 5000,
  enableRealtime = true
}: UseSessionMetricsOptions) {
  const [data, setData] = useState<SessionMetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const supabase = createClient()

  // Fetch metrics from API
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/metrics`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch session metrics')
      }

      const metricsData = await response.json()
      setData(metricsData)
      setError(null)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error fetching session metrics:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  // Initial fetch
  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  // Polling for live updates
  useEffect(() => {
    if (!enableRealtime) return

    const interval = setInterval(() => {
      fetchMetrics()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchMetrics, refreshInterval, enableRealtime])

  // Subscribe to real-time changes in session_metrics
  useEffect(() => {
    if (!enableRealtime) return

    const channel = supabase
      .channel(`session-metrics-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_metrics',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: any) => {
          console.log('Real-time session metrics update:', payload)
          fetchMetrics()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_attendance',
          filter: `session_id=eq.${sessionId}`
        },
        (payload: any) => {
          console.log('Real-time attendance update:', payload)
          fetchMetrics()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, enableRealtime, fetchMetrics, supabase])

  // Manual refresh function
  const refresh = useCallback(() => {
    setLoading(true)
    return fetchMetrics()
  }, [fetchMetrics])

  return {
    data,
    loading,
    error,
    lastUpdate,
    refresh
  }
}

/**
 * Hook for tracking live attendance in a session
 */
export function useLiveAttendance(sessionId: string) {
  const { data, loading, error, refresh } = useSessionMetrics({
    sessionId,
    refreshInterval: 5000,
    enableRealtime: true
  })

  const checkIn = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/admin/attendance/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          action: 'check_in'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to check in')
      }

      const result = await response.json()
      await refresh()
      return result
    } catch (err) {
      console.error('Error checking in:', err)
      throw err
    }
  }, [sessionId, refresh])

  const checkOut = useCallback(async (userId: string) => {
    try {
      const response = await fetch('/api/admin/attendance/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          action: 'check_out'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to check out')
      }

      const result = await response.json()
      await refresh()
      return result
    } catch (err) {
      console.error('Error checking out:', err)
      throw err
    }
  }, [sessionId, refresh])

  return {
    currentAttendees: data?.metrics.current_attendees || 0,
    peakAttendees: data?.metrics.peak_attendees || 0,
    totalCheckIns: data?.metrics.total_check_ins || 0,
    totalCheckOuts: data?.metrics.total_check_outs || 0,
    averageDuration: data?.metrics.average_duration_minutes || 0,
    dropOffRate: data?.metrics.drop_off_rate || 0,
    engagementRate: data?.metrics.engagement_rate || 0,
    attendanceTimeline: data?.attendance_timeline || [],
    loading,
    error,
    checkIn,
    checkOut,
    refresh
  }
}


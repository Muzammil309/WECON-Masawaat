'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { LiveEventMetrics } from '@/lib/types/event-management'

interface UseEventMetricsOptions {
  eventId: string
  refreshInterval?: number // in milliseconds, default 10000 (10 seconds)
  enableRealtime?: boolean // default true
}

interface EventMetricsData {
  event_id: string
  metrics: {
    total_registered: number
    total_checked_in: number
    currently_onsite: number
    peak_concurrent: number
    check_in_rate: number
    last_updated: string
  }
  active_sessions: number
  total_revenue: number
  check_in_velocity: number
  recent_check_ins: number
  session_metrics: any[]
  last_updated: string
}

export function useEventMetrics({
  eventId,
  refreshInterval = 10000,
  enableRealtime = true
}: UseEventMetricsOptions) {
  const [data, setData] = useState<EventMetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const supabase = createClient()

  // Fetch metrics from API
  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/metrics/live?eventId=${eventId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }

      const metricsData = await response.json()
      setData(metricsData)
      setError(null)
      setLastUpdate(new Date())
    } catch (err) {
      console.error('Error fetching event metrics:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [eventId])

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

  // Subscribe to real-time changes in event_attendance_metrics
  useEffect(() => {
    if (!enableRealtime) return

    const channel = supabase
      .channel(`event-metrics-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_attendance_metrics',
          filter: `event_id=eq.${eventId}`
        },
        (payload: any) => {
          console.log('Real-time event metrics update:', payload)
          // Refresh data when metrics change
          fetchMetrics()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [eventId, enableRealtime, fetchMetrics, supabase])

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
 * Hook for live event metrics with automatic updates
 * Simplified version that returns just the key metrics
 */
export function useLiveEventMetrics(eventId: string): LiveEventMetrics & { 
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
} {
  const { data, loading, error, refresh } = useEventMetrics({ 
    eventId,
    refreshInterval: 10000,
    enableRealtime: true
  })

  return {
    total_checked_in: data?.metrics.total_checked_in || 0,
    currently_onsite: data?.metrics.currently_onsite || 0,
    total_revenue: data?.total_revenue || 0,
    active_sessions: data?.active_sessions || 0,
    check_in_rate: data?.metrics.check_in_rate || 0,
    peak_concurrent: data?.metrics.peak_concurrent || 0,
    last_updated: data?.last_updated || new Date().toISOString(),
    loading,
    error,
    refresh
  }
}


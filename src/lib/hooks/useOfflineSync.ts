/**
 * React Hook: Offline Sync Management
 * Handles offline queue and automatic sync when online
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  addOfflineCheckIn,
  getUnsyncedCheckIns,
  markCheckInSynced,
  updateCheckInSyncError,
  getPendingSyncCount,
  saveStationState,
  getStationState
} from '@/lib/utils/offline-db'
import type { OfflineCheckInRecord, OfflineCheckInData } from '@/lib/types/check-in'

interface UseOfflineSyncOptions {
  stationId: string
  autoSync?: boolean
  syncInterval?: number // milliseconds
}

interface UseOfflineSyncReturn {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
  lastSyncAt: string | null
  addToQueue: (checkInData: Omit<OfflineCheckInData, 'station_id' | 'client_timestamp'>) => Promise<void>
  syncNow: () => Promise<void>
  clearQueue: () => Promise<void>
}

export function useOfflineSync(options: UseOfflineSyncOptions): UseOfflineSyncReturn {
  const { stationId, autoSync = true, syncInterval = 30000 } = options
  
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null)
  
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)
  
  // Update pending count
  const updatePendingCount = useCallback(async () => {
    try {
      const count = await getPendingSyncCount(stationId)
      if (isMountedRef.current) {
        setPendingCount(count)
      }
    } catch (error) {
      console.error('Error updating pending count:', error)
    }
  }, [stationId])
  
  // Add check-in to offline queue
  const addToQueue = useCallback(async (
    checkInData: Omit<OfflineCheckInData, 'station_id' | 'client_timestamp'>
  ) => {
    try {
      const record: OfflineCheckInRecord = {
        id: uuidv4(),
        ticket_id: checkInData.ticket_id,
        qr_code: checkInData.qr_code,
        station_id: stationId,
        checked_in_by: checkInData.checked_in_by,
        check_in_method: checkInData.check_in_method,
        client_timestamp: new Date().toISOString(),
        attendee_name: checkInData.attendee_name,
        attendee_email: checkInData.attendee_email,
        synced: false,
        sync_attempts: 0
      }
      
      await addOfflineCheckIn(record)
      await updatePendingCount()
      
      // Try to sync immediately if online
      if (isOnline && autoSync) {
        syncNow()
      }
    } catch (error) {
      console.error('Error adding to offline queue:', error)
      throw error
    }
  }, [stationId, isOnline, autoSync])
  
  // Sync offline queue with server
  const syncNow = useCallback(async () => {
    if (isSyncing || !isOnline) {
      return
    }
    
    try {
      setIsSyncing(true)
      
      // Get unsynced check-ins
      const unsyncedCheckIns = await getUnsyncedCheckIns(stationId)
      
      if (unsyncedCheckIns.length === 0) {
        setIsSyncing(false)
        return
      }
      
      // Prepare data for sync API
      const checkInsToSync = unsyncedCheckIns.map(record => ({
        ticket_id: record.ticket_id,
        qr_code: record.qr_code,
        station_id: record.station_id,
        checked_in_by: record.checked_in_by,
        check_in_method: record.check_in_method,
        client_timestamp: record.client_timestamp,
        attendee_name: record.attendee_name,
        attendee_email: record.attendee_email
      }))
      
      // Call sync API
      const response = await fetch('/api/check-in/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          station_id: stationId,
          check_ins: checkInsToSync
        })
      })
      
      if (!response.ok) {
        throw new Error('Sync failed')
      }
      
      const result = await response.json()
      
      // Mark synced check-ins
      for (let i = 0; i < result.results.length; i++) {
        const syncResult = result.results[i]
        const record = unsyncedCheckIns[i]
        
        if (syncResult.success) {
          await markCheckInSynced(record.id)
        } else {
          await updateCheckInSyncError(record.id, syncResult.error || 'Unknown error')
        }
      }
      
      // Update state
      const now = new Date().toISOString()
      setLastSyncAt(now)
      await updatePendingCount()
      
      // Save station state
      await saveStationState({
        station_id: stationId,
        is_online: isOnline,
        pending_sync_count: await getPendingSyncCount(stationId),
        last_sync_at: now,
        last_heartbeat: now
      })
    } catch (error) {
      console.error('Error syncing offline queue:', error)
    } finally {
      if (isMountedRef.current) {
        setIsSyncing(false)
      }
    }
  }, [stationId, isOnline, isSyncing, updatePendingCount])
  
  // Clear queue (for testing/debugging)
  const clearQueue = useCallback(async () => {
    try {
      const unsyncedCheckIns = await getUnsyncedCheckIns(stationId)
      for (const record of unsyncedCheckIns) {
        await markCheckInSynced(record.id)
      }
      await updatePendingCount()
    } catch (error) {
      console.error('Error clearing queue:', error)
    }
  }, [stationId, updatePendingCount])
  
  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (autoSync) {
        syncNow()
      }
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [autoSync, syncNow])
  
  // Auto-sync interval
  useEffect(() => {
    if (autoSync && isOnline) {
      syncIntervalRef.current = setInterval(() => {
        syncNow()
      }, syncInterval)
      
      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current)
        }
      }
    }
  }, [autoSync, isOnline, syncInterval, syncNow])
  
  // Load initial state
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const state = await getStationState(stationId)
        if (state && isMountedRef.current) {
          setLastSyncAt(state.last_sync_at)
        }
        await updatePendingCount()
      } catch (error) {
        console.error('Error loading initial state:', error)
      }
    }
    
    loadInitialState()
  }, [stationId, updatePendingCount])
  
  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [])
  
  return {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncAt,
    addToQueue,
    syncNow,
    clearQueue
  }
}


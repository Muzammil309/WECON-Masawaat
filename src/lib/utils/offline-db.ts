/**
 * IndexedDB Utility for Offline Check-in Storage
 * Handles offline queue management and sync
 */

import type { OfflineCheckInRecord, OfflineStationState } from '@/lib/types/check-in'

const DB_NAME = 'EventCheckInDB'
const DB_VERSION = 1
const CHECK_IN_STORE = 'checkIns'
const STATION_STORE = 'stations'

/**
 * Initialize IndexedDB
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      // Create check-ins object store
      if (!db.objectStoreNames.contains(CHECK_IN_STORE)) {
        const checkInStore = db.createObjectStore(CHECK_IN_STORE, { keyPath: 'id' })
        checkInStore.createIndex('synced', 'synced', { unique: false })
        checkInStore.createIndex('station_id', 'station_id', { unique: false })
        checkInStore.createIndex('client_timestamp', 'client_timestamp', { unique: false })
      }
      
      // Create stations object store
      if (!db.objectStoreNames.contains(STATION_STORE)) {
        const stationStore = db.createObjectStore(STATION_STORE, { keyPath: 'station_id' })
        stationStore.createIndex('is_online', 'is_online', { unique: false })
      }
    }
  })
}

/**
 * Add check-in to offline queue
 */
export async function addOfflineCheckIn(checkIn: OfflineCheckInRecord): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE], 'readwrite')
    const store = transaction.objectStore(CHECK_IN_STORE)
    const request = store.add(checkIn)
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Get all unsynced check-ins
 */
export async function getUnsyncedCheckIns(stationId?: string): Promise<OfflineCheckInRecord[]> {
  const db = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE], 'readonly')
    const store = transaction.objectStore(CHECK_IN_STORE)
    const index = store.index('synced')
    // Use IDBKeyRange to query for false values in the synced index
    const request = index.getAll(IDBKeyRange.only(0))

    request.onsuccess = () => {
      let results = request.result as OfflineCheckInRecord[]

      // Filter by station if provided
      if (stationId) {
        results = results.filter(r => r.station_id === stationId)
      }

      resolve(results)
    }
    request.onerror = () => reject(request.error)
  })
}

/**
 * Mark check-in as synced
 */
export async function markCheckInSynced(id: string): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE], 'readwrite')
    const store = transaction.objectStore(CHECK_IN_STORE)
    const getRequest = store.get(id)
    
    getRequest.onsuccess = () => {
      const checkIn = getRequest.result as OfflineCheckInRecord
      if (checkIn) {
        checkIn.synced = true
        const updateRequest = store.put(checkIn)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      } else {
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

/**
 * Update check-in sync error
 */
export async function updateCheckInSyncError(id: string, error: string): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE], 'readwrite')
    const store = transaction.objectStore(CHECK_IN_STORE)
    const getRequest = store.get(id)
    
    getRequest.onsuccess = () => {
      const checkIn = getRequest.result as OfflineCheckInRecord
      if (checkIn) {
        checkIn.error = error
        checkIn.sync_attempts = (checkIn.sync_attempts || 0) + 1
        checkIn.last_sync_attempt = new Date().toISOString()
        const updateRequest = store.put(checkIn)
        updateRequest.onsuccess = () => resolve()
        updateRequest.onerror = () => reject(updateRequest.error)
      } else {
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

/**
 * Delete synced check-ins older than specified days
 */
export async function cleanupSyncedCheckIns(daysOld: number = 7): Promise<number> {
  const db = await initDB()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE], 'readwrite')
    const store = transaction.objectStore(CHECK_IN_STORE)
    const index = store.index('synced')
    const request = index.openCursor(IDBKeyRange.only(true))
    
    let deletedCount = 0
    
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result
      if (cursor) {
        const checkIn = cursor.value as OfflineCheckInRecord
        const checkInDate = new Date(checkIn.client_timestamp)
        
        if (checkInDate < cutoffDate) {
          cursor.delete()
          deletedCount++
        }
        
        cursor.continue()
      } else {
        resolve(deletedCount)
      }
    }
    request.onerror = () => reject(request.error)
  })
}

/**
 * Get pending sync count
 */
export async function getPendingSyncCount(stationId?: string): Promise<number> {
  const unsyncedCheckIns = await getUnsyncedCheckIns(stationId)
  return unsyncedCheckIns.length
}

/**
 * Save station state
 */
export async function saveStationState(state: OfflineStationState): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STATION_STORE], 'readwrite')
    const store = transaction.objectStore(STATION_STORE)
    const request = store.put(state)
    
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

/**
 * Get station state
 */
export async function getStationState(stationId: string): Promise<OfflineStationState | null> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STATION_STORE], 'readonly')
    const store = transaction.objectStore(STATION_STORE)
    const request = store.get(stationId)
    
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Clear all offline data (use with caution)
 */
export async function clearAllOfflineData(): Promise<void> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE, STATION_STORE], 'readwrite')
    
    const checkInStore = transaction.objectStore(CHECK_IN_STORE)
    const stationStore = transaction.objectStore(STATION_STORE)
    
    const clearCheckIns = checkInStore.clear()
    const clearStations = stationStore.clear()
    
    Promise.all([
      new Promise((res, rej) => {
        clearCheckIns.onsuccess = () => res(undefined)
        clearCheckIns.onerror = () => rej(clearCheckIns.error)
      }),
      new Promise((res, rej) => {
        clearStations.onsuccess = () => res(undefined)
        clearStations.onerror = () => rej(clearStations.error)
      })
    ])
      .then(() => resolve())
      .catch(reject)
  })
}

/**
 * Export all offline data (for debugging)
 */
export async function exportOfflineData(): Promise<{
  checkIns: OfflineCheckInRecord[]
  stations: OfflineStationState[]
}> {
  const db = await initDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CHECK_IN_STORE, STATION_STORE], 'readonly')
    
    const checkInStore = transaction.objectStore(CHECK_IN_STORE)
    const stationStore = transaction.objectStore(STATION_STORE)
    
    const checkInsRequest = checkInStore.getAll()
    const stationsRequest = stationStore.getAll()
    
    Promise.all([
      new Promise<OfflineCheckInRecord[]>((res, rej) => {
        checkInsRequest.onsuccess = () => res(checkInsRequest.result)
        checkInsRequest.onerror = () => rej(checkInsRequest.error)
      }),
      new Promise<OfflineStationState[]>((res, rej) => {
        stationsRequest.onsuccess = () => res(stationsRequest.result)
        stationsRequest.onerror = () => rej(stationsRequest.error)
      })
    ])
      .then(([checkIns, stations]) => resolve({ checkIns, stations }))
      .catch(reject)
  })
}


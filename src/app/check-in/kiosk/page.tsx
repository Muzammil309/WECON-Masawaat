/**
 * Kiosk Check-in Page
 * Full-screen self-service kiosk interface
 */

'use client'

import React, { useEffect, useState } from 'react'
import { KioskCheckIn } from '@/components/check-in/KioskCheckIn'
import { Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

export default function KioskPage() {
  const [stationId, setStationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize kiosk station
  useEffect(() => {
    // Check for existing kiosk station ID
    let kioskStationId = localStorage.getItem('kiosk_station_id')
    
    if (!kioskStationId) {
      // Generate new kiosk station ID
      kioskStationId = uuidv4()
      localStorage.setItem('kiosk_station_id', kioskStationId)
    }

    setStationId(kioskStationId)
    setLoading(false)

    // Hide cursor for kiosk mode
    document.body.style.cursor = 'none'

    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  if (loading || !stationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-white animate-spin" />
      </div>
    )
  }

  return (
    <KioskCheckIn
      stationId={stationId}
      eventId="default-event-id" // TODO: Get from URL params or config
      eventName="WECON-MASAWAAT Event"
      autoPrintBadge={true}
      resetDelay={5000}
    />
  )
}


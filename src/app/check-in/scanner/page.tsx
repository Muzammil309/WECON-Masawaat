/**
 * Mobile Scanner Page
 * Full-screen scanner interface for staff check-in
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MobileScanner } from '@/components/check-in/MobileScanner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

export default function ScannerPage() {
  const router = useRouter()
  const [stationId, setStationId] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string | null>(null)
  const [stationName, setStationName] = useState('')
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)

  // Check for existing station in localStorage
  useEffect(() => {
    const savedStationId = localStorage.getItem('check_in_station_id')
    const savedEventId = localStorage.getItem('check_in_event_id')
    
    if (savedStationId && savedEventId) {
      setStationId(savedStationId)
      setEventId(savedEventId)
    }
    
    setLoading(false)
  }, [])

  // Register new station
  const handleRegisterStation = async () => {
    if (!stationName.trim()) {
      toast.error('Please enter a station name')
      return
    }

    setRegistering(true)

    try {
      // For now, use a default event ID (in production, this would come from event selection)
      const defaultEventId = 'default-event-id' // TODO: Implement event selection
      const newStationId = uuidv4()

      // Save to localStorage
      localStorage.setItem('check_in_station_id', newStationId)
      localStorage.setItem('check_in_event_id', defaultEventId)
      localStorage.setItem('check_in_station_name', stationName)

      setStationId(newStationId)
      setEventId(defaultEventId)
      
      toast.success('Station registered successfully')
    } catch (error) {
      console.error('Error registering station:', error)
      toast.error('Failed to register station')
    } finally {
      setRegistering(false)
    }
  }

  // Reset station
  const handleResetStation = () => {
    localStorage.removeItem('check_in_station_id')
    localStorage.removeItem('check_in_event_id')
    localStorage.removeItem('check_in_station_name')
    setStationId(null)
    setEventId(null)
    setStationName('')
    toast.success('Station reset')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    )
  }

  // Station registration screen
  if (!stationId || !eventId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">Register Check-in Station</h1>
              <p className="text-sm text-slate-400">
                Set up this device as a check-in station
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stationName" className="text-white">
                  Station Name
                </Label>
                <Input
                  id="stationName"
                  type="text"
                  placeholder="e.g., Main Entrance, VIP Desk"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>

              <Button
                onClick={handleRegisterStation}
                disabled={registering}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {registering ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Station'
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500">
                This information will be saved on this device
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Scanner interface
  return (
    <div>
      <MobileScanner
        stationId={stationId}
        eventId={eventId}
        onCheckInSuccess={(data) => {
          console.log('Check-in successful:', data)
        }}
      />

      {/* Reset button (hidden, accessible via settings) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleResetStation}
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10 opacity-20 hover:opacity-100 transition-opacity"
        >
          Reset Station
        </Button>
      </div>
    </div>
  )
}


/**
 * Kiosk Check-in Component
 * Large, touch-friendly self-service kiosk interface
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Scan, UserCheck, Printer, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useQRScanner } from '@/lib/hooks/useQRScanner'
import { cn } from '@/lib/utils'
import type { ScanQRCodeResponse } from '@/lib/types/check-in'

interface KioskCheckInProps {
  stationId: string
  eventId: string
  eventName: string
  eventLogo?: string
  autoPrintBadge?: boolean
  resetDelay?: number // milliseconds
}

type KioskState = 'idle' | 'scanning' | 'processing' | 'success' | 'error'

export function KioskCheckIn({
  stationId,
  eventId,
  eventName,
  eventLogo,
  autoPrintBadge = true,
  resetDelay = 5000
}: KioskCheckInProps) {
  const [state, setState] = useState<KioskState>('idle')
  const [scanResult, setScanResult] = useState<ScanQRCodeResponse | null>(null)
  const [badgePrinting, setBadgePrinting] = useState(false)

  // QR scanner hook
  const {
    isScanning,
    startScanning,
    stopScanning,
    hasCamera
  } = useQRScanner({
    onScanSuccess: handleScan,
    fps: 10,
    qrbox: { width: 300, height: 300 }
  })

  // Handle QR code scan
  async function handleScan(qrCode: string) {
    setState('processing')
    await stopScanning()

    try {
      const response = await fetch('/api/check-in/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qr_code: qrCode,
          station_id: stationId,
          check_in_method: 'kiosk'
        })
      })

      const result: ScanQRCodeResponse = await response.json()
      setScanResult(result)

      if (result.success) {
        setState('success')
        
        // Auto-print badge if enabled
        if (autoPrintBadge && result.data?.ticket_id) {
          printBadge(result.data.ticket_id)
        }
      } else {
        setState('error')
      }

      // Auto-reset after delay
      setTimeout(() => {
        resetKiosk()
      }, resetDelay)
    } catch (error) {
      console.error('Error processing check-in:', error)
      setState('error')
      setScanResult({
        success: false,
        message: 'Error processing check-in',
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      setTimeout(() => {
        resetKiosk()
      }, resetDelay)
    }
  }

  // Print badge
  async function printBadge(ticketId: string) {
    setBadgePrinting(true)

    try {
      await fetch('/api/badges/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_id: ticketId,
          station_id: stationId
        })
      })
    } catch (error) {
      console.error('Error printing badge:', error)
    } finally {
      setBadgePrinting(false)
    }
  }

  // Reset kiosk to idle state
  function resetKiosk() {
    setState('idle')
    setScanResult(null)
    setBadgePrinting(false)
  }

  // Start scanning when in idle state
  function handleStartScan() {
    setState('scanning')
    startScanning('kiosk-qr-reader')
  }

  // Idle/Attract Screen
  if (state === 'idle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Event Logo/Branding */}
          {eventLogo ? (
            <img src={eventLogo} alt={eventName} className="h-32 mx-auto" />
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="h-16 w-16 text-purple-400" />
              <h1 className="text-5xl font-bold text-white">{eventName}</h1>
            </div>
          )}

          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
            <p className="text-xl text-slate-300">
              Tap below to check in and get your badge
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartScan}
            size="lg"
            className="h-24 px-12 text-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-2xl"
          >
            <Scan className="h-10 w-10 mr-4" />
            Tap to Check In
          </Button>

          {/* Instructions */}
          <p className="text-sm text-slate-400">
            Have your QR code ready to scan
          </p>
        </div>
      </div>
    )
  }

  // Scanning Screen
  if (state === 'scanning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Scanner Card */}
          <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-black">
                <div id="kiosk-qr-reader" className="w-full h-full" />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-8 w-20 h-20 border-t-8 border-l-8 border-green-500 rounded-tl-2xl" />
                  <div className="absolute top-8 right-8 w-20 h-20 border-t-8 border-r-8 border-green-500 rounded-tr-2xl" />
                  <div className="absolute bottom-8 left-8 w-20 h-20 border-b-8 border-l-8 border-green-500 rounded-bl-2xl" />
                  <div className="absolute bottom-8 right-8 w-20 h-20 border-b-8 border-r-8 border-green-500 rounded-br-2xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">Scan Your QR Code</h2>
            <p className="text-xl text-slate-300">
              Position your QR code within the frame
            </p>
          </div>

          {/* Cancel Button */}
          <div className="text-center">
            <Button
              onClick={resetKiosk}
              variant="outline"
              size="lg"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Processing Screen
  if (state === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center space-y-8">
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-white border-t-transparent mx-auto" />
          <h2 className="text-4xl font-bold text-white">Processing...</h2>
          <p className="text-xl text-slate-300">Please wait</p>
        </div>
      </div>
    )
  }

  // Success Screen
  if (state === 'success' && scanResult?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-green-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Success Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-3xl" />
            <CheckCircle className="h-40 w-40 text-green-400 mx-auto relative animate-bounce" />
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white">Welcome!</h2>
            <p className="text-3xl text-green-200 font-semibold">
              {scanResult.data.attendee_name}
            </p>
            {scanResult.data.ticket_tier && (
              <Badge className="text-lg px-6 py-2 bg-green-500/20 text-green-300 border-green-500/50">
                {scanResult.data.ticket_tier}
              </Badge>
            )}
          </div>

          {/* Check-in Confirmation */}
          <Card className="border-green-500/30 bg-green-500/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 text-green-300">
                <UserCheck className="h-8 w-8" />
                <span className="text-2xl font-semibold">Successfully Checked In</span>
              </div>
            </CardContent>
          </Card>

          {/* Badge Printing Status */}
          {badgePrinting && (
            <Card className="border-blue-500/30 bg-blue-500/10 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 text-blue-300">
                  <Printer className="h-8 w-8 animate-pulse" />
                  <span className="text-xl">Printing your badge...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <p className="text-xl text-green-200">
            {badgePrinting ? 'Please collect your badge from the printer' : 'Enjoy the event!'}
          </p>
        </div>
      </div>
    )
  }

  // Error Screen
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-rose-900 to-red-900 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Error Icon */}
          <XCircle className="h-40 w-40 text-red-400 mx-auto" />

          {/* Error Message */}
          <div className="space-y-4">
            <h2 className="text-5xl font-bold text-white">Oops!</h2>
            <p className="text-2xl text-red-200">
              {scanResult?.message || 'Something went wrong'}
            </p>
            {scanResult?.error && (
              <p className="text-lg text-red-300">
                {scanResult.error}
              </p>
            )}
          </div>

          {/* Help Message */}
          <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-3 text-red-300">
                <AlertCircle className="h-8 w-8" />
                <span className="text-xl">Please see a staff member for assistance</span>
              </div>
            </CardContent>
          </Card>

          {/* Try Again Button */}
          <Button
            onClick={resetKiosk}
            size="lg"
            className="h-20 px-12 text-xl bg-white/10 hover:bg-white/20"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return null
}


/**
 * Mobile Scanner Component
 * Mobile-optimized QR scanner interface for staff check-in
 */

'use client'

import React, { useState, useEffect } from 'react'
import { QrCode, Camera, CheckCircle, XCircle, AlertCircle, User, Mail, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useQRScanner } from '@/lib/hooks/useQRScanner'
import { useOfflineSync } from '@/lib/hooks/useOfflineSync'
import { OfflineSyncIndicator } from './OfflineSyncIndicator'
import { ProfilePreviewDialog } from './ProfilePreviewDialog'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { ScanQRCodeResponse } from '@/lib/types/check-in'

interface MobileScannerProps {
  stationId: string
  eventId: string
  onCheckInSuccess?: (data: ScanQRCodeResponse['data']) => void
}

export function MobileScanner({ stationId, eventId, onCheckInSuccess }: MobileScannerProps) {
  const [scanResult, setScanResult] = useState<ScanQRCodeResponse | null>(null)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  // Offline sync hook
  const {
    isOnline,
    pendingCount,
    isSyncing,
    lastSyncAt,
    addToQueue,
    syncNow
  } = useOfflineSync({
    stationId,
    autoSync: true,
    syncInterval: 30000 // 30 seconds
  })

  // QR scanner hook
  const {
    isScanning,
    error: scannerError,
    startScanning,
    stopScanning,
    hasCamera,
    cameraPermission
  } = useQRScanner({
    onScanSuccess: handleScan,
    onScanError: (error) => {
      console.error('Scanner error:', error)
    },
    fps: 10,
    qrbox: 250
  })

  // Handle QR code scan
  async function handleScan(qrCode: string) {
    if (isProcessing) return

    setIsProcessing(true)

    try {
      // Detect QR code type
      let qrData: any
      try {
        qrData = JSON.parse(qrCode)
      } catch {
        // If not JSON, assume it's a ticket QR code
        qrData = { type: 'ticket' }
      }

      // Handle profile QR code
      if (qrData.type === 'profile') {
        console.log('Profile QR code detected')

        const response = await fetch('/api/profile/qr/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qr_code: qrCode })
        })

        const result = await response.json()

        if (result.success) {
          setProfileData(result.data)
          setShowProfileDialog(true)
          toast.success('Profile loaded', {
            description: `${result.data.profile.full_name} - ${result.data.total_events} event(s)`
          })
        } else {
          toast.error('Failed to load profile', {
            description: result.message || result.error
          })
        }

        setIsProcessing(false)
        return
      }

      // Handle ticket QR code (existing logic)
      if (isOnline) {
        const response = await fetch('/api/check-in/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qr_code: qrCode,
            station_id: stationId,
            check_in_method: 'qr_code'
          })
        })

        const result: ScanQRCodeResponse = await response.json()
        setScanResult(result)
        setShowResultDialog(true)

        if (result.success) {
          toast.success('Check-in successful!', {
            description: `Welcome, ${result.data?.attendee_name}!`
          })

          if (onCheckInSuccess && result.data) {
            onCheckInSuccess(result.data)
          }
        } else {
          toast.error('Check-in failed', {
            description: result.message || result.error
          })
        }
      } else {
        // If offline, add to queue
        await addToQueue({
          ticket_id: '', // Will be resolved from QR code on server
          qr_code: qrCode,
          check_in_method: 'qr_code'
        })

        toast.success('Check-in queued (offline)', {
          description: 'Will sync when connection is restored'
        })

        setScanResult({
          success: true,
          message: 'Check-in queued for sync',
          data: {
            check_in_log_id: '',
            ticket_id: '',
            attendee_name: 'Offline Check-in',
            attendee_email: '',
            event_name: '',
            ticket_tier: '',
            checked_in_at: new Date().toISOString(),
            is_duplicate: false
          }
        })
        setShowResultDialog(true)
      }
    } catch (error) {
      console.error('Error processing check-in:', error)
      toast.error('Error processing check-in', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsProcessing(false)

      // Auto-close dialog after 3 seconds for ticket scans
      setTimeout(() => {
        setShowResultDialog(false)
      }, 3000)
    }
  }

  // Handle check-in from profile dialog
  async function handleProfileCheckIn(ticketId: string, eventTitle: string) {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/check-in/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qr_code: JSON.stringify({ ticket_id: ticketId }),
          station_id: stationId,
          check_in_method: 'qr_code'
        })
      })

      const result: ScanQRCodeResponse = await response.json()

      if (result.success) {
        toast.success('Check-in successful!', {
          description: `Checked in to ${eventTitle}`
        })

        setShowProfileDialog(false)
        setProfileData(null)

        if (onCheckInSuccess && result.data) {
          onCheckInSuccess(result.data)
        }
      } else {
        toast.error('Check-in failed', {
          description: result.message || result.error
        })
      }
    } catch (error) {
      console.error('Error processing check-in:', error)
      toast.error('Error processing check-in', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Start scanner on mount
  useEffect(() => {
    if (hasCamera && cameraPermission === 'granted') {
      startScanning('qr-reader')
    }
  }, [hasCamera, cameraPermission])

  // Camera permission denied
  if (cameraPermission === 'denied') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <p className="font-semibold text-lg">Camera Permission Denied</p>
              <p className="text-sm mt-2">
                Please enable camera access in your browser settings to use the scanner.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No camera available
  if (!hasCamera) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-center text-yellow-600">
              <Camera className="h-12 w-12 mx-auto mb-4" />
              <p className="font-semibold text-lg">No Camera Detected</p>
              <p className="text-sm mt-2">
                Please ensure your device has a camera and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Check-in Scanner</h1>
                <p className="text-xs text-slate-400">Station: {stationId.slice(0, 8)}</p>
              </div>
            </div>
            
            {/* Sync Indicator */}
            <OfflineSyncIndicator
              isOnline={isOnline}
              pendingCount={pendingCount}
              isSyncing={isSyncing}
              lastSyncAt={lastSyncAt}
              onSyncNow={syncNow}
              compact
            />
          </div>
        </div>
      </div>

      {/* Scanner Container */}
      <div className="p-4 space-y-4">
        {/* Scanner Card */}
        <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            {/* Scanner View */}
            <div className="relative aspect-square bg-black">
              <div id="qr-reader" className="w-full h-full" />
              
              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner Markers */}
                  <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                  <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                  
                  {/* Scanning Line */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
                </div>
              )}

              {/* Processing Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-3" />
                    <p className="text-white font-medium">Processing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Scanner Status */}
            <div className="p-4 bg-slate-900/50">
              <div className="flex items-center justify-center gap-2">
                <div className={cn(
                  'h-2 w-2 rounded-full',
                  isScanning ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                )} />
                <span className="text-sm text-slate-300">
                  {isScanning ? 'Ready to scan' : 'Scanner inactive'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Camera className="h-4 w-4" />
                How to scan
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">1.</span>
                  <span>Position the QR code within the frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">2.</span>
                  <span>Hold steady until the code is detected</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">3.</span>
                  <span>Check-in will process automatically</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="bg-gradient-to-br from-slate-900 to-slate-800 border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              {scanResult?.success ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Check-in Successful
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Check-in Failed
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {scanResult?.data && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{scanResult.data.attendee_name}</span>
                </div>
                {scanResult.data.attendee_email && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="h-4 w-4" />
                    <span>{scanResult.data.attendee_email}</span>
                  </div>
                )}
                {scanResult.data.ticket_tier && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Ticket className="h-4 w-4" />
                    <span>{scanResult.data.ticket_tier}</span>
                  </div>
                )}
              </div>

              {scanResult.data.is_duplicate && (
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                  Already checked in at {new Date(scanResult.data.previous_check_in_at || '').toLocaleTimeString()}
                </Badge>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Preview Dialog */}
      <ProfilePreviewDialog
        open={showProfileDialog}
        onClose={() => {
          setShowProfileDialog(false)
          setProfileData(null)
        }}
        profileData={profileData}
        onCheckIn={handleProfileCheckIn}
        isProcessing={isProcessing}
      />
    </div>
  )
}


/**
 * React Hook: QR Code Scanner
 * Handles camera access and QR code detection using html5-qrcode
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'

interface UseQRScannerOptions {
  onScanSuccess: (decodedText: string) => void
  onScanError?: (error: string) => void
  fps?: number
  qrbox?: number | { width: number; height: number }
  aspectRatio?: number
  disableFlip?: boolean
}

interface UseQRScannerReturn {
  isScanning: boolean
  error: string | null
  startScanning: (elementId: string) => Promise<void>
  stopScanning: () => Promise<void>
  hasCamera: boolean
  cameraPermission: 'granted' | 'denied' | 'prompt' | 'unknown'
}

export function useQRScanner(options: UseQRScannerOptions): UseQRScannerReturn {
  const {
    onScanSuccess,
    onScanError,
    fps = 10,
    qrbox = 250,
    aspectRatio = 1.0,
    disableFlip = false
  } = options

  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const lastScanRef = useRef<string>('')
  const scanCooldownRef = useRef<NodeJS.Timeout | null>(null)

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await Html5Qrcode.getCameras()
        setHasCamera(devices.length > 0)
      } catch (err) {
        console.error('Error checking cameras:', err)
        setHasCamera(false)
      }
    }

    checkCamera()
  }, [])

  // Check camera permission
  useEffect(() => {
    const checkPermission = async () => {
      if (typeof navigator === 'undefined' || !navigator.permissions) {
        setCameraPermission('unknown')
        return
      }

      try {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName })
        setCameraPermission(result.state as 'granted' | 'denied' | 'prompt')

        result.addEventListener('change', () => {
          setCameraPermission(result.state as 'granted' | 'denied' | 'prompt')
        })
      } catch (err) {
        console.error('Error checking camera permission:', err)
        setCameraPermission('unknown')
      }
    }

    checkPermission()
  }, [])

  // Start scanning
  const startScanning = useCallback(async (elementId: string) => {
    try {
      setError(null)

      // Initialize scanner if not already done
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(elementId)
      }

      const scanner = html5QrCodeRef.current

      // Check if already scanning
      if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
        console.log('Scanner already running')
        return
      }

      // Success callback with cooldown to prevent duplicate scans
      const qrCodeSuccessCallback = (decodedText: string) => {
        // Prevent duplicate scans within 2 seconds
        if (decodedText === lastScanRef.current) {
          return
        }

        lastScanRef.current = decodedText

        // Clear previous cooldown
        if (scanCooldownRef.current) {
          clearTimeout(scanCooldownRef.current)
        }

        // Set cooldown
        scanCooldownRef.current = setTimeout(() => {
          lastScanRef.current = ''
        }, 2000)

        onScanSuccess(decodedText)
      }

      // Error callback (optional, mostly for debugging)
      const qrCodeErrorCallback = (errorMessage: string) => {
        // Ignore common scanning errors (no QR code in frame)
        if (errorMessage.includes('NotFoundException')) {
          return
        }
        
        if (onScanError) {
          onScanError(errorMessage)
        }
      }

      // Start scanning with rear camera (preferred for mobile)
      const config = {
        fps,
        qrbox,
        aspectRatio,
        disableFlip
      }

      await scanner.start(
        { facingMode: 'environment' }, // Use rear camera
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      )

      setIsScanning(true)
      setError(null)
    } catch (err) {
      console.error('Error starting scanner:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to start camera'
      setError(errorMessage)
      setIsScanning(false)

      if (onScanError) {
        onScanError(errorMessage)
      }
    }
  }, [fps, qrbox, aspectRatio, disableFlip, onScanSuccess, onScanError])

  // Stop scanning
  const stopScanning = useCallback(async () => {
    try {
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current

        if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
          await scanner.stop()
        }

        setIsScanning(false)
        setError(null)
      }
    } catch (err) {
      console.error('Error stopping scanner:', err)
      setError(err instanceof Error ? err.message : 'Failed to stop camera')
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        const scanner = html5QrCodeRef.current
        if (scanner.getState() === Html5QrcodeScannerState.SCANNING) {
          scanner.stop().catch(console.error)
        }
      }

      if (scanCooldownRef.current) {
        clearTimeout(scanCooldownRef.current)
      }
    }
  }, [])

  return {
    isScanning,
    error,
    startScanning,
    stopScanning,
    hasCamera,
    cameraPermission
  }
}


'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, RefreshCw, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface QRCodeSectionProps {
  userId: string
}

export function QRCodeSection({ userId }: QRCodeSectionProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    fetchQRCode()
  }, [userId])

  const fetchQRCode = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile/qr/generate')
      const data = await response.json()

      if (data.success) {
        setQrCodeImage(data.data.qr_code_image)
      } else {
        toast.error('Failed to load QR code')
      }
    } catch (error) {
      console.error('Error fetching QR code:', error)
      toast.error('Failed to load QR code')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateQR = async () => {
    try {
      setRegenerating(true)
      const response = await fetch('/api/profile/qr/generate', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setQrCodeImage(data.data.qr_code_image)
        toast.success('QR code regenerated successfully')
      } else {
        toast.error('Failed to regenerate QR code')
      }
    } catch (error) {
      console.error('Error regenerating QR code:', error)
      toast.error('Failed to regenerate QR code')
    } finally {
      setRegenerating(false)
    }
  }

  const handleDownloadQR = () => {
    if (!qrCodeImage) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `profile-qr-code-${userId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded!')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Your Profile QR Code
            </CardTitle>
            <CardDescription>
              Use this QR code to check in to any event you're registered for
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : qrCodeImage ? (
          <>
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <Image
                src={qrCodeImage}
                alt="Profile QR Code"
                width={256}
                height={256}
                className="rounded-lg"
              />
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                  How to use your QR code:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Download and save this QR code to your device</li>
                  <li>Present it at event check-in stations</li>
                  <li>Staff will scan it to check you into your registered events</li>
                  <li>One QR code works for all your events</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadQR}
                  className="flex-1"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>

                <Button
                  onClick={handleRegenerateQR}
                  disabled={regenerating}
                  variant="outline"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No QR code available</p>
            <Button onClick={handleRegenerateQR} disabled={regenerating}>
              <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
              Generate QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


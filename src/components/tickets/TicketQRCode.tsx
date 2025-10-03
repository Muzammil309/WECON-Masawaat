/**
 * Ticket QR Code Component
 * Display QR code on digital ticket with download/print/share options
 */

'use client'

import React, { useState, useEffect } from 'react'
import { QrCode, Download, Printer, Share2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TicketQRCodeProps {
  ticketId: string
  attendeeName?: string
  eventName?: string
  ticketTier?: string
  size?: 'sm' | 'md' | 'lg'
  showActions?: boolean
  className?: string
}

export function TicketQRCode({
  ticketId,
  attendeeName,
  eventName,
  ticketTier,
  size = 'md',
  showActions = true,
  className
}: TicketQRCodeProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Size configurations
  const sizeConfig = {
    sm: { width: 200, containerClass: 'w-48' },
    md: { width: 300, containerClass: 'w-72' },
    lg: { width: 400, containerClass: 'w-96' }
  }

  const config = sizeConfig[size]

  // Fetch QR code
  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/tickets/${ticketId}/qr?width=${config.width}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch QR code')
        }

        const data = await response.json()
        setQrCodeUrl(data.qrCode)
      } catch (err) {
        console.error('Error fetching QR code:', err)
        setError(err instanceof Error ? err.message : 'Failed to load QR code')
        toast.error('Failed to load QR code')
      } finally {
        setLoading(false)
      }
    }

    fetchQRCode()
  }, [ticketId, config.width])

  // Download QR code
  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `ticket-${ticketId}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('QR code downloaded')
  }

  // Print ticket
  const handlePrint = () => {
    if (!qrCodeUrl) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Please allow popups to print')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Event Ticket - ${attendeeName || 'Guest'}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
            }
            .ticket {
              text-align: center;
              max-width: 400px;
            }
            .ticket h1 {
              font-size: 24px;
              margin-bottom: 10px;
            }
            .ticket h2 {
              font-size: 18px;
              color: #666;
              margin-bottom: 20px;
            }
            .ticket img {
              max-width: 100%;
              height: auto;
              margin: 20px 0;
            }
            .ticket p {
              font-size: 14px;
              color: #888;
              margin: 5px 0;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h1>${eventName || 'Event Ticket'}</h1>
            <h2>${attendeeName || 'Guest'}</h2>
            ${ticketTier ? `<p><strong>${ticketTier}</strong></p>` : ''}
            <img src="${qrCodeUrl}" alt="Ticket QR Code" />
            <p>Scan this QR code at the event entrance</p>
            <p>Ticket ID: ${ticketId.slice(0, 8)}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
    
    toast.success('Opening print dialog')
  }

  // Share ticket
  const handleShare = async () => {
    if (!qrCodeUrl) return

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const file = new File([blob], `ticket-${ticketId}.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${eventName || 'Event'} Ticket`,
          text: `Ticket for ${attendeeName || 'Guest'}`,
          files: [file]
        })
        toast.success('Ticket shared')
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Ticket link copied to clipboard')
      }
    } catch (err) {
      console.error('Error sharing:', err)
      toast.error('Failed to share ticket')
    }
  }

  return (
    <Card className={cn('border-white/10 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl', className)}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Your Ticket QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className={cn('mx-auto', config.containerClass)}>
          {loading ? (
            <div className="aspect-square bg-white/5 rounded-lg flex items-center justify-center">
              <Loader2 className="h-12 w-12 text-slate-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="aspect-square bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center p-4">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          ) : qrCodeUrl ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-white p-4 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="Ticket QR Code"
                  className="w-full h-auto"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Ticket Info */}
        {(attendeeName || eventName || ticketTier) && (
          <div className="text-center space-y-1">
            {attendeeName && (
              <p className="text-white font-semibold">{attendeeName}</p>
            )}
            {eventName && (
              <p className="text-slate-300 text-sm">{eventName}</p>
            )}
            {ticketTier && (
              <p className="text-slate-400 text-xs">{ticketTier}</p>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && qrCodeUrl && (
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Present this QR code at the event entrance for check-in
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


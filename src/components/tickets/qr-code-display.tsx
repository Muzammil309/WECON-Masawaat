'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QRCodeDisplayProps {
  ticketId: string
  qrCode: string
  eventTitle: string
  ticketTierName: string
  isCheckedIn?: boolean
  className?: string
}

export function QRCodeDisplay({ 
  ticketId, 
  qrCode, 
  eventTitle, 
  ticketTierName, 
  isCheckedIn = false,
  className 
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrCode, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error)
      })
    }
  }, [qrCode])

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `ticket-${ticketId}.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Event Ticket
            </CardTitle>
            <CardDescription>
              {eventTitle} - {ticketTierName}
            </CardDescription>
          </div>
          <Badge variant={isCheckedIn ? 'default' : 'secondary'}>
            {isCheckedIn ? 'Checked In' : 'Valid'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg border">
            <canvas ref={canvasRef} />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Ticket ID: {ticketId}
            </p>
            <p className="text-xs text-muted-foreground">
              Present this QR code at the event entrance
            </p>
          </div>

          <Button variant="outline" onClick={downloadQRCode} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

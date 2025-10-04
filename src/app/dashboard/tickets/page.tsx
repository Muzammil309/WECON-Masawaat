'use client'

import { useEffect, useState, Suspense } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { MyTickets } from '@/components/tickets/my-tickets'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Ticket, Calendar, CheckCircle2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

function TicketsPageContent() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check for successful payment
    const success = searchParams.get('success')
    const sessionId = searchParams.get('session_id')

    if (success === 'true' && sessionId) {
      toast.success('Payment successful! Your tickets have been generated.')

      // Clean up URL
      window.history.replaceState({}, '', '/dashboard/tickets')
    }
  }, [searchParams])

  if (!mounted || !user) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Ticket className="h-8 w-8" />
          My Tickets
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage your event tickets
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            <Ticket className="h-4 w-4 mr-2" />
            All Tickets
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="h-4 w-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="used">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Used
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <MyTickets userId={user.id} />
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upcoming Events Filter
              </h3>
              <p className="text-gray-600 max-w-md">
                This feature will show only tickets for upcoming events. Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="used" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Used Tickets Filter
              </h3>
              <p className="text-gray-600 max-w-md">
                This feature will show only checked-in tickets. Coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">How to Use Your Tickets</CardTitle>
          <CardDescription className="text-blue-700">
            Important information about your event tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900">
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-blue-100 text-blue-900 h-6 w-6 rounded-full flex items-center justify-center p-0">
              1
            </Badge>
            <p>
              <strong>Download your ticket</strong> - Click the "Download Ticket" button to save a copy
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-blue-100 text-blue-900 h-6 w-6 rounded-full flex items-center justify-center p-0">
              2
            </Badge>
            <p>
              <strong>Bring your QR code</strong> - Show the QR code on your phone or printed ticket at the venue
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-blue-100 text-blue-900 h-6 w-6 rounded-full flex items-center justify-center p-0">
              3
            </Badge>
            <p>
              <strong>Check-in at the event</strong> - Staff will scan your QR code for entry
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-blue-100 text-blue-900 h-6 w-6 rounded-full flex items-center justify-center p-0">
              4
            </Badge>
            <p>
              <strong>Earn points</strong> - You'll automatically earn points when you check in!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TicketsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    }>
      <TicketsPageContent />
    </Suspense>
  )
}


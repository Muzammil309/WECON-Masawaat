/**
 * Badge Print Queue Management Page
 * Admin dashboard for monitoring and managing badge printing
 */

'use client'

import React from 'react'
import { BadgePrintQueue } from '@/components/admin/BadgePrintQueue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BadgeQueuePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          onClick={() => router.back()}
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Badge Print Queue */}
        <BadgePrintQueue refreshInterval={5000} />
      </div>
    </div>
  )
}


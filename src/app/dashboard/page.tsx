'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { AttendeeDashboard } from '@/components/dashboard/attendee/attendee-dashboard'
import { SpeakerDashboard } from '@/components/dashboard/speaker/speaker-dashboard'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.user_metadata?.role === 'admin') {
      router.replace('/admin')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const role = (user.user_metadata?.role as 'attendee' | 'speaker' | 'admin') || 'attendee'
  const title = role === 'speaker' ? 'Speaker Dashboard' : 'My Dashboard'
  const description = role === 'speaker' ? 'Manage sessions, materials and feedback' : 'Your tickets, schedule and recommendations'

  return (
    <DashboardShell role={role} title={title} description={description}>
      {role === 'speaker' ? <SpeakerDashboard /> : <AttendeeDashboard />}
    </DashboardShell>
  )
}

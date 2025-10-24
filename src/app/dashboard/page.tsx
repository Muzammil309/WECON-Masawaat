'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { ModernAttendeeDashboard } from '@/components/dashboard/attendee/modern-attendee-dashboard'
import { ProfessionalSpeakerDashboard } from '@/components/dashboard/speaker/professional-speaker-dashboard'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default function DashboardPage() {
  const { user, loading, role } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('📊 Dashboard: Auth state:', {
      hasUser: !!user,
      userId: user?.id,
      loading,
      role
    })
  }, [user, loading, role])

  useEffect(() => {
    if (role === 'admin') {
      console.log('📊 Dashboard: Admin detected, redirecting to /admin')
      router.replace('/admin')
    }
  }, [role, router])

  if (loading) {
    console.log('📊 Dashboard: Still loading...')
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-slate-900 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('📊 Dashboard: No user, showing access denied')
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center space-y-6 p-8 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-600 text-lg">Please sign in to access your dashboard.</p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Use modern dashboard for attendees and speakers
  if (role === 'speaker') {
    console.log('📊 Dashboard: Rendering speaker dashboard')
    return <ProfessionalSpeakerDashboard />
  }

  console.log('📊 Dashboard: Rendering attendee dashboard')
  return <ModernAttendeeDashboard />
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { AdminOverviewTab } from '@/components/dashboard/admin/overview-tab'
import { AttendeeOverviewTab } from '@/components/dashboard/attendee/overview-tab'

export default function VisionDashboardPage() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('🔍 Vision Dashboard: Auth state:', {
      authLoading,
      hasUser: !!user,
      userId: user?.id,
      role
    })
  }, [authLoading, user, role])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !redirecting) {
      console.log('🔒 Vision Dashboard: User not authenticated, redirecting to login')
      setRedirecting(true)
      router.push('/auth/login')
    }
  }, [user, authLoading, router, redirecting])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, the useEffect will redirect to login
  // This prevents flash of content before redirect
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Determine dashboard title based on role
  const dashboardTitle = role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'
  const breadcrumb = role === 'admin' ? 'Admin' : 'Attendee'

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
      {/* Decorative Background Image */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(121, 40, 202, 0.3) 0%, rgba(15, 21, 53, 0) 70%)',
          filter: 'blur(136px)',
        }}
      />

      {/* Sidebar */}
      <VisionSidebar />

      {/* Main Content */}
      <div className="ml-[284px] p-[20px] relative z-10">
        {/* Top Navigation */}
        <VisionTopbar title={dashboardTitle} breadcrumb={breadcrumb} />

        {/* Role-Based Dashboard Content */}
        {role === 'admin' ? (
          <AdminOverviewTab loading={loading} />
        ) : (
          <AttendeeOverviewTab loading={loading} />
        )}

        {/* Footer */}
        <VisionFooter />
      </div>
    </div>
  )
}


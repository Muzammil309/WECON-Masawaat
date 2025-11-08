'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'

export default function EventManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log('🔍 Event Management Layout: Auth state:', {
      authLoading,
      hasUser: !!user,
      userId: user?.id,
      role
    })
  }, [authLoading, user, role])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user && !redirecting) {
      console.log('🔒 Event Management: User not authenticated, redirecting to login')
      setRedirecting(true)
      router.push('/auth/login')
    }
  }, [user, authLoading, router, redirecting])

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && user && role !== 'admin' && !redirecting) {
      console.log('🔒 Event Management: Non-admin user, redirecting to main dashboard')
      setRedirecting(true)
      router.push('/dashboard/vision')
    }
  }, [user, role, authLoading, router, redirecting])

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

  // If not authenticated or not admin, show loading while redirecting
  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
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
      <div className="pl-[284px] relative z-10">
        {/* Top Navigation */}
        <VisionTopbar title="Event Management" breadcrumb="Admin" />

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}


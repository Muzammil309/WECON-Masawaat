'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { AttendeesContent } from '@/components/dashboard/admin/attendees-content'

export default function AttendeesPage() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🔒 Attendees: User not authenticated, redirecting to login')
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && user && role !== 'admin') {
      console.log('🔒 Attendees: User is not admin, redirecting to dashboard')
      router.push('/dashboard/vision')
    }
  }, [user, role, authLoading, router])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
      {/* Decorative Background */}
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
        <VisionTopbar title="Attendees Management" breadcrumb="Attendees" />
        <AttendeesContent />
        <VisionFooter />
      </div>
    </div>
  )
}


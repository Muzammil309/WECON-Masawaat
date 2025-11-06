'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { AdminOverviewTab } from '@/components/dashboard/admin/overview-tab'
import { AttendeeOverviewTab } from '@/components/dashboard/attendee/overview-tab'
import { EventsContent } from '@/components/dashboard/admin/events-content'
import { AgendaSessionsContent } from '@/components/dashboard/admin/agenda-sessions-content'
import { RegistrationContent } from '@/components/dashboard/admin/registration-content'
import { CheckinBadgesContent } from '@/components/dashboard/admin/checkin-badges-content'
import { SpeakersContent } from '@/components/dashboard/admin/speakers-content'
import { ExhibitorsSponsorsContent } from '@/components/dashboard/admin/exhibitors-sponsors-content'
import { AnalyticsEnhancedContent } from '@/components/dashboard/admin/analytics-enhanced-content'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  UserPlus,
  ScanLine,
  Users,
  Store,
  BarChart3
} from 'lucide-react'

function VisionDashboardContent() {
  const { user, role, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'overview')

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-[24px]">
            <TabsList className="bg-white/5 border border-white/10 p-[6px] rounded-[16px] inline-flex gap-[6px]">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <LayoutDashboard className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <CalendarDays className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Events
              </TabsTrigger>
              <TabsTrigger
                value="agenda"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <ClipboardList className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Agenda & Sessions
              </TabsTrigger>
              <TabsTrigger
                value="registration"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <UserPlus className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Registration
              </TabsTrigger>
              <TabsTrigger
                value="checkin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <ScanLine className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Check-in & Badges
              </TabsTrigger>
              <TabsTrigger
                value="speakers"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <Users className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Speakers
              </TabsTrigger>
              <TabsTrigger
                value="exhibitors"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <Store className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Exhibitors & Sponsors
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-white/60 px-[20px] py-[10px] rounded-[12px] text-[14px] font-semibold transition-all flex items-center gap-[8px]"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                <BarChart3 className="h-[16px] w-[16px]" strokeWidth={2.5} />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-[24px]">
              <AdminOverviewTab loading={loading} />
            </TabsContent>

            <TabsContent value="events" className="mt-[24px]">
              <EventsContent />
            </TabsContent>

            <TabsContent value="agenda" className="mt-[24px]">
              <AgendaSessionsContent />
            </TabsContent>

            <TabsContent value="registration" className="mt-[24px]">
              <RegistrationContent />
            </TabsContent>

            <TabsContent value="checkin" className="mt-[24px]">
              <CheckinBadgesContent />
            </TabsContent>

            <TabsContent value="speakers" className="mt-[24px]">
              <SpeakersContent />
            </TabsContent>

            <TabsContent value="exhibitors" className="mt-[24px]">
              <ExhibitorsSponsorsContent />
            </TabsContent>

            <TabsContent value="analytics" className="mt-[24px]">
              <AnalyticsEnhancedContent />
            </TabsContent>
          </Tabs>
        ) : (
          <AttendeeOverviewTab loading={loading} />
        )}

        {/* Footer */}
        <VisionFooter />
      </div>
    </div>
  )
}

export default function VisionDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading dashboard...</p>
        </div>
      </div>
    }>
      <VisionDashboardContent />
    </Suspense>
  )
}


import { WeconHeader } from '@/components/landing/wecon-header'
import { WeconHero } from '@/components/landing/wecon-hero'
import { WeconScheduleCard } from '@/components/landing/wecon-schedule-card'
import { WeconActivities } from '@/components/landing/wecon-activities'
import { WeconFooter } from '@/components/landing/wecon-footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with logos */}
      <WeconHeader />

      {/* Main Content Container */}
      <main className="max-w-[390px] sm:max-w-[768px] lg:max-w-[1200px] mx-auto px-[20px] sm:px-[32px] lg:px-[48px] py-[24px] sm:py-[32px] lg:py-[40px] space-y-[24px] sm:space-y-[32px] lg:space-y-[40px]">
        {/* Hero Section with WECON branding */}
        <WeconHero />

        {/* Schedule Card */}
        <WeconScheduleCard />

        {/* Activities List */}
        <WeconActivities />

        {/* Footer Card */}
        <WeconFooter />
      </main>
    </div>
  )
}


'use client'

import { KPIMetrics } from '@/components/dashboard/admin/kpi-metrics'
import { LiveSessionManager } from '@/components/dashboard/admin/live-session-manager'
import { RecentCheckIns } from '@/components/dashboard/admin/recent-checkins'
import { QuickActions } from '@/components/dashboard/admin/quick-actions'

interface AnalyticsDashboardProps {
  organizerId?: string
  eventId?: string
}

export function AnalyticsDashboard({ organizerId, eventId }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Metrics */}
      <KPIMetrics eventId={eventId} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Session Manager */}
        <LiveSessionManager />

        {/* Recent Check-ins */}
        <RecentCheckIns />
      </div>
    </div>
  )
}


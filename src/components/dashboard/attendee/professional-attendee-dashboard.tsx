"use client"

import React from "react"
import { ProfessionalDashboardLayout } from "../professional-dashboard-layout"
import { 
  ProfessionalStatCard, 
  ProfessionalContentCard, 
  ProfessionalButton,
  professionalDarkTheme 
} from "../soft-ui/professional-dark-theme"
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart3,
  Users,
  Settings,
  Calendar as CalendarIcon,
  Ticket as TicketIcon,
  Clock as ClockIcon,
  TrendingUp as TrendingUpIcon,
  Plus as PlusIcon,
  ExternalLink as ExternalLinkIcon,
  QrCode as QrCodeIcon,
  User as UserIcon,
  Bell as BellIcon,
  Star as StarIcon
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"

export function ProfessionalAttendeeDashboard() {
  const { user } = useAuth()

  // Mock data for demonstration (replace with real Supabase queries later)
  const tickets = [
    {
      id: 1,
      status: 'active',
      ticket_type: 'VIP Access',
      order: {
        event_id: 1,
        event: {
          title: 'AI & Machine Learning Summit 2024',
          start_date: '2024-02-15'
        }
      }
    },
    {
      id: 2,
      status: 'active',
      ticket_type: 'General Admission',
      order: {
        event_id: 2,
        event: {
          title: 'Web Development Conference',
          start_date: '2024-03-10'
        }
      }
    }
  ]

  const events = [
    { id: 1, title: 'AI & Machine Learning Summit 2024' },
    { id: 2, title: 'Web Development Conference' },
    { id: 3, title: 'Digital Marketing Expo' }
  ]

  // Calculate statistics
  const registeredEvents = new Set(tickets.map(t => t.order?.event_id).filter(Boolean)).size
  const activeTickets = tickets.filter(t => t.status === 'active').length
  const upcomingSessions = tickets.filter(t => {
    const eventDate = new Date(t.order?.event?.start_date || '')
    return eventDate > new Date()
  }).length

  // Dashboard tabs configuration
  const dashboardTabs = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
      content: <OverviewTab 
        registeredEvents={registeredEvents}
        activeTickets={activeTickets}
        upcomingSessions={upcomingSessions}
        tickets={tickets}
        user={user}
      />
    },
    {
      id: "tickets",
      title: "My Tickets",
      icon: Ticket,
      content: <TicketsTab tickets={tickets} />
    },
    {
      id: "schedule",
      title: "Schedule",
      icon: Calendar,
      content: <ScheduleTab tickets={tickets} />
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: BarChart3,
      content: <RecommendationsTab events={events} />
    },
    {
      id: "networking",
      title: "Networking",
      icon: Users,
      content: <NetworkingTab />
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      content: <SettingsTab user={user} />
    }
  ]

  return (
    <ProfessionalDashboardLayout
      role="attendee"
      tabs={dashboardTabs}
      defaultTab="overview"
      title="My Dashboard"
      description="Your tickets, schedule and recommendations"
    />
  )
}

// Overview Tab Component
function OverviewTab({ registeredEvents, activeTickets, upcomingSessions, tickets, user }: any) {
  const userName = user?.user_metadata?.full_name || user?.email || "User"
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <ProfessionalContentCard gradient gradientType="purple" className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
              style={{ background: professionalDarkTheme.gradients.success }}
            >
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome back, {userName}!
              </h2>
              <p className="text-slate-300">
                Ready to explore amazing events and connect with like-minded people?
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ProfessionalButton variant="gradient" gradient="success" size="md">
              <PlusIcon className="h-4 w-4 mr-2" />
              Browse Events
            </ProfessionalButton>
            <ProfessionalButton variant="outline" size="md">
              <CalendarIcon className="h-4 w-4 mr-2" />
              View Schedule
            </ProfessionalButton>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
          <div 
            className="w-full h-full rounded-full transform translate-x-20 -translate-y-20 animate-pulse"
            style={{ background: professionalDarkTheme.gradients.success }}
          />
        </div>
      </ProfessionalContentCard>

      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ProfessionalStatCard
          title="Registered Events"
          value={registeredEvents}
          change={{ value: "+2 this month", type: "increase" }}
          icon={<CalendarIcon className="h-5 w-5" />}
          gradient="primary"
        />
        <ProfessionalStatCard
          title="Active Tickets"
          value={activeTickets}
          change={{ value: "All valid", type: "neutral" }}
          icon={<TicketIcon className="h-5 w-5" />}
          gradient="success"
        />
        <ProfessionalStatCard
          title="Upcoming Sessions"
          value={upcomingSessions}
          change={{ value: "Next 30 days", type: "increase" }}
          icon={<ClockIcon className="h-5 w-5" />}
          gradient="info"
        />
        <ProfessionalStatCard
          title="Recommendations"
          value="12"
          change={{ value: "Based on interests", type: "increase" }}
          icon={<TrendingUpIcon className="h-5 w-5" />}
          gradient="warning"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tickets */}
        <ProfessionalContentCard
          title="Recent Tickets"
          subtitle="Your latest event registrations"
          icon={<TicketIcon className="h-5 w-5" />}
          action={
            <ProfessionalButton variant="ghost" size="sm">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              View All
            </ProfessionalButton>
          }
        >
          <div className="space-y-4">
            {tickets.slice(0, 3).map((ticket: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ background: professionalDarkTheme.gradients.primary }}
                  >
                    <TicketIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {ticket.order?.event?.title || 'Event Ticket'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {ticket.ticket_type || 'General Admission'}
                    </p>
                  </div>
                </div>
                <Badge 
                  className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                >
                  {ticket.status || 'Active'}
                </Badge>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="text-center py-8">
                <TicketIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No tickets yet</p>
                <ProfessionalButton variant="gradient" size="sm">
                  Browse Events
                </ProfessionalButton>
              </div>
            )}
          </div>
        </ProfessionalContentCard>

        {/* Quick Actions */}
        <ProfessionalContentCard
          title="Quick Actions"
          subtitle="Frequently used features"
          icon={<StarIcon className="h-5 w-5" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfessionalButton variant="gradient" gradient="primary" fullWidth>
              <QrCodeIcon className="h-4 w-4 mr-2" />
              Show QR Code
            </ProfessionalButton>
            <ProfessionalButton variant="gradient" gradient="success" fullWidth>
              <CalendarIcon className="h-4 w-4 mr-2" />
              View Schedule
            </ProfessionalButton>
            <ProfessionalButton variant="gradient" gradient="info" fullWidth>
              <BellIcon className="h-4 w-4 mr-2" />
              Notifications
            </ProfessionalButton>
            <ProfessionalButton variant="gradient" gradient="warning" fullWidth>
              <UserIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </ProfessionalButton>
          </div>
        </ProfessionalContentCard>
      </div>
    </div>
  )
}

// Tickets Tab Component
function TicketsTab({ tickets }: any) {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="My Tickets"
        subtitle="All your event tickets in one place"
        icon={<TicketIcon className="h-5 w-5" />}
      >
        <div className="space-y-4">
          {tickets.map((ticket: any, index: number) => (
            <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {ticket.order?.event?.title || 'Event Ticket'}
                  </h3>
                  <p className="text-slate-400">
                    {ticket.ticket_type || 'General Admission'}
                  </p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  {ticket.status || 'Active'}
                </Badge>
              </div>
              <div className="flex gap-3">
                <ProfessionalButton variant="gradient" size="sm">
                  <QrCodeIcon className="h-4 w-4 mr-2" />
                  Show QR
                </ProfessionalButton>
                <ProfessionalButton variant="outline" size="sm">
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Details
                </ProfessionalButton>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-12">
              <TicketIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No tickets yet</h3>
              <p className="text-slate-400 mb-6">Start by browsing our amazing events</p>
              <ProfessionalButton variant="gradient" size="lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                Browse Events
              </ProfessionalButton>
            </div>
          )}
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Schedule Tab Component
function ScheduleTab({ tickets }: any) {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="My Schedule"
        subtitle="Upcoming events and sessions"
        icon={<CalendarIcon className="h-5 w-5" />}
      >
        <div className="text-center py-12">
          <CalendarIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Schedule coming soon</h3>
          <p className="text-slate-400">We're working on your personalized schedule</p>
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Recommendations Tab Component
function RecommendationsTab({ events }: any) {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="Recommended Events"
        subtitle="Events you might be interested in"
        icon={<TrendingUpIcon className="h-5 w-5" />}
      >
        <div className="text-center py-12">
          <TrendingUpIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Recommendations coming soon</h3>
          <p className="text-slate-400">We're analyzing your preferences to suggest perfect events</p>
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Networking Tab Component
function NetworkingTab() {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="Networking"
        subtitle="Connect with other attendees"
        icon={<Users className="h-5 w-5" />}
      >
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Networking features coming soon</h3>
          <p className="text-slate-400">Connect and chat with fellow event attendees</p>
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Settings Tab Component
function SettingsTab({ user }: any) {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="Account Settings"
        subtitle="Manage your profile and preferences"
        icon={<Settings className="h-5 w-5" />}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.user_metadata?.full_name || ''}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 cursor-not-allowed"
            />
          </div>
          <div className="flex gap-3">
            <ProfessionalButton variant="gradient" size="md">
              Save Changes
            </ProfessionalButton>
            <ProfessionalButton variant="outline" size="md">
              Cancel
            </ProfessionalButton>
          </div>
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

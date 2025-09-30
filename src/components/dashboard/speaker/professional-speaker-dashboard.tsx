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
  FileText,
  BarChart3,
  MessageSquare,
  Settings,
  Presentation as PresentationIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  TrendingUp as TrendingUpIcon,
  Plus as PlusIcon,
  ExternalLink as ExternalLinkIcon,
  Mic as MicIcon,
  Video as VideoIcon,
  Download as DownloadIcon,
  Star as StarIcon
} from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { Badge } from "@/components/ui/badge"

export function ProfessionalSpeakerDashboard() {
  const { user } = useAuth()

  // Mock data for demonstration (replace with real Supabase queries later)
  const sessions = [
    {
      id: 1,
      title: 'Introduction to AI Ethics',
      start_time: '2024-02-15T10:00:00Z',
      max_attendees: 100,
      event: {
        title: 'AI & Machine Learning Summit 2024'
      }
    },
    {
      id: 2,
      title: 'Building Scalable Web Applications',
      start_time: '2024-03-10T14:00:00Z',
      max_attendees: 150,
      event: {
        title: 'Web Development Conference'
      }
    }
  ]

  // Calculate statistics
  const totalSessions = sessions.length
  const upcomingSessions = sessions.filter(s => new Date(s.start_time) > new Date()).length
  const totalAttendees = sessions.reduce((sum, s) => sum + (s.max_attendees || 0), 0)

  // Dashboard tabs configuration
  const dashboardTabs = [
    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
      content: <OverviewTab 
        totalSessions={totalSessions}
        upcomingSessions={upcomingSessions}
        totalAttendees={totalAttendees}
        sessions={sessions}
        user={user}
      />
    },
    {
      id: "sessions",
      title: "My Sessions",
      icon: Calendar,
      content: <SessionsTab sessions={sessions} />
    },
    {
      id: "materials",
      title: "Materials",
      icon: FileText,
      content: <MaterialsTab />
    },
    {
      id: "engagement",
      title: "Engagement",
      icon: BarChart3,
      content: <EngagementTab />
    },
    {
      id: "feedback",
      title: "Feedback",
      icon: MessageSquare,
      content: <FeedbackTab />
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
      role="speaker"
      tabs={dashboardTabs}
      defaultTab="overview"
      title="Speaker Dashboard"
      description="Manage sessions, materials and feedback"
    />
  )
}

// Overview Tab Component
function OverviewTab({ totalSessions, upcomingSessions, totalAttendees, sessions, user }: any) {
  const speakerName = user?.user_metadata?.full_name || user?.email || "Speaker"
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <ProfessionalContentCard gradient gradientType="blue" className="relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl"
              style={{ background: professionalDarkTheme.gradients.blue }}
            >
              <MicIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Welcome, {speakerName}!
              </h2>
              <p className="text-slate-300">
                Ready to inspire and engage your audience with amazing presentations?
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <ProfessionalButton variant="gradient" gradient="blue" size="md">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Session
            </ProfessionalButton>
            <ProfessionalButton variant="outline" size="md">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </ProfessionalButton>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-20">
          <div 
            className="w-full h-full rounded-full transform translate-x-20 -translate-y-20 animate-pulse"
            style={{ background: professionalDarkTheme.gradients.blue }}
          />
        </div>
      </ProfessionalContentCard>

      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ProfessionalStatCard
          title="Total Sessions"
          value={totalSessions}
          change={{ value: "+3 this month", type: "increase" }}
          icon={<PresentationIcon className="h-5 w-5" />}
          gradient="primary"
        />
        <ProfessionalStatCard
          title="Upcoming Sessions"
          value={upcomingSessions}
          change={{ value: "Next 30 days", type: "neutral" }}
          icon={<ClockIcon className="h-5 w-5" />}
          gradient="success"
        />
        <ProfessionalStatCard
          title="Total Attendees"
          value={totalAttendees}
          change={{ value: "Across all sessions", type: "increase" }}
          icon={<UsersIcon className="h-5 w-5" />}
          gradient="info"
        />
        <ProfessionalStatCard
          title="Avg Rating"
          value="4.8"
          change={{ value: "Based on feedback", type: "increase" }}
          icon={<StarIcon className="h-5 w-5" />}
          gradient="warning"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <ProfessionalContentCard
          title="Upcoming Sessions"
          subtitle="Your next presentations"
          icon={<Calendar className="h-5 w-5" />}
          action={
            <ProfessionalButton variant="ghost" size="sm">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              View All
            </ProfessionalButton>
          }
        >
          <div className="space-y-4">
            {sessions.slice(0, 3).map((session: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ background: professionalDarkTheme.gradients.blue }}
                  >
                    <PresentationIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {session.title || 'Session Title'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {session.event?.title || 'Event Name'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {new Date(session.start_time).toLocaleDateString()}
                </Badge>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No sessions scheduled</p>
                <ProfessionalButton variant="gradient" size="sm">
                  Create Session
                </ProfessionalButton>
              </div>
            )}
          </div>
        </ProfessionalContentCard>

        {/* Quick Actions */}
        <ProfessionalContentCard
          title="Speaker Tools"
          subtitle="Essential tools for speakers"
          icon={<MicIcon className="h-5 w-5" />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfessionalButton variant="gradient" gradient="primary" fullWidth>
              <VideoIcon className="h-4 w-4 mr-2" />
              Live Stream
            </ProfessionalButton>
            <ProfessionalButton variant="gradient" gradient="success" fullWidth>
              <FileText className="h-4 w-4 mr-2" />
              Upload Materials
            </ProfessionalButton>
            <ProfessionalButton variant="gradient" gradient="info" fullWidth>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </ProfessionalButton>
            <ProfessionalButton variant="gradient" gradient="warning" fullWidth>
              <MessageSquare className="h-4 w-4 mr-2" />
              Q&A Session
            </ProfessionalButton>
          </div>
        </ProfessionalContentCard>
      </div>
    </div>
  )
}

// Sessions Tab Component
function SessionsTab({ sessions }: any) {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="My Sessions"
        subtitle="All your speaking sessions"
        icon={<Calendar className="h-5 w-5" />}
        action={
          <ProfessionalButton variant="gradient" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Session
          </ProfessionalButton>
        }
      >
        <div className="space-y-4">
          {sessions.map((session: any, index: number) => (
            <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {session.title || 'Session Title'}
                  </h3>
                  <p className="text-slate-400">
                    {session.event?.title || 'Event Name'}
                  </p>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {new Date(session.start_time).toLocaleDateString()}
                </Badge>
              </div>
              <div className="flex gap-3">
                <ProfessionalButton variant="gradient" size="sm">
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Start Live
                </ProfessionalButton>
                <ProfessionalButton variant="outline" size="sm">
                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                  Edit
                </ProfessionalButton>
              </div>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No sessions yet</h3>
              <p className="text-slate-400 mb-6">Create your first speaking session</p>
              <ProfessionalButton variant="gradient" size="lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Session
              </ProfessionalButton>
            </div>
          )}
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Materials Tab Component
function MaterialsTab() {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="Session Materials"
        subtitle="Upload and manage your presentation materials"
        icon={<FileText className="h-5 w-5" />}
        action={
          <ProfessionalButton variant="gradient" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload File
          </ProfessionalButton>
        }
      >
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No materials uploaded</h3>
          <p className="text-slate-400 mb-6">Upload presentations, documents, and resources</p>
          <ProfessionalButton variant="gradient" size="lg">
            <DownloadIcon className="h-5 w-5 mr-2" />
            Upload Materials
          </ProfessionalButton>
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Engagement Tab Component
function EngagementTab() {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="Audience Engagement"
        subtitle="Analytics and engagement metrics"
        icon={<BarChart3 className="h-5 w-5" />}
      >
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Analytics coming soon</h3>
          <p className="text-slate-400">Track audience engagement and session performance</p>
        </div>
      </ProfessionalContentCard>
    </div>
  )
}

// Feedback Tab Component
function FeedbackTab() {
  return (
    <div className="space-y-6">
      <ProfessionalContentCard
        title="Session Feedback"
        subtitle="Reviews and ratings from attendees"
        icon={<MessageSquare className="h-5 w-5" />}
      >
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No feedback yet</h3>
          <p className="text-slate-400">Feedback will appear after your sessions</p>
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
        title="Speaker Settings"
        subtitle="Manage your speaker profile and preferences"
        icon={<Settings className="h-5 w-5" />}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Speaker Name</label>
            <input
              type="text"
              defaultValue={user?.user_metadata?.full_name || ''}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
              placeholder="Enter your speaker name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">Bio</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50"
              placeholder="Tell us about yourself and your expertise"
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

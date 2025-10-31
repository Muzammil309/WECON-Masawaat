'use client'

import { Calendar, Users, DollarSign, Ticket, Plus, FileText, TrendingUp } from 'lucide-react'
import { StatCard } from '../shared/stat-card'
import { EmptyState } from '../shared/empty-state'
import { mockAdminStats, mockEvents, mockAttendees, getUpcomingEvents, getRecentAttendees } from '@/lib/mock-data/dashboard'

interface AdminOverviewTabProps {
  loading?: boolean
}

export function AdminOverviewTab({ loading }: AdminOverviewTabProps) {
  const stats = mockAdminStats
  const upcomingEvents = getUpcomingEvents().slice(0, 5)
  const recentAttendees = getRecentAttendees(5)

  return (
    <div className="space-y-[24px]">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          trend="+12%"
          trendPositive={true}
          icon={Calendar}
          loading={loading}
        />
        <StatCard
          label="Total Attendees"
          value={stats.totalAttendees.toLocaleString()}
          trend="+23%"
          trendPositive={true}
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Total Revenue"
          value={`PKR ${(stats.totalRevenue / 1000).toFixed(0)}K`}
          trend="+18%"
          trendPositive={true}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          label="Tickets Sold"
          value={stats.ticketsSold.toLocaleString()}
          trend="+15%"
          trendPositive={true}
          icon={Ticket}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="vision-glass-card p-[24px]">
        <h3
          className="text-[18px] font-bold text-white mb-[16px]"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <button
            className="flex items-center gap-[12px] px-[20px] py-[16px] rounded-[12px] text-left transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
            }}
          >
            <Plus className="h-[20px] w-[20px] text-white" />
            <div>
              <p className="text-[14px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Create Event
              </p>
              <p className="text-[12px] font-normal text-white/80" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Start a new event
              </p>
            </div>
          </button>

          <button
            className="flex items-center gap-[12px] px-[20px] py-[16px] rounded-[12px] text-left transition-all hover:bg-white/5"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(121, 40, 202, 0.3)',
            }}
          >
            <FileText className="h-[20px] w-[20px] text-[#7928CA]" />
            <div>
              <p className="text-[14px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                View Reports
              </p>
              <p className="text-[12px] font-normal text-[#A0AEC0]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Analytics & insights
              </p>
            </div>
          </button>

          <button
            className="flex items-center gap-[12px] px-[20px] py-[16px] rounded-[12px] text-left transition-all hover:bg-white/5"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(121, 40, 202, 0.3)',
            }}
          >
            <Ticket className="h-[20px] w-[20px] text-[#7928CA]" />
            <div>
              <p className="text-[14px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Manage Tickets
              </p>
              <p className="text-[12px] font-normal text-[#A0AEC0]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Ticket types & pricing
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
        {/* Upcoming Events */}
        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h3
              className="text-[18px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Upcoming Events
            </h3>
            <button
              className="text-[12px] font-medium text-[#7928CA] hover:text-[#4318FF] transition-colors"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              View All →
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-[16px]">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-[16px] p-[16px] rounded-[12px] hover:bg-white/5 transition-all cursor-pointer"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <div
                    className="flex items-center justify-center w-[50px] h-[50px] rounded-[12px] flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.2) 0%, rgba(67, 24, 255, 0.2) 100%)',
                    }}
                  >
                    <Calendar className="h-[24px] w-[24px] text-[#7928CA]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-[14px] font-bold text-white mb-[4px] truncate"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {event.title}
                    </h4>
                    <p
                      className="text-[12px] font-normal text-[#A0AEC0] mb-[4px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="flex items-center gap-[12px] text-[12px] text-[#A0AEC0]">
                      <span className="flex items-center gap-[4px]">
                        <Users className="h-[14px] w-[14px]" />
                        {event.attendee_count} attendees
                      </span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="No Upcoming Events"
              description="Create your first event to get started"
              actionLabel="Create Event"
              onAction={() => console.log('Create event')}
            />
          )}
        </div>

        {/* Recent Registrations */}
        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <h3
              className="text-[18px] font-bold text-white"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              Recent Registrations
            </h3>
            <button
              className="text-[12px] font-medium text-[#7928CA] hover:text-[#4318FF] transition-colors"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              View All →
            </button>
          </div>

          {recentAttendees.length > 0 ? (
            <div className="space-y-[12px]">
              {recentAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="flex items-center gap-[12px] p-[12px] rounded-[12px] hover:bg-white/5 transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <div
                    className="flex items-center justify-center w-[40px] h-[40px] rounded-full text-[14px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                    }}
                  >
                    {attendee.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px] font-medium text-white truncate"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {attendee.full_name}
                    </p>
                    <p
                      className="text-[12px] font-normal text-[#A0AEC0] truncate"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {attendee.event_name}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-medium px-[8px] py-[4px] rounded-[6px]"
                    style={{
                      background: 'rgba(1, 181, 116, 0.1)',
                      color: '#01B574',
                      fontFamily: '"Plus Jakarta Display", sans-serif',
                    }}
                  >
                    {attendee.ticket_type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No Registrations Yet"
              description="Registrations will appear here once attendees sign up"
            />
          )}
        </div>
      </div>
    </div>
  )
}


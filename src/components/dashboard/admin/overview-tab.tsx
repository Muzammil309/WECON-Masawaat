'use client'

import { CalendarDays, Users2, DollarSign, TicketCheck, Plus, BarChart3, Settings2, MapPin, Clock } from 'lucide-react'
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
    <div className="space-y-[28px]">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        <StatCard
          label="Total Events"
          value={stats.totalEvents}
          trend="+12%"
          trendPositive={true}
          icon={CalendarDays}
          loading={loading}
        />
        <StatCard
          label="Total Attendees"
          value={stats.totalAttendees.toLocaleString()}
          trend="+23%"
          trendPositive={true}
          icon={Users2}
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
          icon={TicketCheck}
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="vision-glass-card p-[28px]">
        <h3
          className="text-[20px] font-bold text-white mb-[20px]"
          style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
        >
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
          <button
            className="group flex items-center gap-[14px] px-[24px] py-[18px] rounded-[16px] text-left transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
            }}
          >
            <div
              className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] bg-white/20 group-hover:bg-white/30 transition-all"
            >
              <Plus className="h-[24px] w-[24px] text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-white mb-[2px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Create Event
              </p>
              <p className="text-[13px] font-normal text-white/80" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Start a new event
              </p>
            </div>
          </button>

          <button
            className="group flex items-center gap-[14px] px-[24px] py-[18px] rounded-[16px] text-left transition-all hover:scale-[1.02] hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(121, 40, 202, 0.3)',
            }}
          >
            <div
              className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] group-hover:bg-white/5 transition-all"
              style={{ background: 'rgba(121, 40, 202, 0.15)' }}
            >
              <BarChart3 className="h-[24px] w-[24px] text-[#7928CA]" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-white mb-[2px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                View Reports
              </p>
              <p className="text-[13px] font-normal text-[#A0AEC0]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Analytics & insights
              </p>
            </div>
          </button>

          <button
            className="group flex items-center gap-[14px] px-[24px] py-[18px] rounded-[16px] text-left transition-all hover:scale-[1.02] hover:bg-white/10"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(121, 40, 202, 0.3)',
            }}
          >
            <div
              className="flex items-center justify-center w-[48px] h-[48px] rounded-[14px] group-hover:bg-white/5 transition-all"
              style={{ background: 'rgba(121, 40, 202, 0.15)' }}
            >
              <Settings2 className="h-[24px] w-[24px] text-[#7928CA]" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-bold text-white mb-[2px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Settings
              </p>
              <p className="text-[13px] font-normal text-[#A0AEC0]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Configure platform
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[28px]">
        {/* Upcoming Events */}
        <div className="vision-glass-card p-[28px]">
          <div className="flex items-center justify-between mb-[24px]">
            <div className="flex items-center gap-[12px]">
              <div
                className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px]"
                style={{ background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.2) 0%, rgba(67, 24, 255, 0.2) 100%)' }}
              >
                <CalendarDays className="h-[20px] w-[20px] text-[#7928CA]" strokeWidth={2.5} />
              </div>
              <h3
                className="text-[20px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Upcoming Events
              </h3>
            </div>
            <button
              className="text-[13px] font-semibold text-[#7928CA] hover:text-[#4318FF] transition-colors px-[12px] py-[6px] rounded-[8px] hover:bg-white/5"
              style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
            >
              View All →
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-[14px]">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="group flex items-start gap-[16px] p-[18px] rounded-[16px] hover:bg-white/8 transition-all cursor-pointer border border-transparent hover:border-[#7928CA]/30"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div
                    className="flex items-center justify-center w-[56px] h-[56px] rounded-[14px] flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.25) 0%, rgba(67, 24, 255, 0.25) 100%)',
                    }}
                  >
                    <CalendarDays className="h-[28px] w-[28px] text-[#7928CA]" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-[15px] font-bold text-white mb-[6px] truncate group-hover:text-[#7928CA] transition-colors"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-[8px] mb-[8px]">
                      <div className="flex items-center gap-[6px] text-[13px] text-[#A0AEC0]">
                        <Clock className="h-[14px] w-[14px]" strokeWidth={2} />
                        <span style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                          {new Date(event.start_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px] text-[12px] text-[#A0AEC0]">
                      <span className="flex items-center gap-[6px]">
                        <Users2 className="h-[14px] w-[14px]" strokeWidth={2} />
                        {event.attendee_count} attendees
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-[6px] truncate">
                        <MapPin className="h-[14px] w-[14px]" strokeWidth={2} />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No Upcoming Events"
              description="Create your first event to get started"
              actionLabel="Create Event"
              onAction={() => console.log('Create event')}
            />
          )}
        </div>

        {/* Recent Registrations */}
        <div className="vision-glass-card p-[28px]">
          <div className="flex items-center justify-between mb-[24px]">
            <div className="flex items-center gap-[12px]">
              <div
                className="flex items-center justify-center w-[40px] h-[40px] rounded-[12px]"
                style={{ background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.2) 0%, rgba(67, 24, 255, 0.2) 100%)' }}
              >
                <Users2 className="h-[20px] w-[20px] text-[#7928CA]" strokeWidth={2.5} />
              </div>
              <h3
                className="text-[20px] font-bold text-white"
                style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
              >
                Recent Registrations
              </h3>
            </div>
            <button
              className="text-[13px] font-semibold text-[#7928CA] hover:text-[#4318FF] transition-colors px-[12px] py-[6px] rounded-[8px] hover:bg-white/5"
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
                  className="group flex items-center gap-[14px] p-[14px] rounded-[14px] hover:bg-white/8 transition-all cursor-pointer border border-transparent hover:border-[#7928CA]/30"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div
                    className="flex items-center justify-center w-[48px] h-[48px] rounded-full text-[16px] font-bold text-white group-hover:scale-105 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                    }}
                  >
                    {attendee.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[15px] font-semibold text-white truncate mb-[2px] group-hover:text-[#7928CA] transition-colors"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {attendee.full_name}
                    </p>
                    <p
                      className="text-[13px] font-normal text-[#A0AEC0] truncate"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {attendee.event_name}
                    </p>
                  </div>
                  <span
                    className="text-[11px] font-semibold px-[10px] py-[5px] rounded-[8px] whitespace-nowrap"
                    style={{
                      background: 'rgba(1, 181, 116, 0.15)',
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
              icon={Users2}
              title="No Registrations Yet"
              description="Registrations will appear here once attendees sign up"
            />
          )}
        </div>
      </div>
    </div>
  )
}


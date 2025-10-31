'use client'

import { Calendar, Ticket, MapPin, Clock, QrCode } from 'lucide-react'
import { StatCard } from '../shared/stat-card'
import { EmptyState } from '../shared/empty-state'
import { mockAttendeeStats, mockTickets, getActiveTickets, getUpcomingEvents } from '@/lib/mock-data/dashboard'

interface AttendeeOverviewTabProps {
  loading?: boolean
}

export function AttendeeOverviewTab({ loading }: AttendeeOverviewTabProps) {
  const stats = mockAttendeeStats
  const activeTickets = getActiveTickets()
  const upcomingEvents = getUpcomingEvents().slice(0, 3)

  return (
    <div className="space-y-[24px]">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        <StatCard
          label="Registered Events"
          value={stats.totalEvents}
          icon={Calendar}
          loading={loading}
        />
        <StatCard
          label="Active Tickets"
          value={activeTickets.length}
          icon={Ticket}
          loading={loading}
        />
        <StatCard
          label="Upcoming Events"
          value={stats.activeEvents}
          icon={Clock}
          loading={loading}
        />
      </div>

      {/* My Active Tickets */}
      <div className="vision-glass-card p-[24px]">
        <div className="flex items-center justify-between mb-[20px]">
          <h3
            className="text-[18px] font-bold text-white"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            My Active Tickets
          </h3>
          <button
            className="text-[12px] font-medium text-[#7928CA] hover:text-[#4318FF] transition-colors"
            style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
          >
            View All →
          </button>
        </div>

        {activeTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {activeTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-[20px] rounded-[15px] hover:bg-white/5 transition-all cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '2px solid rgba(121, 40, 202, 0.2)',
                }}
              >
                {/* Ticket Header */}
                <div className="flex items-start justify-between mb-[16px]">
                  <div className="flex-1">
                    <h4
                      className="text-[16px] font-bold text-white mb-[4px]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      {ticket.event_name}
                    </h4>
                    <p
                      className="text-[12px] font-normal text-[#A0AEC0]"
                      style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                    >
                      Ticket ID: {ticket.id}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center w-[50px] h-[50px] rounded-[12px]"
                    style={{
                      background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                    }}
                  >
                    <QrCode className="h-[24px] w-[24px] text-white" />
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="space-y-[8px] mb-[16px]">
                  <div className="flex items-center gap-[8px] text-[12px] text-[#A0AEC0]">
                    <Ticket className="h-[14px] w-[14px]" />
                    <span style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                      {ticket.ticket_type} Ticket
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px] text-[12px] text-[#A0AEC0]">
                    <Calendar className="h-[14px] w-[14px]" />
                    <span style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                      Purchased: {new Date(ticket.purchase_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Ticket Actions */}
                <div className="flex items-center gap-[12px]">
                  <button
                    className="flex-1 px-[16px] py-[10px] rounded-[10px] text-[12px] font-bold text-white transition-all hover:scale-105"
                    style={{
                      fontFamily: '"Plus Jakarta Display", sans-serif',
                      background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                    }}
                  >
                    View QR Code
                  </button>
                  <button
                    className="px-[16px] py-[10px] rounded-[10px] text-[12px] font-bold text-[#7928CA] transition-all hover:bg-white/5"
                    style={{
                      fontFamily: '"Plus Jakarta Display", sans-serif',
                      background: 'rgba(121, 40, 202, 0.1)',
                      border: '1px solid rgba(121, 40, 202, 0.3)',
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Ticket}
            title="No Active Tickets"
            description="You don't have any active tickets. Browse events to get started!"
            actionLabel="Browse Events"
            onAction={() => console.log('Browse events')}
          />
        )}
      </div>

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
            Browse All →
          </button>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-[20px] rounded-[15px] hover:bg-white/5 transition-all cursor-pointer"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Event Icon */}
                <div
                  className="flex items-center justify-center w-[60px] h-[60px] rounded-[15px] mb-[16px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.2) 0%, rgba(67, 24, 255, 0.2) 100%)',
                  }}
                >
                  <Calendar className="h-[30px] w-[30px] text-[#7928CA]" />
                </div>

                {/* Event Details */}
                <h4
                  className="text-[16px] font-bold text-white mb-[8px]"
                  style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}
                >
                  {event.title}
                </h4>
                <div className="space-y-[6px] mb-[16px]">
                  <div className="flex items-center gap-[8px] text-[12px] text-[#A0AEC0]">
                    <Calendar className="h-[14px] w-[14px]" />
                    <span style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-[8px] text-[12px] text-[#A0AEC0]">
                    <MapPin className="h-[14px] w-[14px]" />
                    <span style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                      {event.location}
                    </span>
                  </div>
                </div>

                {/* Event Action */}
                <button
                  className="w-full px-[16px] py-[10px] rounded-[10px] text-[12px] font-bold text-white transition-all hover:scale-105"
                  style={{
                    fontFamily: '"Plus Jakarta Display", sans-serif',
                    background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No Upcoming Events"
            description="There are no upcoming events at the moment. Check back later!"
          />
        )}
      </div>
    </div>
  )
}


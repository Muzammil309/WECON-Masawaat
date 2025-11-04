'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { CheckCircle2, Download, Calendar, MapPin, Ticket, Mail, User, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface TicketData {
  id: string
  qr_code: string
  status: string
  purchase_date: string
  ticket_tier: {
    name: string
    description?: string
    price: number
    currency: string
  }
  user: {
    full_name: string
    email: string
    phone?: string
    company?: string
    job_title?: string
  }
}

interface EventData {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  venue_name?: string
  is_virtual: boolean
}

export default function RegistrationConfirmationPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  
  const eventId = params.id as string
  const ticketId = searchParams.get('ticket_id')

  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [event, setEvent] = useState<EventData | null>(null)
  const [qrCodeImage, setQrCodeImage] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/events/${eventId}/register/confirmation?ticket_id=${ticketId}`)
    }
  }, [user, authLoading, router, eventId, ticketId])

  // Fetch ticket and event data
  useEffect(() => {
    if (user && ticketId) {
      fetchTicketData()
    }
  }, [user, ticketId])

  const fetchTicketData = async () => {
    try {
      setLoading(true)

      // Fetch ticket details
      const ticketResponse = await fetch(`/api/tickets/${ticketId}`)
      const ticketData = await ticketResponse.json()

      if (!ticketData.success) {
        toast.error('Ticket not found')
        router.push('/events')
        return
      }

      setTicket(ticketData.data.ticket)
      setQrCodeImage(ticketData.data.qr_code_image)

      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}`)
      const eventData = await eventResponse.json()

      if (eventData.success) {
        setEvent(eventData.data)
      }
    } catch (error) {
      console.error('Error fetching ticket data:', error)
      toast.error('Failed to load ticket details')
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeImage) return

    const link = document.createElement('a')
    link.href = qrCodeImage
    link.download = `ticket-${ticketId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('QR code downloaded!')
  }

  const addToCalendar = () => {
    if (!event) return

    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//WECON MASAWAAT//Event Registration//EN',
      'BEGIN:VEVENT',
      `UID:${ticketId}@wecon-masawaat.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:Your ticket ID: ${ticketId}`,
      `LOCATION:${event.is_virtual ? 'Virtual Event' : event.venue_name || event.location || 'TBA'}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `event-${eventId}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Event added to calendar!')
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading your ticket...</p>
        </div>
      </div>
    )
  }

  if (!user || !ticket || !event) {
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
      <div className="ml-[280px] min-h-screen flex flex-col">
        <VisionTopbar title="Registration Confirmation" breadcrumb="Events" />

        <main className="flex-1 p-[32px] relative z-10">
          {/* Success Message */}
          <div className="text-center mb-[32px]">
            <div className="inline-flex items-center justify-center w-[80px] h-[80px] rounded-full mb-[16px]" style={{ background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)' }}>
              <CheckCircle2 className="h-[40px] w-[40px] text-white" />
            </div>
            <h1 className="text-[32px] font-bold text-white mb-[8px]">
              Registration Successful!
            </h1>
            <p className="text-[16px] text-[#A0AEC0]">
              Your ticket has been confirmed. Check your email for details.
            </p>
          </div>

          <div className="max-w-[900px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            {/* QR Code Card */}
            <div className="vision-glass-card p-[32px] text-center" style={{ borderRadius: '20px' }}>
              <div className="flex items-center justify-center gap-2 mb-[20px]">
                <QrCode className="h-6 w-6 text-[#7928CA]" />
                <h2 className="text-[20px] font-bold text-white">Your Ticket QR Code</h2>
              </div>

              {/* QR Code Image */}
              {qrCodeImage && (
                <div className="mb-[20px] p-[20px] bg-white rounded-[12px] inline-block">
                  <img
                    src={qrCodeImage}
                    alt="Ticket QR Code"
                    className="w-[280px] h-[280px]"
                  />
                </div>
              )}

              <p className="text-[14px] text-[#A0AEC0] mb-[20px]">
                Present this QR code at the event entrance for check-in
              </p>

              <button
                onClick={downloadQRCode}
                className="w-full px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                }}
              >
                <Download className="h-5 w-5" />
                Download QR Code
              </button>
            </div>

            {/* Ticket Details Card */}
            <div className="vision-glass-card p-[32px]" style={{ borderRadius: '20px' }}>
              <h2 className="text-[20px] font-bold text-white mb-[20px]">Ticket Details</h2>

              <div className="space-y-[16px]">
                {/* Ticket ID */}
                <div>
                  <p className="text-[12px] text-[#A0AEC0] mb-[4px]">Ticket ID</p>
                  <p className="text-[14px] font-mono text-white">{ticket.id}</p>
                </div>

                {/* Ticket Type */}
                <div>
                  <p className="text-[12px] text-[#A0AEC0] mb-[4px]">Ticket Type</p>
                  <p className="text-[14px] font-semibold text-white">{ticket.ticket_tier.name}</p>
                  {ticket.ticket_tier.description && (
                    <p className="text-[12px] text-[#A0AEC0] mt-1">{ticket.ticket_tier.description}</p>
                  )}
                </div>

                {/* Event Name */}
                <div>
                  <p className="text-[12px] text-[#A0AEC0] mb-[4px]">Event</p>
                  <p className="text-[14px] font-semibold text-white">{event.title}</p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-[12px] text-[#A0AEC0] mb-[4px]">Date & Time</p>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-[#7928CA] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[14px] text-white">
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-[12px] text-[#A0AEC0]">
                        {new Date(event.start_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[12px] text-[#A0AEC0] mb-[4px]">Location</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-[#7928CA] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[14px] text-white">
                        {event.is_virtual ? 'Virtual Event' : event.venue_name || event.location || 'TBA'}
                      </p>
                      {!event.is_virtual && event.location && (
                        <p className="text-[12px] text-[#A0AEC0]">{event.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Attendee Info */}
                <div className="pt-[16px] border-t border-white/10">
                  <p className="text-[12px] text-[#A0AEC0] mb-[8px]">Attendee Information</p>
                  <div className="space-y-[8px]">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#A0AEC0]" />
                      <p className="text-[14px] text-white">{ticket.user.full_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#A0AEC0]" />
                      <p className="text-[14px] text-white">{ticket.user.email}</p>
                    </div>
                    {ticket.user.company && (
                      <p className="text-[12px] text-[#A0AEC0]">
                        {ticket.user.job_title && `${ticket.user.job_title} at `}
                        {ticket.user.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-[24px] space-y-[12px]">
                <button
                  onClick={addToCalendar}
                  className="w-full px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Calendar className="h-5 w-5" />
                  Add to Calendar
                </button>

                <Link
                  href="/dashboard/vision/tickets"
                  className="block w-full px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-center text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <Ticket className="h-5 w-5 inline mr-2" />
                  View All My Tickets
                </Link>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="max-w-[900px] mx-auto mt-[32px]">
            <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
              <h3 className="text-[18px] font-bold text-white mb-[16px]">Important Information</h3>
              <ul className="space-y-[12px] text-[14px] text-[#A0AEC0]">
                <li className="flex items-start gap-2">
                  <span className="text-[#7928CA] mt-1">•</span>
                  <span>A confirmation email has been sent to <strong className="text-white">{ticket.user.email}</strong> with your ticket details and QR code.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7928CA] mt-1">•</span>
                  <span>Please save or download your QR code. You'll need to present it at the event entrance for check-in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7928CA] mt-1">•</span>
                  <span>Arrive at least 15 minutes before the event starts to allow time for check-in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#7928CA] mt-1">•</span>
                  <span>If you have any questions, please contact the event organizer.</span>
                </li>
              </ul>
            </div>
          </div>
        </main>

        <VisionFooter />
      </div>
    </div>
  )
}


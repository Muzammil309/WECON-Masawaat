'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Ticket, Calendar, MapPin, Download, Share2, CheckCircle, XCircle, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import QRCode from 'qrcode'

interface TicketData {
  id: string
  event_id: string
  event_name: string
  event_date: string
  event_time: string
  location: string
  ticket_tier: string
  price: number
  status: string
  qr_code: string
  checked_in: boolean
  checked_in_at: string | null
  purchase_date: string
}

export function MyTicketsContent() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCodeUrls, setQrCodeUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      fetchMyTickets()
    }
  }, [user])

  const fetchMyTickets = async () => {
    try {
      console.log('🎫 Fetching my tickets for user:', user?.id)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('em_tickets')
        .select(`
          id,
          event_id,
          qr_code,
          status,
          created_at,
          em_events!inner (
            id,
            name,
            start_date,
            start_time,
            location
          ),
          em_ticket_tiers!inner (
            name,
            price
          ),
          check_in_logs (
            checked_in_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching tickets:', error)
        toast.error('Failed to load your tickets')
        return
      }

      const formattedTickets: TicketData[] = (data || []).map((ticket: any) => ({
        id: ticket.id,
        event_id: ticket.em_events.id,
        event_name: ticket.em_events.name,
        event_date: ticket.em_events.start_date,
        event_time: ticket.em_events.start_time || '09:00',
        location: ticket.em_events.location || 'TBA',
        ticket_tier: ticket.em_ticket_tiers?.name || 'General',
        price: ticket.em_ticket_tiers?.price || 0,
        status: ticket.status,
        qr_code: ticket.qr_code,
        checked_in: ticket.check_in_logs && ticket.check_in_logs.length > 0,
        checked_in_at: ticket.check_in_logs?.[0]?.checked_in_at || null,
        purchase_date: ticket.created_at
      }))

      console.log('✅ Loaded tickets:', formattedTickets.length)
      setTickets(formattedTickets)

      // Generate QR codes
      formattedTickets.forEach(async (ticket) => {
        try {
          const url = await QRCode.toDataURL(ticket.qr_code, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
          setQrCodeUrls(prev => ({ ...prev, [ticket.id]: url }))
        } catch (err) {
          console.error('❌ Error generating QR code:', err)
        }
      })
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadTicket = (ticketId: string) => {
    toast.info('Ticket download feature coming soon!')
  }

  const handleShareTicket = (ticketId: string) => {
    toast.info('Ticket sharing feature coming soon!')
  }

  if (loading) {
    return (
      <div className="space-y-[24px] mt-[28px]">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[250px] w-full rounded-[20px]" />
        ))}
      </div>
    )
  }

  const activeTickets = tickets.filter(t => t.status === 'confirmed' && new Date(t.event_date) >= new Date())
  const pastTickets = tickets.filter(t => new Date(t.event_date) < new Date())
  const totalSpent = tickets.reduce((sum, t) => sum + t.price, 0)

  return (
    <div className="mt-[28px] space-y-[24px]">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Ticket className="h-[24px] w-[24px] text-purple-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Tickets
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {tickets.length}
          </p>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <Calendar className="h-[24px] w-[24px] text-blue-400" />
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Upcoming Events
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            {activeTickets.length}
          </p>
        </div>

        <div className="vision-glass-card p-[24px]">
          <div className="flex items-center gap-[12px] mb-[8px]">
            <span className="text-[24px]">💰</span>
            <span className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
              Total Spent
            </span>
          </div>
          <p className="text-[32px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            PKR {totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="vision-glass-card p-[48px] text-center">
          <Ticket className="h-[64px] w-[64px] text-gray-400 mx-auto mb-[16px]" />
          <h3 className="text-[20px] font-bold text-white mb-[8px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            No Tickets Found
          </h3>
          <p className="text-[14px] text-gray-400" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
            You haven't purchased any tickets yet
          </p>
        </div>
      ) : (
        <div className="space-y-[32px]">
          {/* Active Tickets */}
          {activeTickets.length > 0 && (
            <div>
              <h2 className="text-[24px] font-bold text-white mb-[20px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Active Tickets
              </h2>
              <div className="grid grid-cols-1 gap-[24px]">
                {activeTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    qrCodeUrl={qrCodeUrls[ticket.id]}
                    onDownload={handleDownloadTicket}
                    onShare={handleShareTicket}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Tickets */}
          {pastTickets.length > 0 && (
            <div>
              <h2 className="text-[24px] font-bold text-white mb-[20px]" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                Past Tickets
              </h2>
              <div className="grid grid-cols-1 gap-[24px]">
                {pastTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    qrCodeUrl={qrCodeUrls[ticket.id]}
                    onDownload={handleDownloadTicket}
                    onShare={handleShareTicket}
                    isPast
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface TicketCardProps {
  ticket: TicketData
  qrCodeUrl?: string
  onDownload: (id: string) => void
  onShare: (id: string) => void
  isPast?: boolean
}

function TicketCard({ ticket, qrCodeUrl, onDownload, onShare, isPast }: TicketCardProps) {
  return (
    <div className={`vision-glass-card p-[24px] ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex flex-col lg:flex-row gap-[24px]">
        {/* QR Code Section */}
        <div className="flex flex-col items-center gap-[12px]">
          <div className="w-[200px] h-[200px] bg-white rounded-[16px] p-[16px] flex items-center justify-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
            ) : (
              <QrCode className="h-[64px] w-[64px] text-gray-400" />
            )}
          </div>
          <span className="text-[12px] text-gray-400 font-mono">
            {ticket.id.slice(0, 8)}...
          </span>
        </div>

        {/* Ticket Details */}
        <div className="flex-1 space-y-[16px]">
          <div>
            <div className="flex items-start justify-between mb-[8px]">
              <h3 className="text-[20px] font-bold text-white" style={{ fontFamily: '"Plus Jakarta Display", sans-serif' }}>
                {ticket.event_name}
              </h3>
              {ticket.checked_in ? (
                <span className="px-[12px] py-[4px] rounded-[8px] text-[12px] font-medium bg-green-500/20 text-green-400 flex items-center gap-[6px]">
                  <CheckCircle className="h-[14px] w-[14px]" />
                  Checked In
                </span>
              ) : (
                <span className="px-[12px] py-[4px] rounded-[8px] text-[12px] font-medium bg-blue-500/20 text-blue-400">
                  Valid
                </span>
              )}
            </div>

            <div className="space-y-[8px]">
              <div className="flex items-center gap-[8px] text-[14px] text-gray-300">
                <Calendar className="h-[16px] w-[16px]" />
                <span>{format(new Date(ticket.event_date), 'MMMM dd, yyyy')} at {ticket.event_time}</span>
              </div>
              <div className="flex items-center gap-[8px] text-[14px] text-gray-300">
                <MapPin className="h-[16px] w-[16px]" />
                <span>{ticket.location}</span>
              </div>
            </div>
          </div>

          {/* Ticket Info */}
          <div className="flex flex-wrap items-center gap-[16px] text-[14px]">
            <span className="px-[12px] py-[6px] rounded-[8px] bg-purple-500/20 text-purple-300 font-medium">
              {ticket.ticket_tier}
            </span>
            <span className="text-gray-400">
              PKR {ticket.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-[12px]">
              Purchased: {format(new Date(ticket.purchase_date), 'MMM dd, yyyy')}
            </span>
          </div>

          {ticket.checked_in && ticket.checked_in_at && (
            <div className="text-[12px] text-green-400">
              Checked in on {format(new Date(ticket.checked_in_at), 'MMM dd, yyyy \'at\' HH:mm')}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-[12px]">
            <button
              onClick={() => onDownload(ticket.id)}
              className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
              style={{
                background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                color: '#fff',
              }}
            >
              <Download className="h-[16px] w-[16px]" />
              Download
            </button>
            <button
              onClick={() => onShare(ticket.id)}
              className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all flex items-center gap-[8px]"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                color: '#fff',
              }}
            >
              <Share2 className="h-[16px] w-[16px]" />
              Share
            </button>
            <button
              onClick={() => window.location.href = `/events/${ticket.event_id}`}
              className="px-[16px] py-[8px] rounded-[10px] text-[14px] font-medium transition-all"
              style={{
                background: 'rgba(26, 31, 55, 0.5)',
                border: '2px solid #151515',
                color: '#fff',
              }}
            >
              View Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


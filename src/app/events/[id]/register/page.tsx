'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { ArrowLeft, Calendar, MapPin, Ticket, User, Mail, Phone, Briefcase, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { z } from 'zod'

interface Event {
  id: string
  title: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  venue_name?: string
  cover_image_url?: string
  is_virtual: boolean
}

interface TicketTier {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  quantity_available?: number
  quantity_sold: number
  is_active: boolean
}

const registrationSchema = z.object({
  ticket_tier_id: z.string().min(1, 'Please select a ticket tier'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
})

export default function EventRegistrationPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    ticket_tier_id: '',
    full_name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/events/${eventId}/register`)
    }
  }, [user, authLoading, router, eventId])

  // Fetch event and ticket tiers
  useEffect(() => {
    if (user && eventId) {
      fetchEventData()
    }
  }, [user, eventId])

  const fetchEventData = async () => {
    try {
      setLoading(true)

      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}`)
      const eventData = await eventResponse.json()

      if (!eventData.success) {
        toast.error('Event not found')
        router.push('/events')
        return
      }

      setEvent(eventData.data)

      // Fetch ticket tiers
      const tiersResponse = await fetch(`/api/events/${eventId}/ticket-tiers`)
      const tiersData = await tiersResponse.json()

      if (tiersData.success) {
        setTicketTiers(tiersData.data || [])
      }
    } catch (error) {
      console.error('Error fetching event data:', error)
      toast.error('Failed to load event details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)

      // Validate form data
      const validatedData = registrationSchema.parse(formData)

      // Submit registration
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_tier_id: validatedData.ticket_tier_id,
          attendee_info: {
            full_name: validatedData.full_name,
            email: validatedData.email,
            phone: validatedData.phone,
            company: validatedData.company,
            job_title: validatedData.job_title,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Registration successful!')
        // Redirect to confirmation page with ticket data
        router.push(`/events/${eventId}/register/confirmation?ticket_id=${data.data.ticket.id}`)
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Error submitting registration:', error)
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message)
      } else {
        toast.error('Failed to register for event')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Show loading state while checking authentication
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535', fontFamily: '"Plus Jakarta Display", sans-serif' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !event) {
    return null
  }

  const selectedTier = ticketTiers.find(t => t.id === formData.ticket_tier_id)
  const isAvailable = selectedTier && (
    selectedTier.quantity_available === null ||
    selectedTier.quantity_available === undefined ||
    selectedTier.quantity_sold < selectedTier.quantity_available
  )

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
        <VisionTopbar title="Event Registration" breadcrumb="Events" />

        <main className="flex-1 p-[32px] relative z-10">
          {/* Back Button */}
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-2 text-[#A0AEC0] hover:text-white transition-colors mb-[24px]"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-[14px]">Back to Event</span>
          </Link>

          {/* Page Title */}
          <h1 className="text-[32px] font-bold text-white mb-[8px]">
            Register for Event
          </h1>
          <p className="text-[16px] text-[#A0AEC0] mb-[32px]">
            Complete the form below to register for {event.title}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
            {/* Registration Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="vision-glass-card p-[32px]" style={{ borderRadius: '20px' }}>
                {/* Ticket Selection */}
                <div className="mb-[32px]">
                  <h2 className="text-[20px] font-bold text-white mb-[16px]">Select Ticket</h2>
                  <div className="space-y-[12px]">
                    {ticketTiers.map((tier) => {
                      const available = tier.quantity_available === null || tier.quantity_available === undefined || tier.quantity_sold < tier.quantity_available
                      const selected = formData.ticket_tier_id === tier.id

                      return (
                        <label
                          key={tier.id}
                          className={`block p-[20px] rounded-[12px] border-2 cursor-pointer transition-all ${
                            selected
                              ? 'border-[#7928CA] bg-[#7928CA]/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          } ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="radio"
                            name="ticket_tier"
                            value={tier.id}
                            checked={selected}
                            onChange={(e) => setFormData({ ...formData, ticket_tier_id: e.target.value })}
                            disabled={!available}
                            className="sr-only"
                          />
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Ticket className="h-5 w-5 text-[#7928CA]" />
                                <h3 className="text-[16px] font-semibold text-white">{tier.name}</h3>
                              </div>
                              {tier.description && (
                                <p className="text-[14px] text-[#A0AEC0] mb-2">{tier.description}</p>
                              )}
                              <p className="text-[12px] text-[#A0AEC0]">
                                {available
                                  ? tier.quantity_available
                                    ? `${tier.quantity_available - tier.quantity_sold} tickets remaining`
                                    : 'Unlimited tickets'
                                  : 'Sold out'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-[24px] font-bold text-white">
                                {tier.price === 0 ? 'FREE' : `${tier.currency} ${tier.price}`}
                              </p>
                            </div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Attendee Information */}
                <div className="mb-[32px]">
                  <h2 className="text-[20px] font-bold text-white mb-[16px]">Attendee Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[14px] font-medium text-white mb-[8px]">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0AEC0]" />
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-[14px] font-medium text-white mb-[8px]">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0AEC0]" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-[14px] font-medium text-white mb-[8px]">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0AEC0]" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-[14px] font-medium text-white mb-[8px]">
                        Company
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0AEC0]" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                          placeholder="Acme Inc."
                        />
                      </div>
                    </div>

                    {/* Job Title */}
                    <div className="md:col-span-2">
                      <label className="block text-[14px] font-medium text-white mb-[8px]">
                        Job Title
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A0AEC0]" />
                        <input
                          type="text"
                          value={formData.job_title}
                          onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                          placeholder="Software Engineer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/events/${eventId}`}
                    className="px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-[#A0AEC0] hover:text-white transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting || !formData.ticket_tier_id || !isAvailable}
                    className="px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                    }}
                  >
                    {submitting ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>

            {/* Event Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="vision-glass-card p-[24px] sticky top-[32px]" style={{ borderRadius: '20px' }}>
                <h2 className="text-[18px] font-bold text-white mb-[16px]">Event Summary</h2>

                {/* Event Cover */}
                {event.cover_image_url && (
                  <div className="mb-[16px] rounded-[12px] overflow-hidden">
                    <img
                      src={event.cover_image_url}
                      alt={event.title}
                      className="w-full h-[160px] object-cover"
                    />
                  </div>
                )}

                {/* Event Title */}
                <h3 className="text-[16px] font-semibold text-white mb-[12px]">{event.title}</h3>

                {/* Event Details */}
                <div className="space-y-[12px] mb-[20px]">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#7928CA] flex-shrink-0 mt-0.5" />
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

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#7928CA] flex-shrink-0 mt-0.5" />
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

                {/* Selected Ticket Info */}
                {selectedTier && (
                  <div className="pt-[20px] border-t border-white/10">
                    <p className="text-[12px] text-[#A0AEC0] mb-[8px]">Selected Ticket</p>
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-semibold text-white">{selectedTier.name}</p>
                      <p className="text-[18px] font-bold text-white">
                        {selectedTier.price === 0 ? 'FREE' : `${selectedTier.currency} ${selectedTier.price}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <VisionFooter />
      </div>
    </div>
  )
}


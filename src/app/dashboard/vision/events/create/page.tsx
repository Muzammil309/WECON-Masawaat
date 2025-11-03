'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { VisionSidebar } from '@/components/vision-ui/layout/sidebar'
import { VisionTopbar } from '@/components/vision-ui/layout/topbar'
import { VisionFooter } from '@/components/vision-ui/layout/footer'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { z } from 'zod'

// Form validation schema
const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  location: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  max_attendees: z.number().min(1).optional(),
  is_virtual: z.boolean(),
  is_hybrid: z.boolean(),
  timezone: z.string(),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  status: z.enum(['draft', 'published']),
})

type EventFormData = z.infer<typeof eventSchema>

export default function CreateEventPage() {
  const { user, role } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    venue_name: '',
    venue_address: '',
    max_attendees: undefined,
    is_virtual: false,
    is_hybrid: false,
    timezone: 'UTC',
    cover_image_url: '',
    website_url: '',
    status: 'draft',
  })

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault()
    
    try {
      setLoading(true)

      // Validate form data
      const validatedData = eventSchema.parse({ ...formData, status })

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Event ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`)
        router.push('/dashboard/vision/events')
      } else {
        toast.error(data.error || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message)
      } else {
        toast.error('Failed to create event')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user || role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F1535' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-[#A0AEC0]">Only admins can create events.</p>
        </div>
      </div>
    )
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
      <div className="ml-[284px] p-[20px] relative z-10">
        {/* Top Navigation */}
        <VisionTopbar title="Create Event" breadcrumb="Events / Create" />

        {/* Page Content */}
        <div className="mt-[24px] space-y-[24px] max-w-[900px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/vision/events"
              className="flex items-center gap-2 text-[#A0AEC0] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-[14px] font-semibold">Back to Events</span>
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-[24px]">
            {/* Basic Information */}
            <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
              <h3 className="text-[18px] font-bold text-white mb-[20px]">Basic Information</h3>
              
              <div className="space-y-[16px]">
                {/* Title */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Event Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter event title"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter event description"
                    rows={4}
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors resize-none"
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  <div>
                    <label className="block text-[14px] font-semibold text-white mb-[8px]">
                      Start Date & Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[14px] font-semibold text-white mb-[8px]">
                      End Date & Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Timezone
                  </label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#7928CA]/50 transition-colors cursor-pointer"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
              <h3 className="text-[18px] font-bold text-white mb-[20px]">Location Details</h3>
              
              <div className="space-y-[16px]">
                {/* Event Type */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_virtual}
                      onChange={(e) => handleChange('is_virtual', e.target.checked)}
                      className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#7928CA] focus:ring-[#7928CA]"
                    />
                    <span className="text-[14px] text-white">Virtual Event</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_hybrid}
                      onChange={(e) => handleChange('is_hybrid', e.target.checked)}
                      className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#7928CA] focus:ring-[#7928CA]"
                    />
                    <span className="text-[14px] text-white">Hybrid Event</span>
                  </label>
                </div>

                {/* Venue Name */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={formData.venue_name}
                    onChange={(e) => handleChange('venue_name', e.target.value)}
                    placeholder="Enter venue name"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                  />
                </div>

                {/* Venue Address */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={formData.venue_address}
                    onChange={(e) => handleChange('venue_address', e.target.value)}
                    placeholder="Enter venue address"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                  />
                </div>

                {/* Location (City/Country) */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Location (City, Country)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="e.g., Dubai, UAE"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="vision-glass-card p-[24px]" style={{ borderRadius: '20px' }}>
              <h3 className="text-[18px] font-bold text-white mb-[20px]">Additional Settings</h3>

              <div className="space-y-[16px]">
                {/* Max Attendees */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    value={formData.max_attendees || ''}
                    onChange={(e) => handleChange('max_attendees', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Leave empty for unlimited"
                    min="1"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image_url}
                    onChange={(e) => handleChange('cover_image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                  />
                </div>

                {/* Website URL */}
                <div>
                  <label className="block text-[14px] font-semibold text-white mb-[8px]">
                    Event Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => handleChange('website_url', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-[12px] bg-white/5 border border-white/10 text-white placeholder-[#A0AEC0] focus:outline-none focus:border-[#7928CA]/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pb-[40px]">
              <button
                type="button"
                onClick={(e) => handleSubmit(e as any, 'draft')}
                disabled={loading}
                className="flex items-center gap-2 px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white bg-white/10 hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" strokeWidth={2.5} />
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-[24px] py-[12px] rounded-[12px] font-semibold text-[14px] text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #7928CA 0%, #4318FF 100%)',
                }}
              >
                <Eye className="h-5 w-5" strokeWidth={2.5} />
                {loading ? 'Creating...' : 'Publish Event'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <VisionFooter />
      </div>
    </div>
  )
}


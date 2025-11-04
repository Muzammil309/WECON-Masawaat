'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Clock,
  Calendar,
  MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface ProfileData {
  profile: {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    company?: string
    job_title?: string
    phone?: string
    bio?: string
    role: string
  }
  events: Array<{
    ticket_id: string
    event_id: string
    event_title: string
    event_start_date: string
    event_end_date: string
    event_location?: string
    event_venue_name?: string
    event_status: string
    event_cover_image?: string
    ticket_tier_name: string
    ticket_status: string
    checked_in: boolean
    checked_in_at?: string
  }>
  total_events: number
  checked_in_events: number
}

interface ProfilePreviewDialogProps {
  open: boolean
  onClose: () => void
  profileData: ProfileData | null
  onCheckIn: (ticketId: string, eventTitle: string) => void
  isProcessing: boolean
}

export function ProfilePreviewDialog({
  open,
  onClose,
  profileData,
  onCheckIn,
  isProcessing,
}: ProfilePreviewDialogProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)

  if (!profileData) return null

  const { profile, events } = profileData

  const handleCheckIn = () => {
    if (!selectedTicketId) {
      toast.error('Please select an event to check in')
      return
    }

    const selectedEvent = events.find(e => e.ticket_id === selectedTicketId)
    if (selectedEvent) {
      onCheckIn(selectedTicketId, selectedEvent.event_title)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Attendee Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback className="text-lg">
                {getInitials(profile.full_name || 'User')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-xl font-bold">{profile.full_name}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {profile.email}
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {profile.phone}
                  </div>
                )}
                {profile.company && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    {profile.company}
                  </div>
                )}
                {profile.job_title && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {profile.job_title}
                  </div>
                )}
              </div>
            </div>

            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
              {profile.role}
            </Badge>
          </div>

          {/* Events Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {profileData.total_events}
              </div>
              <div className="text-sm text-muted-foreground">Registered Events</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {profileData.checked_in_events}
              </div>
              <div className="text-sm text-muted-foreground">Checked In</div>
            </div>
          </div>

          {/* Events List */}
          <div>
            <h4 className="font-semibold mb-3">Registered Events</h4>
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No events registered</p>
              </div>
            ) : (
              <div className="space-y-2">
                {events.map((event) => (
                  <div
                    key={event.ticket_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTicketId === event.ticket_id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${event.checked_in ? 'opacity-60' : ''}`}
                    onClick={() => !event.checked_in && setSelectedTicketId(event.ticket_id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold">{event.event_title}</h5>
                          {event.checked_in && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Checked In
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(event.event_start_date), 'PPP')}
                          </div>
                          {event.event_venue_name && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {event.event_venue_name}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {event.ticket_tier_name}
                            </Badge>
                          </div>
                        </div>
                        {event.checked_in && event.checked_in_at && (
                          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Checked in at {format(new Date(event.checked_in_at), 'PPp')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleCheckIn}
              disabled={!selectedTicketId || isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : 'Check In to Selected Event'}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


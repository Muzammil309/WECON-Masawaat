'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

interface SessionFormData {
  title: string
  description: string
  start_time: string
  end_time: string
  room: string
  track: string
  max_attendees: number | null
}

interface SessionFormProps {
  eventId: string
  onSuccess?: () => void
}

export function SessionForm({ eventId, onSuccess }: SessionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    room: '',
    track: '',
    max_attendees: null,
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('em_sessions')
        .insert({
          event_id: eventId,
          title: formData.title,
          description: formData.description,
          start_time: formData.start_time,
          end_time: formData.end_time,
          room: formData.room || null,
          track: formData.track || null,
          max_attendees: formData.max_attendees,
        })

      if (error) {
        toast.error('Failed to create session: ' + error.message)
      } else {
        toast.success('Session created successfully!')
        setFormData({
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          room: '',
          track: '',
          max_attendees: null,
        })
        onSuccess?.()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof SessionFormData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Create Session
        </CardTitle>
        <CardDescription>
          Add a new session to your event agenda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter session title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the session content..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Start Time *
              </Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                End Time *
              </Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="room" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Room/Location
              </Label>
              <Input
                id="room"
                type="text"
                placeholder="e.g., Main Hall, Room A"
                value={formData.room}
                onChange={(e) => handleInputChange('room', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="track">Track</Label>
              <Input
                id="track"
                type="text"
                placeholder="e.g., Technical, Business"
                value={formData.track}
                onChange={(e) => handleInputChange('track', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_attendees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Maximum Attendees
            </Label>
            <Input
              id="max_attendees"
              type="number"
              placeholder="Leave empty for unlimited"
              value={formData.max_attendees || ''}
              onChange={(e) => handleInputChange('max_attendees', e.target.value ? parseInt(e.target.value) : null)}
              min="1"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Create Session'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

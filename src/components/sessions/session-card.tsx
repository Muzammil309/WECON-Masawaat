import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, MapPin, Users, User } from 'lucide-react'
import { format } from 'date-fns'

interface Session {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  room: string | null
  track: string | null
  max_attendees: number | null
}

interface Speaker {
  id: string
  name: string
  title: string | null
  company: string | null
}

interface SessionCardProps {
  session: Session
  speakers?: Speaker[]
  showActions?: boolean
  onEdit?: (sessionId: string) => void
  onManageSpeakers?: (sessionId: string) => void
}

export function SessionCard({ 
  session, 
  speakers = [], 
  showActions = false, 
  onEdit, 
  onManageSpeakers 
}: SessionCardProps) {
  const startTime = new Date(session.start_time)
  const endTime = new Date(session.end_time)
  
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)) // minutes

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-2">{session.title}</CardTitle>
            {session.track && (
              <Badge variant="outline">{session.track}</Badge>
            )}
          </div>
          {session.description && (
            <CardDescription className="line-clamp-3">
              {session.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Time and Duration */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(startTime, 'MMM d, p')} - {format(endTime, 'p')}
            </span>
          </div>
          <div className="text-xs text-muted-foreground ml-6">
            Duration: {duration} minutes
          </div>
        </div>

        {/* Location */}
        {session.room && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{session.room}</span>
          </div>
        )}

        {/* Capacity */}
        {session.max_attendees && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Max {session.max_attendees} attendees</span>
          </div>
        )}

        {/* Speakers */}
        {speakers.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Speakers
            </div>
            <div className="space-y-1">
              {speakers.map((speaker) => (
                <div key={speaker.id} className="text-sm">
                  <div className="font-medium">{speaker.name}</div>
                  {(speaker.title || speaker.company) && (
                    <div className="text-xs text-muted-foreground">
                      {[speaker.title, speaker.company].filter(Boolean).join(' at ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit?.(session.id)}
              className="flex-1"
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onManageSpeakers?.(session.id)}
              className="flex-1"
            >
              Speakers
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

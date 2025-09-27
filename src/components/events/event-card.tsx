import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  location: string | null
  max_attendees: number | null
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  created_at: string
}

interface EventCardProps {
  event: Event
  showActions?: boolean
}

export function EventCard({ event, showActions = false }: EventCardProps) {
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {event.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(event.status)}>
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(startDate, 'PPP')}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {format(startDate, 'p')} - {format(endDate, 'p')}
            </span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          )}
          
          {event.max_attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Max {event.max_attendees} attendees</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/events/${event.id}`}>
              View Details
            </Link>
          </Button>
          
          {showActions && (
            <Button asChild size="sm" className="flex-1">
              <Link href={`/events/${event.id}/edit`}>
                Edit
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

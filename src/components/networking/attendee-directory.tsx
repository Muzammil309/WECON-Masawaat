'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Users, Search, MessageCircle, UserPlus, Building, MapPin } from 'lucide-react'
import { toast } from 'sonner'

interface Attendee {
  id: string
  user_id: string
  profile: {
    full_name: string | null
    email: string
    company: string | null
    job_title: string | null
    bio: string | null
    location: string | null
  }
  ticket_tier: {
    name: string
  }
}

interface AttendeeDirectoryProps {
  eventId: string
}

export function AttendeeDirectory({ eventId }: AttendeeDirectoryProps) {
  const { user } = useAuth()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [connections, setConnections] = useState<Set<string>>(new Set())
  
  const supabase = createClient()

  useEffect(() => {
    if (!user) return
    fetchAttendees()
    fetchConnections()
  }, [user, eventId])

  useEffect(() => {
    filterAttendees()
  }, [attendees, searchTerm])

  const fetchAttendees = async () => {
    try {
      const { data, error } = await supabase
        .from('em_tickets')
        .select(`
          id,
          user_id,
          profile:em_profiles(full_name, email, company, job_title, bio, location),
          ticket_tier:em_ticket_tiers(name)
        `)
        .eq('order.event_id', eventId)
        .eq('checked_in', true) // Only show checked-in attendees

      if (error) {
        console.error('Error fetching attendees:', error)
        toast.error('Failed to load attendees')
      } else {
        // Remove duplicates and current user
        const uniqueAttendees = (data as unknown as Attendee[])?.filter((attendee, index, self) =>
          attendee.user_id !== user?.id &&
          index === self.findIndex(a => a.user_id === attendee.user_id)
        ) || []

        setAttendees(uniqueAttendees)
      }
    } catch (error) {
      console.error('Error fetching attendees:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConnections = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('em_connections')
        .select('connected_user_id')
        .eq('user_id', user.id)
        .eq('status', 'accepted')

      if (!error && data) {
        setConnections(new Set(data.map((c: any) => c.connected_user_id)))
      }
    } catch (error) {
      console.error('Error fetching connections:', error)
    }
  }

  const filterAttendees = () => {
    if (!searchTerm.trim()) {
      setFilteredAttendees(attendees)
      return
    }

    const filtered = attendees.filter(attendee => {
      const profile = attendee.profile
      const searchLower = searchTerm.toLowerCase()
      
      return (
        profile.full_name?.toLowerCase().includes(searchLower) ||
        profile.email.toLowerCase().includes(searchLower) ||
        profile.company?.toLowerCase().includes(searchLower) ||
        profile.job_title?.toLowerCase().includes(searchLower) ||
        attendee.ticket_tier.name.toLowerCase().includes(searchLower)
      )
    })

    setFilteredAttendees(filtered)
  }

  const sendConnectionRequest = async (targetUserId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('em_connections')
        .insert({
          user_id: user.id,
          connected_user_id: targetUserId,
          status: 'pending',
        })

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Connection request already sent')
        } else {
          toast.error('Failed to send connection request')
        }
      } else {
        toast.success('Connection request sent!')
      }
    } catch (error) {
      toast.error('Failed to send connection request')
    }
  }

  const startChat = async (targetUserId: string) => {
    // This would typically navigate to a private chat or open a chat modal
    toast.info('Chat feature coming soon!')
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return email.charAt(0).toUpperCase()
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Networking Unavailable</CardTitle>
          <CardDescription>
            Please sign in to connect with other attendees.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Attendee Directory
        </CardTitle>
        <CardDescription>
          Connect with other event attendees
        </CardDescription>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredAttendees.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {searchTerm ? 'No attendees found matching your search.' : 'No attendees to show.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAttendees.map((attendee) => (
                <Card key={attendee.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {getInitials(attendee.profile.full_name, attendee.profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold">
                          {attendee.profile.full_name || attendee.profile.email}
                        </h3>
                        {attendee.profile.job_title && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            {attendee.profile.job_title}
                            {attendee.profile.company && ` at ${attendee.profile.company}`}
                          </p>
                        )}
                        {attendee.profile.location && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {attendee.profile.location}
                          </p>
                        )}
                      </div>

                      {attendee.profile.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {attendee.profile.bio}
                        </p>
                      )}

                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {attendee.ticket_tier.name}
                        </Badge>
                        {connections.has(attendee.user_id) && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Connected
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!connections.has(attendee.user_id) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => sendConnectionRequest(attendee.user_id)}
                          >
                            <UserPlus className="mr-1 h-4 w-4" />
                            Connect
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startChat(attendee.user_id)}
                        >
                          <MessageCircle className="mr-1 h-4 w-4" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

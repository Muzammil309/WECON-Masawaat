'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Settings, 
  Plus, 
  Eye,
  Edit,
  Ticket,
  MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string
  status: 'draft' | 'published' | 'cancelled' | 'completed'
  created_at: string
  _count?: {
    tickets: number
    sessions: number
  }
}

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchUserEvents()
    }
  }, [user])

  const fetchUserEvents = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('em_events')
        .select(`
          *,
          tickets:em_tickets(count),
          sessions:em_sessions(count)
        `)
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching events:', error)
      } else {
        // Process the data to get counts
        const processedEvents = data?.map(event => ({
          ...event,
          _count: {
            tickets: event.tickets?.length || 0,
            sessions: event.sessions?.length || 0
          }
        })) || []
        
        setEvents(processedEvents)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-4">
          Please sign in to access the admin dashboard.
        </p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and view analytics
          </p>
        </div>
        
        <Button asChild>
          <Link href="/events/create" legacyBehavior>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            My Events
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsDashboard organizerId={user.id} />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {events.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  No Events Yet
                </CardTitle>
                <CardDescription>
                  Create your first event to get started with event management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/events/create" legacyBehavior>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="h-full">
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
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.start_date), 'PPP')}</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{event._count?.tickets || 0}</div>
                        <p className="text-xs text-muted-foreground">Tickets</p>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{event._count?.sessions || 0}</div>
                        <p className="text-xs text-muted-foreground">Sessions</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}`} legacyBehavior>
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}/edit`} legacyBehavior>
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}/tickets`} legacyBehavior>
                          <Ticket className="mr-1 h-4 w-4" />
                          Tickets
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/events/${event.id}/agenda`} legacyBehavior>
                          <Calendar className="mr-1 h-4 w-4" />
                          Agenda
                        </Link>
                      </Button>
                    </div>

                    {event.status === 'published' && (
                      <Button variant="default" size="sm" className="w-full" asChild>
                        <Link href={`/events/${event.id}/live`} legacyBehavior>
                          <MessageSquare className="mr-1 h-4 w-4" />
                          Go Live
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Profile Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: {user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Name: {user.user_metadata?.full_name || 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Notification preferences coming soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

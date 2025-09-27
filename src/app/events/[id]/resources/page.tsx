'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { FileUpload } from '@/components/storage/file-upload'
import { FileBrowser } from '@/components/storage/file-browser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { ArrowLeft, Upload, FolderOpen, Users } from 'lucide-react'

interface Event {
  id: string
  title: string
  organizer_id: string
}

export default function EventResourcesPage() {
  const params = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  
  const supabase = createClient()

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string)
    }
  }, [params.id])

  const fetchEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('em_events')
        .select('id, title, organizer_id')
        .eq('id', eventId)
        .single()

      if (error) {
        console.error('Error fetching event:', error)
      } else {
        setEvent(data)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = () => {
    // Refresh the file browser
    setRefreshKey(prev => prev + 1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
        <Button asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    )
  }

  const isOrganizer = user?.id === event.organizer_id

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/events/${event.id}`} legacyBehavior>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Event Resources</h1>
          <p className="text-muted-foreground">{event.title}</p>
        </div>
      </div>
      {!user ? (
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access event resources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Browse Files
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
            {isOrganizer && (
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Access
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <FileBrowser 
              key={refreshKey}
              eventId={event.id} 
              canDelete={isOrganizer}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Event Resources</CardTitle>
                <CardDescription>
                  Share presentations, documents, images, and other files with event attendees.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  eventId={event.id}
                  onUploadComplete={handleUploadComplete}
                  acceptedTypes={[
                    'image/*',
                    'application/pdf',
                    '.ppt',
                    '.pptx',
                    '.doc',
                    '.docx',
                    '.xls',
                    '.xlsx',
                    'video/*',
                    'audio/*',
                    '.zip',
                    '.rar'
                  ]}
                  maxSizeMB={100}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Accepted File Types</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Documents:</strong> PDF, Word, Excel, PowerPoint</li>
                    <li>• <strong>Images:</strong> JPG, PNG, GIF, SVG</li>
                    <li>• <strong>Media:</strong> MP4, MP3, WAV</li>
                    <li>• <strong>Archives:</strong> ZIP, RAR</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">File Size Limits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Maximum file size: 100MB</li>
                    <li>• For larger files, consider using cloud storage links</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use descriptive file names</li>
                    <li>• Compress large files when possible</li>
                    <li>• Organize files by session or topic</li>
                    <li>• Test file accessibility before the event</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isOrganizer && (
            <TabsContent value="manage" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Management</CardTitle>
                  <CardDescription>
                    Control who can upload and access event resources.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Current Settings</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• All registered attendees can view files</li>
                      <li>• All registered attendees can upload files</li>
                      <li>• Only organizers can delete files</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Advanced access controls and permissions 
                      will be available in a future update. Currently, all registered 
                      attendees have upload and view access to event resources.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Storage Usage</CardTitle>
                  <CardDescription>
                    Monitor your event's file storage usage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Storage analytics and usage metrics will be available in a future update.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}

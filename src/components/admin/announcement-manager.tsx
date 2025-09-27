'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Megaphone, Plus, Edit, Trash2, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Announcement {
  id: string
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  active: boolean
  created_at: string
}

interface AnnouncementFormData {
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  active: boolean
}

interface AnnouncementManagerProps {
  eventId: string
}

export function AnnouncementManager({ eventId }: AnnouncementManagerProps) {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    priority: 'medium',
    active: true,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchAnnouncements()
  }, [eventId])

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('em_announcements')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching announcements:', error)
        toast.error('Failed to load announcements')
      } else {
        setAnnouncements(data || [])
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || isSaving) return

    setIsSaving(true)

    try {
      if (editingId) {
        // Update existing announcement
        const { error } = await supabase
          .from('em_announcements')
          .update({
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
            active: formData.active,
          })
          .eq('id', editingId)

        if (error) {
          toast.error('Failed to update announcement: ' + error.message)
        } else {
          toast.success('Announcement updated successfully!')
          resetForm()
          fetchAnnouncements()
        }
      } else {
        // Create new announcement
        const { error } = await supabase
          .from('em_announcements')
          .insert({
            event_id: eventId,
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
            active: formData.active,
          })

        if (error) {
          toast.error('Failed to create announcement: ' + error.message)
        } else {
          toast.success('Announcement created successfully!')
          resetForm()
          fetchAnnouncements()
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      active: announcement.active,
    })
    setEditingId(announcement.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const { error } = await supabase
        .from('em_announcements')
        .delete()
        .eq('id', id)

      if (error) {
        toast.error('Failed to delete announcement: ' + error.message)
      } else {
        toast.success('Announcement deleted successfully!')
        fetchAnnouncements()
      }
    } catch (error) {
      toast.error('Failed to delete announcement')
    }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from('em_announcements')
        .update({ active })
        .eq('id', id)

      if (error) {
        toast.error('Failed to update announcement: ' + error.message)
      } else {
        toast.success(`Announcement ${active ? 'activated' : 'deactivated'}!`)
        fetchAnnouncements()
      }
    } catch (error) {
      toast.error('Failed to update announcement')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      active: true,
    })
    setEditingId(null)
    setShowForm(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Announcements
          </h2>
          <p className="text-muted-foreground">
            Manage announcements for digital signage displays
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Cancel' : 'New Announcement'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Announcement content"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="active">Active</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, active: checked }))
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.active ? 'Visible on signage' : 'Hidden from signage'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Announcements</CardTitle>
            <CardDescription>
              Create your first announcement to display on digital signage.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority}
                      </Badge>
                      {!announcement.active && (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {format(new Date(announcement.created_at), 'PPp')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={announcement.active}
                      onCheckedChange={(checked) => toggleActive(announcement.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

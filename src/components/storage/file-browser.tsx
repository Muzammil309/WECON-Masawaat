'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  Download,
  Trash2,
  MoreVertical,
  Search,
  FolderOpen,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface FileRecord {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
  created_at: string
  user_id: string
  session_id: string | null
  profile: {
    full_name: string | null
    email: string
  }
}

interface FileBrowserProps {
  eventId: string
  sessionId?: string
  canDelete?: boolean
}

export function FileBrowser({ eventId, sessionId, canDelete = false }: FileBrowserProps) {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileRecord[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    fetchFiles()
  }, [eventId, sessionId])

  useEffect(() => {
    filterFiles()
  }, [files, searchTerm])

  const fetchFiles = async () => {
    try {
      let query = supabase
        .from('em_files')
        .select(`
          *,
          profile:em_profiles(full_name, email)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (sessionId) {
        query = query.eq('session_id', sessionId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching files:', error)
        toast.error('Failed to load files')
      } else {
        setFiles(data || [])
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterFiles = () => {
    if (!searchTerm.trim()) {
      setFilteredFiles(files)
      return
    }

    const filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.type.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredFiles(filtered)
  }

  const handleDownload = async (file: FileRecord) => {
    try {
      const { data, error } = await supabase.storage
        .from('event-files')
        .download(file.path)

      if (error) {
        throw error
      }

      // Create download link
      const url = URL.createObjectURL(data)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(`Downloaded ${file.name}`)
    } catch (error: any) {
      console.error('Download error:', error)
      toast.error(`Failed to download ${file.name}: ${error.message}`)
    }
  }

  const handleDelete = async (file: FileRecord) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('event-files')
        .remove([file.path])

      if (storageError) {
        throw storageError
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('em_files')
        .delete()
        .eq('id', file.id)

      if (dbError) {
        throw dbError
      }

      toast.success(`Deleted ${file.name}`)
      fetchFiles()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(`Failed to delete ${file.name}: ${error.message}`)
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5 text-blue-500" />
    if (type.startsWith('video/')) return <Video className="h-5 w-5 text-purple-500" />
    if (type.startsWith('audio/')) return <Music className="h-5 w-5 text-green-500" />
    if (type.includes('pdf') || type.includes('document') || type.includes('presentation')) {
      return <FileText className="h-5 w-5 text-red-500" />
    }
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith('image/')) return 'Image'
    if (type.startsWith('video/')) return 'Video'
    if (type.startsWith('audio/')) return 'Audio'
    if (type.includes('pdf')) return 'PDF'
    if (type.includes('presentation')) return 'Presentation'
    if (type.includes('document')) return 'Document'
    return 'File'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          <h3 className="font-semibold">
            {sessionId ? 'Session Files' : 'Event Files'}
          </h3>
          <Badge variant="outline">{files.length} files</Badge>
        </div>
        
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No files found' : 'No files uploaded'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Upload files to get started'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {getFileTypeLabel(file.type)}
                        </Badge>
                        <span>
                          Uploaded by {file.profile.full_name || file.profile.email}
                        </span>
                        <span>{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openInNewTab(file.url)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>

                    {(canDelete || user?.id === file.user_id) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDelete(file)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
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

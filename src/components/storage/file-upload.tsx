'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Video, 
  Music,
  X,
  Check
} from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  eventId: string
  sessionId?: string
  onUploadComplete?: (file: UploadedFile) => void
  acceptedTypes?: string[]
  maxSizeMB?: number
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  path: string
}

interface UploadProgress {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  url?: string
}

export function FileUpload({ 
  eventId, 
  sessionId, 
  onUploadComplete,
  acceptedTypes = ['image/*', 'application/pdf', '.ppt', '.pptx', '.doc', '.docx'],
  maxSizeMB = 50
}: FileUploadProps) {
  const { user } = useAuth()
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  const handleFileSelect = (files: FileList | null) => {
    if (!files || !user) return

    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is ${maxSizeMB}MB.`)
        return false
      }
      return true
    })

    validFiles.forEach(file => {
      uploadFile(file)
    })
  }

  const uploadFile = async (file: File) => {
    const uploadId = Math.random().toString(36).substring(7)
    
    // Add to uploads state
    setUploads(prev => [...prev, {
      file,
      progress: 0,
      status: 'uploading'
    }])

    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${uploadId}.${fileExt}`
      const filePath = `events/${eventId}/${sessionId ? `sessions/${sessionId}/` : ''}${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('event-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('event-files')
        .getPublicUrl(filePath)

      // Save file metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('em_files')
        .insert({
          event_id: eventId,
          session_id: sessionId || null,
          user_id: user?.id || '',
          name: file.name,
          size: file.size,
          type: file.type,
          path: filePath,
          url: publicUrl
        })
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      // Update upload status
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, progress: 100, status: 'completed', url: publicUrl }
          : upload
      ))

      toast.success(`${file.name} uploaded successfully!`)
      
      if (onUploadComplete && fileRecord) {
        onUploadComplete(fileRecord)
      }

    } catch (error: any) {
      console.error('Upload error:', error)
      setUploads(prev => prev.map(upload => 
        upload.file === file 
          ? { ...upload, status: 'error' }
          : upload
      ))
      toast.error(`Failed to upload ${file.name}: ${error.message}`)
    }
  }

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />
    if (type.includes('pdf') || type.includes('document') || type.includes('presentation')) {
      return <FileText className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload Unavailable</CardTitle>
          <CardDescription>
            Please sign in to upload files.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-4">
            Maximum file size: {maxSizeMB}MB. 
            Accepted types: {acceptedTypes.join(', ')}
          </p>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploads.map((upload, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getFileIcon(upload.file.type)}
                    <span className="text-sm font-medium">{upload.file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(upload.file.size)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {upload.status === 'completed' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Complete
                      </Badge>
                    )}
                    {upload.status === 'error' && (
                      <Badge variant="destructive">
                        Error
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.file)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {upload.status === 'uploading' && (
                  <Progress value={upload.progress} className="h-2" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

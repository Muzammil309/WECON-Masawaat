'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Save, X, Plus } from 'lucide-react'
import type { EnhancedProfile } from '@/types/profile'
import { INTEREST_CATEGORIES } from '@/types/profile'

interface ProfileFormProps {
  profile: EnhancedProfile
  onUpdate: (profile: EnhancedProfile) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || '',
    email: profile.email || '',
    company: profile.company || '',
    job_title: profile.job_title || '',
    bio: profile.bio || '',
    location: profile.location || '',
    phone: profile.phone || '',
    linkedin_url: profile.linkedin_url || '',
    twitter_url: profile.twitter_url || '',
    github_url: profile.github_url || '',
    website_url: profile.website_url || '',
  })
  
  const [interests, setInterests] = useState<string[]>(profile.networking_interests || [])
  const [newInterest, setNewInterest] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests(prev => [...prev, interest])
      setNewInterest('')
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)

      const { data, error } = await supabase
        .from('em_profiles')
        .update({
          full_name: formData.full_name,
          company: formData.company,
          job_title: formData.job_title,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          linkedin_url: formData.linkedin_url,
          twitter_url: formData.twitter_url,
          github_url: formData.github_url,
          website_url: formData.website_url,
          networking_interests: interests,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error

      onUpdate(data as EnhancedProfile)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card
        className="vision-glass-card"
        style={{
          background: 'rgba(26, 31, 55, 0.5)',
          backdropFilter: 'blur(21px)',
          border: '2px solid #151515',
          borderRadius: '20px'
        }}
      >
        <CardHeader>
          <CardTitle style={{ color: '#fff', fontSize: '24px' }}>Edit Profile</CardTitle>
          <CardDescription style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Update your personal information and networking interests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Acme Inc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Social Links</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter/X</Label>
                <Input
                  id="twitter_url"
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => handleChange('twitter_url', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => handleChange('github_url', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url">Website</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => handleChange('website_url', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          {/* Networking Interests */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Networking Interests</h3>
              <p className="text-xs text-gray-500">
                Add topics you're interested in to help us connect you with like-minded attendees
              </p>
            </div>

            {/* Selected Interests */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Interest */}
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Type an interest..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddInterest(newInterest)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddInterest(newInterest)}
                disabled={!newInterest}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Interests */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Suggested:</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_CATEGORIES.slice(0, 10).map((category) => (
                  !interests.includes(category) && (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleAddInterest(category)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {category}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}


'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { AvatarUploadDialog } from './avatar-upload-dialog'
import { Camera, MapPin, Briefcase, Award, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react'
import type { EnhancedProfile, UserBadge } from '@/types/profile'

interface ProfileHeaderProps {
  profile: EnhancedProfile
  badges: UserBadge[]
}

export function ProfileHeader({ profile, badges }: ProfileHeaderProps) {
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)

  const getInitials = (name: string | null) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const calculateProfileCompletion = () => {
    const fields = [
      profile.full_name,
      profile.avatar_url,
      profile.bio,
      profile.company,
      profile.job_title,
      profile.location,
      profile.networking_interests?.length > 0,
      profile.linkedin_url || profile.twitter_url || profile.github_url,
    ]
    const completed = fields.filter(Boolean).length
    return Math.round((completed / fields.length) * 100)
  }

  const completionPercentage = calculateProfileCompletion()
  const displayedBadges = badges.filter(b => b.is_displayed).slice(0, 3)

  return (
    <>
      <Card
        className="relative overflow-hidden vision-glass-card"
        style={{
          background: 'rgba(26, 31, 55, 0.5)',
          backdropFilter: 'blur(21px)',
          border: '2px solid #151515',
          borderRadius: '20px'
        }}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-purple-600/10" />

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar Section */}
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-purple-600 shadow-xl">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>

              {/* Upload Button Overlay */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setShowAvatarUpload(true)}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl font-bold text-white">
                    {profile.full_name || 'Anonymous User'}
                  </h1>
                  {profile.profile_completed ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Incomplete
                    </Badge>
                  )}
                  <Badge variant="outline" className="capitalize">
                    {profile.role}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-300">
                  {profile.job_title && profile.company && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{profile.job_title} at {profile.company}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-300 max-w-2xl line-clamp-2">
                  {profile.bio}
                </p>
              )}

              {/* Displayed Badges */}
              {displayedBadges.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {displayedBadges.map((userBadge) => (
                    <Badge
                      key={userBadge.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Award className="h-3 w-3" />
                      {userBadge.badge?.name}
                    </Badge>
                  ))}
                  {badges.length > 3 && (
                    <Badge variant="outline">
                      +{badges.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              {/* Points */}
              <div
                className="rounded-lg p-4 shadow-sm"
                style={{
                  background: 'rgba(26, 31, 55, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Total Points</span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {profile.total_points.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {badges.length} badges earned
                </div>
              </div>

              {/* Profile Completion */}
              <div
                className="rounded-lg p-4 shadow-sm"
                style={{
                  background: 'rgba(26, 31, 55, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Profile Completion</span>
                  <span className="text-sm font-bold text-white">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                {completionPercentage < 100 && (
                  <div className="text-xs text-gray-400 mt-2">
                    Complete your profile to unlock more features
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        open={showAvatarUpload}
        onOpenChange={setShowAvatarUpload}
        currentAvatarUrl={profile.avatar_url}
        userId={profile.id}
      />
    </>
  )
}


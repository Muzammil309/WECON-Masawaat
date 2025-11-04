'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { ProfileForm } from '@/components/profile/profile-form'
import { ProfileHeader } from '@/components/profile/profile-header'
import { BadgesSection } from '@/components/profile/badges-section'
import { PointsHistory } from '@/components/profile/points-history'
import { QRCodeSection } from '@/components/profile/qr-code-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { EnhancedProfile, UserBadge, PointsEntry } from '@/types/profile'

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<EnhancedProfile | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [points, setPoints] = useState<PointsEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const loadProfileData = async () => {
      try {
        setLoading(true)

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('em_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData as EnhancedProfile)

        // Load badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('em_user_badges')
          .select(`
            *,
            badge:em_badges(*)
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false })

        if (!badgesError && badgesData) {
          setBadges(badgesData as UserBadge[])
        }

        // Load points history
        const { data: pointsData, error: pointsError } = await supabase
          .from('em_points')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (!pointsError && pointsData) {
          setPoints(pointsData as PointsEntry[])
        }
      } catch (error) {
        console.error('Error loading profile data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [user, supabase])

  const handleProfileUpdate = async (updatedProfile: EnhancedProfile) => {
    setProfile(updatedProfile)
    toast.success('Profile updated successfully!')
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto p-6 space-y-8">
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              Unable to load your profile. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      {/* Profile Header with Avatar and Stats */}
      <ProfileHeader profile={profile} badges={badges} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
          <TabsTrigger value="badges">
            Badges ({badges.length})
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          <ProfileForm
            profile={profile}
            onUpdate={handleProfileUpdate}
          />
        </TabsContent>

        <TabsContent value="qr-code" className="space-y-6">
          <QRCodeSection userId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <BadgesSection
            userBadges={badges}
            totalPoints={profile.total_points}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <PointsHistory points={points} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


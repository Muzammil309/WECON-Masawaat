'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Trophy, Star, Sparkles } from 'lucide-react'
import type { UserBadge } from '@/types/profile'
import { BADGE_RARITIES } from '@/types/profile'
import { format } from 'date-fns'

interface BadgesSectionProps {
  userBadges: UserBadge[]
  totalPoints: number
}

export function BadgesSection({ userBadges, totalPoints }: BadgesSectionProps) {
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <Trophy className="h-5 w-5" />
      case 'epic':
        return <Star className="h-5 w-5" />
      case 'rare':
        return <Sparkles className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const getRarityConfig = (rarity: string) => {
    return BADGE_RARITIES[rarity as keyof typeof BADGE_RARITIES] || BADGE_RARITIES.common
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
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
          <CardTitle style={{ color: '#fff', fontSize: '24px' }}>Your Achievements</CardTitle>
          <CardDescription style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            You've earned {userBadges.length} badge{userBadges.length !== 1 ? 's' : ''} and {totalPoints.toLocaleString()} points
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Badges Grid */}
      {userBadges.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userBadges.map((userBadge) => {
            const badge = userBadge.badge
            if (!badge) return null

            const rarityConfig = getRarityConfig(badge.rarity)

            return (
              <Card
                key={userBadge.id}
                className="relative overflow-hidden vision-glass-card"
                style={{
                  background: 'rgba(26, 31, 55, 0.5)',
                  backdropFilter: 'blur(21px)',
                  border: '2px solid #151515',
                  borderRadius: '20px'
                }}
              >
                {/* Rarity Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${rarityConfig.gradient} opacity-5`} />

                <CardContent className="relative p-6">
                  <div className="flex items-start gap-4">
                    {/* Badge Icon */}
                    <div className={`flex-shrink-0 h-16 w-16 rounded-full bg-gradient-to-br ${rarityConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {getRarityIcon(badge.rarity)}
                    </div>

                    {/* Badge Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white truncate">
                          {badge.name}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0 text-xs">
                          {badge.points} pts
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                        {badge.description}
                      </p>

                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="secondary" className={`bg-${rarityConfig.color}-100 text-${rarityConfig.color}-700`}>
                          {rarityConfig.label}
                        </Badge>
                        <span className="text-gray-400">
                          {format(new Date(userBadge.earned_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card
          className="vision-glass-card"
          style={{
            background: 'rgba(26, 31, 55, 0.5)',
            backdropFilter: 'blur(21px)',
            border: '2px solid #151515',
            borderRadius: '20px'
          }}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Award className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Badges Yet
            </h3>
            <p className="text-gray-300 max-w-md">
              Start attending sessions, networking with other attendees, and participating in activities to earn badges!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

